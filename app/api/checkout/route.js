import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Stripe from "stripe";
import { connectDB } from "@/lib/databaseconnection";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import CouponModel from "@/models/Coupon.model";
// Explicit import to register the Media schema in Mongoose runtime
import MediaModel from "@/models/Media.model";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Shipping rates in GBP (£)
const shippingMap = {
  london: 3.99,
  uk_other: 5.99,
};

export async function POST(req) {
  try {
    await connectDB();

    // Guarantee Media model registration before querying
    if (!mongoose.models.Media) {
      mongoose.model("Media", MediaModel.schema);
    }

    const body = await req.json().catch(() => ({}));
    const { customer, items, coupon, userId } = body;

    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        { success: false, message: "Missing customer info" },
        { status: 400 },
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart empty" },
        { status: 400 },
      );
    }

    // ==============================
    // FETCH PRODUCTS
    // ==============================
    const productIds = items.map((i) => i.productId).filter(Boolean);

    const dbProducts = await ProductModel.find({
      _id: { $in: productIds },
    })
      .populate("media", "secure_url")
      .lean();

    const productMap = new Map(dbProducts.map((p) => [String(p._id), p]));

    // ==============================
    // CLEAN & VALIDATE ITEMS
    // ==============================
    const clean = items
      .map((it) => {
        const id = String(it.productId);
        const product = productMap.get(id);

        if (!product) return null;

        const unitPrice = Number(product.sellingPrice || product.price || 0);

        return {
          productId: product._id,
          name: product.name,
          image: product.media?.[0]?.secure_url || "",
          price: unitPrice,
          quantity: Math.max(1, Number(it.quantity || 1)),
          notes: it.notes || "",
        };
      })
      .filter(Boolean);

    if (clean.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid items found in cart" },
        { status: 400 },
      );
    }

    // ==============================
    // CALCULATE TOTALS (GBP)
    // ==============================
    const subtotal = clean.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const region = String(customer.cityId || "london").toLowerCase();
    const deliveryFee = shippingMap[region] ?? 5.99;

    let discount = 0;
    let couponData = {
      code: "",
      discountPercentage: 0,
    };

    if (coupon?.code) {
      const couponDoc = await CouponModel.findOne({
        code: {
          $regex: new RegExp(`^${coupon.code.trim()}$`, "i"),
        },
        deletedAt: null,
      }).lean();

      if (couponDoc && subtotal >= (couponDoc.minShoppingAmount || 0)) {
        discount = Number(
          ((subtotal * couponDoc.discountPercentage) / 100).toFixed(2),
        );
        couponData = {
          code: couponDoc.code,
          discountPercentage: couponDoc.discountPercentage,
        };
      }
    }

    const total = Math.max(
      Number((subtotal + deliveryFee - discount).toFixed(2)),
      0,
    );

    const tempId = new mongoose.Types.ObjectId();
    const orderNumber = `ORD-${tempId.toString().slice(-6).toUpperCase()}`;

    // ==============================
    // CREATE PENDING ORDER
    // ==============================
    const orderDocs = await OrderModel.create(
      [
        {
          _id: tempId,
          orderNumber,
          userId: userId || null,
          customer: {
            ...customer,
            cityId: region,
          },
          items: clean,
          subtotal,
          deliveryFee,
          discount,
          total,
          coupon: couponData,
          orderStatus: "pending",
          paymentMethodSelected: "stripe",
          paymentStatus: "unpaid",
          payments: [
            {
              method: "stripe",
              paymentStatus: "unpaid",
              amount: total,
              initiatedAt: new Date(),
            },
          ],
        },
      ],
      { validateBeforeSave: false },
    );

    const order = orderDocs[0];

    // ==============================
    // CREATE STRIPE SESSION (GBP £)
    // ==============================
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const lineItems = clean.map((item) => ({
      price_data: {
        currency: "gbp", // Set currency to GBP
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // convert to pence
      },
      quantity: item.quantity,
    }));

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "UK Shipping Fee",
          },
          unit_amount: Math.round(deliveryFee * 100), // convert to pence
        },
        quantity: 1,
      });
    }

    // Stripe coupon discount handling (if discount applied)
    let discounts = [];
    if (discount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100), // pence
        currency: "gbp",
        duration: "once",
        name: `Discount (${couponData.code})`,
      });
      discounts.push({ coupon: stripeCoupon.id });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      discounts: discounts.length > 0 ? discounts : undefined,
      client_reference_id: order._id.toString(),
      customer_email: customer.email || undefined,
      success_url: `${origin}/order-success?orderId=${order._id.toString()}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: orderNumber,
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      orderId: order._id.toString(),
      orderNumber,
    });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseconnection";
import OrderModel from "@/models/Order.model";
import stripe from "@/lib/stripe";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID required",
        },
        {
          status: 400,
        },
      );
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    if (order.paymentMethodSelected !== "stripe") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method",
        },
        {
          status: 400,
        },
      );
    }

    // =============================
    // Stripe Line Items
    // =============================

    const lineItems = order.items.map((item) => {
      return {
        price_data: {
          currency: "bdt",

          product_data: {
            name: item.name,

            images: item.image ? [item.image] : [],
          },

          unit_amount: Math.round(item.price * 100),
        },

        quantity: item.quantity,
      };
    });

    // Add delivery fee

    if (order.deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "bdt",

          product_data: {
            name: "Delivery Charge",
          },

          unit_amount: order.deliveryFee * 100,
        },

        quantity: 1,
      });
    }

    // Discount

    if (order.discount > 0) {
      lineItems.push({
        price_data: {
          currency: "bdt",

          product_data: {
            name: "Discount",
          },

          unit_amount: -order.discount * 100,
        },

        quantity: 1,
      });
    }

    // =============================
    // Create Stripe Session
    // =============================

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: lineItems,

      customer_email: order.customer.email || undefined,

      metadata: {
        orderId: order._id.toString(),

        orderNumber: order.orderNumber,
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?orderId=${order._id}`,
    });

    // Save Stripe Session ID

    order.payments[0].stripeSessionId = session.id;

    await order.save();

    return NextResponse.json({
      success: true,

      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },

      {
        status: 500,
      },
    );
  }
}

import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/databaseconnection";

import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";

export const runtime = "nodejs";

export async function POST(req) {
  console.log("🔥 WEBHOOK API HIT");

  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  let event;

  // ============================
  // VERIFY STRIPE SIGNATURE
  // ============================

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("✅ Stripe webhook:", event.type);
  } catch (error) {
    console.error("Webhook signature error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid signature",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await connectDB();

    // ============================
    // PAYMENT SUCCESS
    // ============================

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      console.log("Order ID:", orderId);

      if (!orderId) {
        return NextResponse.json({
          received: true,
        });
      }

      const order = await OrderModel.findById(orderId);

      if (!order) {
        console.log("Order not found");

        return NextResponse.json({
          received: true,
        });
      }

      // ============================
      // DUPLICATE PROTECTION
      // ============================

      if (order.payment.status === "paid") {
        console.log("Already processed");

        return NextResponse.json({
          received: true,
        });
      }

      // ============================
      // UPDATE PAYMENT
      // ============================

      order.payment.status = "paid";

      order.payment.stripeSessionId = session.id;

      order.payment.paymentIntentId = session.payment_intent || "";

      order.payment.transactionId = session.payment_intent || "";

      order.payment.paidAt = new Date();

      // ============================
      // CUSTOMER FRIENDLY STATUS
      // ============================

      order.orderStatus = "placed";

      order.statusHistory.push({
        status: "placed",

        updatedAt: new Date(),
      });

      await order.save();

      console.log("✅ Payment completed - Order Placed");

      // ============================
      // REDUCE STOCK
      // ============================

      await Promise.all(
        order.items.map(async (item) => {
          try {
            const result = await ProductModel.updateOne(
              {
                _id: item.productId,

                stock: {
                  $gte: item.quantity,
                },
              },

              {
                $inc: {
                  stock: -item.quantity,
                },
              },
            );

            if (result.modifiedCount) {
              console.log(`Stock reduced: ${item.name}`);
            } else {
              console.log(`Stock not available: ${item.name}`);
            }
          } catch (error) {
            console.error("Stock error:", error.message);
          }
        }),
      );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

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

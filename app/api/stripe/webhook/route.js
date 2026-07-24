import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { connectDB } from "@/lib/databaseconnection";

import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";

export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,

      signature,

      process.env.STRIPE_WEBHOOK_SECRET,
    );
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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata.orderId;

      const order = await OrderModel.findById(orderId);

      if (!order) {
        return NextResponse.json({
          received: true,
        });
      }

      // Already paid protection

      if (order.paymentStatus === "paid") {
        return NextResponse.json({
          received: true,
        });
      }

      // =====================
      // Update Payment
      // =====================

      order.paymentStatus = "paid";

      order.orderStatus = "confirmed";

      if (order.payments.length) {
        order.payments[0].paymentStatus = "paid";

        order.payments[0].stripeSessionId = session.id;

        order.payments[0].paymentIntentId = session.payment_intent;

        order.payments[0].paidAt = new Date();
      }

      await order.save();

      // =====================
      // Reduce Stock
      // =====================

      await Promise.all(
        order.items.map(async (item) => {
          const Model = item.variantId ? ProductVariantModel : ProductModel;

          await Model.updateOne(
            {
              _id: item.variantId || item.productId,

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

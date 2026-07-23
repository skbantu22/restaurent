"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import StripeProvider from "./StripeProvider";
import CheckoutForm from "./CheckoutForm";

export default function PaymentPage({ cartItems, shippingInfo, user }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createOrder();
  }, []);

  async function createOrder() {
    try {
      setLoading(true);

      const subtotal = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      const shipping = 0;

      const total = subtotal + shipping;

      // Create Pending Order
      const orderRes = await axios.post("/api/order", {
        userId: user?._id,
        products: cartItems,
        shippingInfo,
        subtotal,
        shipping,
        total,
      });

      const order = orderRes.data;

      // Create Stripe PaymentIntent
      const paymentRes = await axios.post("/api/stripe/create-payment-intent", {
        amount: Math.round(total * 100),
        orderId: order._id,
      });

      setClientSecret(paymentRes.data.clientSecret);
    } catch (err) {
      console.error(err);
      alert("Unable to initialize payment.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-20 text-red-500">
        Payment initialization failed.
      </div>
    );
  }

  return (
    <StripeProvider clientSecret={clientSecret}>
      <CheckoutForm />
    </StripeProvider>
  );
}

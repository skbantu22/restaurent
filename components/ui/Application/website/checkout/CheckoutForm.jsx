"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    if (result.paymentIntent) {
      switch (result.paymentIntent.status) {
        case "succeeded":
          router.push("/payment-success");
          break;

        case "processing":
          setMessage("Payment processing...");
          break;

        default:
          router.push("/payment-failed");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {message && <div className="text-red-500">{message}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

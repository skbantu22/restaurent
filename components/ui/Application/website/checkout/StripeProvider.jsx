"use client";

import { Elements } from "@stripe/react-stripe-js";
import getStripe from "@/lib/getStripe";

export default function StripeProvider({ clientSecret, children }) {
  const stripePromise = getStripe();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      {children}
    </Elements>
  );
}

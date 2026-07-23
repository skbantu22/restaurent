"use client";

import React, { useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zSchema } from "@/lib/zodschema";
import { showToast } from "@/lib/showToast";

// Format currency to GBP (£)
const formatCurrency = (amount) =>
  `£${Number(amount || 0).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CheckoutPage() {
  const cartStore = useSelector((store) => store.cartStore);
  const authStore = useSelector((store) => store.authStore);

  const products = Array.isArray(cartStore?.products) ? cartStore.products : [];
  // UK delivery region: "london" or "uk_other"
  const [deliveryRegion, setDeliveryRegion] = useState("london");
  const [placingOrder, setPlacingOrder] = useState(false);

  const subtotal = useMemo(
    () =>
      products.reduce(
        (acc, item) =>
          acc +
          Number(item?.sellingPrice || item?.price || 0) *
            Number(item?.quantity || 1),
        0,
      ),
    [products],
  );

  // Shipping rates in GBP (£)
  const shippingCost = deliveryRegion === "london" ? 3.99 : 5.99;
  const total = subtotal + shippingCost;

  const orderForm = useForm({
    resolver: zodResolver(
      zSchema.pick({ name: true, phone: true, address: true }),
    ),
    defaultValues: {
      name: authStore?.auth?.name || "",
      phone: authStore?.auth?.phone || "",
      address: authStore?.auth?.address || "",
    },
  });

  const placeOrder = async (formData) => {
    if (products.length === 0) {
      showToast("error", "Your cart is empty");
      return;
    }

    setPlacingOrder(true);

    try {
      const payload = {
        paymentMethod: "stripe",
        userId: authStore?.auth?._id || null,
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          cityId: deliveryRegion,
        },
        items: products.map((item) => ({
          productId: item.productId || item._id,
          quantity: Number(item.quantity || 1),
          notes: item.notes || "",
        })),
      };

      const { data } = await axios.post("/api/checkout", payload);

      if (!data.success) {
        throw new Error(data.message || "Order placement failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Payment session URL not generated.");
      }
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Failed to initiate payment",
      );
      setPlacingOrder(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Delivery Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            UK Delivery Details
          </h2>
          <Form {...orderForm}>
            <form
              id="checkout-form"
              onSubmit={orderForm.handleSubmit(placeOrder)}
              className="space-y-4"
            >
              <FormField
                control={orderForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Full Name *</Label>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={orderForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label>UK Phone Number *</Label>
                    <FormControl>
                      <Input placeholder="+44 7123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={orderForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <Label>Delivery Address & Postcode *</Label>
                    <FormControl>
                      <Input
                        placeholder="10 Downing St, London, SW1A 2AA"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* UK Shipping Options */}
              <div className="pt-2">
                <Label className="mb-2 block font-medium">
                  Shipping Option *
                </Label>
                <RadioGroup
                  value={deliveryRegion}
                  onValueChange={setDeliveryRegion}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                      deliveryRegion === "london"
                        ? "border-black bg-gray-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setDeliveryRegion("london")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="london" id="london" />
                      <Label htmlFor="london" className="cursor-pointer">
                        London (Standard)
                      </Label>
                    </div>
                    <span className="font-semibold text-sm">£3.99</span>
                  </div>

                  <div
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                      deliveryRegion === "uk_other"
                        ? "border-black bg-gray-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setDeliveryRegion("uk_other")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="uk_other" id="uk_other" />
                      <Label htmlFor="uk_other" className="cursor-pointer">
                        Rest of UK
                      </Label>
                    </div>
                    <span className="font-semibold text-sm">£5.99</span>
                  </div>
                </RadioGroup>
              </div>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Order Summary
          </h3>

          {/* Cart Items List */}
          <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
            {products.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  {item.thumbnail || item.image ? (
                    <img
                      src={item.thumbnail || item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : null}
                  <div>
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-gray-500 text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold">
                  {formatCurrency(
                    (item.sellingPrice || item.price || 0) * item.quantity,
                  )}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Totals */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(shippingCost)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-1">
              <span>Total Amount</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Stripe Payment Note */}
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-3">
            <CreditCard className="text-indigo-600 w-6 h-6 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-900">
                Secure Card Payment
              </p>
              <p className="text-[11px] text-indigo-700">
                You will be redirected to Stripe to pay in GBP (£) safely.
              </p>
            </div>
          </div>

          <Button
            form="checkout-form"
            type="submit"
            className="w-full mt-6 bg-black hover:bg-gray-800 text-white h-12 text-base font-semibold"
            disabled={placingOrder || products.length === 0}
          >
            {placingOrder
              ? "Redirecting to Stripe..."
              : `Pay Now - ${formatCurrency(total)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}

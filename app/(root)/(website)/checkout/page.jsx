"use client";

import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShoppingBag,
  Tag,
  X,
  MapPin,
  LocateFixed,
  Loader2,
  ShieldCheck,
  ArrowRight,
  UtensilsCrossed,
  AlertCircle,
  PhoneCall,
  Navigation,
} from "lucide-react";

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
import { zSchema } from "@/lib/zodschema";
import { showToast } from "@/lib/showToast";

const formatCurrency = (amount) =>
  `£${Number(amount || 0).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Hackney, East London Centre Coordinates
const HACKNEY_CENTRE = {
  lat: 51.545,
  lng: -0.055,
};

// Haversine formula to calculate distance in miles
const calculateDistanceInMiles = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function CheckoutPage() {
  const cartStore = useSelector((store) => store.cartStore);
  const authStore = useSelector((store) => store.authStore);

  const products = Array.isArray(cartStore?.products) ? cartStore.products : [];

  const [placingOrder, setPlacingOrder] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [checkingDistance, setCheckingDistance] = useState(false);
  const [deliveryDistance, setDeliveryDistance] = useState(null);
  const [isOutOfRange, setIsOutOfRange] = useState(false);

  // Foodpanda/Uber style auto-location permission modal state
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Coupon states
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

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

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return (subtotal * Number(appliedCoupon.discountPercentage)) / 100;
  }, [subtotal, appliedCoupon]);

  const shippingCost = 3.99;
  const total = Math.max(0, subtotal - discountAmount) + shippingCost;

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

  // Page duklei (Mount hole) Foodpanda/Uber er moto location popup show korbe (yodi address age theke na thake)
  useEffect(() => {
    const currentAddress = orderForm.getValues("address");
    if (!currentAddress || currentAddress.trim() === "") {
      const timer = setTimeout(() => {
        setShowLocationModal(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const processCoordinates = async (lat, lng) => {
    const distance = calculateDistanceInMiles(
      HACKNEY_CENTRE.lat,
      HACKNEY_CENTRE.lng,
      lat,
      lng,
    );
    setDeliveryDistance(distance);

    if (distance > 5) {
      setIsOutOfRange(true);
    } else {
      setIsOutOfRange(false);
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        orderForm.setValue(
          "address",
          `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
          {
            shouldValidate: true,
          },
        );
        return;
      }

      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
      );

      if (data.status === "OK" && data.results[0]) {
        orderForm.setValue("address", data.results[0].formatted_address, {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }
  };

  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      showToast("error", "Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    setShowLocationModal(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await processCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );
        setGettingLocation(false);
        showToast("success", "Location detected successfully!");
      },
      () => {
        setGettingLocation(false);
        showToast("error", "Location permission denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const verifyTypedAddress = async (addressText) => {
    if (!addressText || addressText.trim().length < 3) {
      setIsOutOfRange(false);
      setDeliveryDistance(null);
      return;
    }

    setCheckingDistance(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const isLocalTest = /hackney|e8|e2|e9|n1|london/i.test(addressText);

      if (!apiKey) {
        setIsOutOfRange(!isLocalTest);
        setDeliveryDistance(isLocalTest ? 2.0 : 10.0);
        setCheckingDistance(false);
        return;
      }

      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          addressText,
        )}&key=${apiKey}`,
      );

      if (data.status === "OK" && data.results[0]) {
        const location = data.results[0].geometry.location;
        const distance = calculateDistanceInMiles(
          HACKNEY_CENTRE.lat,
          HACKNEY_CENTRE.lng,
          location.lat,
          location.lng,
        );

        setDeliveryDistance(distance);
        if (distance > 5) {
          setIsOutOfRange(true);
        } else {
          setIsOutOfRange(false);
        }
      } else {
        if (isLocalTest) {
          setIsOutOfRange(false);
          setDeliveryDistance(2.0);
        } else {
          setIsOutOfRange(true);
          setDeliveryDistance(10.0);
        }
      }
    } catch (error) {
      console.error("Geocoding error", error);
      const isLocalTest = /hackney|e8|e2|e9|n1|london/i.test(addressText);
      setIsOutOfRange(!isLocalTest);
      setDeliveryDistance(isLocalTest ? 2.0 : 10.0);
    } finally {
      setCheckingDistance(false);
    }
  };

  const placeOrder = async (formData) => {
    if (products.length === 0) {
      showToast("error", "Cart is empty");
      return;
    }

    if (isOutOfRange) {
      showToast(
        "error",
        "Delivery is only available within 5 miles of Hackney.",
      );
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
          cityId: "london",
        },
        items: products.map((item) => ({
          productId: item.productId || item._id,
          quantity: Number(item.quantity || 1),
          notes: item.notes || "",
        })),
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              discountPercentage: appliedCoupon.discountPercentage,
              discountAmount: discountAmount,
            }
          : null,
      };

      const { data } = await axios.post("/api/checkout", payload);

      if (!data.success) throw new Error(data.message);

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Payment failed");
      setPlacingOrder(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-6 text-zinc-900 relative">
      {/* Foodpanda / Uber style Auto Location Permission Popup Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 w-full max-w-md p-6 text-center shadow-2xl rounded-none relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-zinc-100 border border-zinc-300 flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-6 h-6 text-zinc-900 animate-pulse" />
            </div>

            <h3 className="text-lg font-medium text-zinc-900 uppercase tracking-wide mb-2">
              Enable Delivery Location
            </h3>
            <p className="text-xs text-zinc-600 mb-6 leading-relaxed">
              We need your location to check if you are within our 5-mile
              delivery radius from Hackney and provide accurate delivery.
            </p>

            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleAutoDetectGPS}
                disabled={gettingLocation}
                className="w-full rounded-none bg-zinc-900 hover:bg-zinc-800 text-white h-11 text-xs uppercase font-bold tracking-wider"
              >
                {gettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                    Detecting...
                  </>
                ) : (
                  "Use Current Location"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLocationModal(false)}
                className="w-full rounded-none border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 h-11 text-xs uppercase"
              >
                Enter Manually
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Minimalist Header Section */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-light tracking-tight text-zinc-900 uppercase">
            Checkout
          </h1>
          <div className="w-10 h-[1px] bg-zinc-300 mx-auto mt-2"></div>
        </div>

        {/* Out of Range Notice Banner */}
        {isOutOfRange && (
          <div className="mb-6 p-5 bg-zinc-900 text-white border border-zinc-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-sm uppercase tracking-wide">
                  Outside Delivery Radius (&gt;5 Miles)
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {deliveryDistance !== null
                    ? `Your entered address is ~${deliveryDistance.toFixed(1)} miles away from Hackney.`
                    : `Please enter an address within 5 miles of Hackney.`}
                </p>
              </div>
            </div>
            <a
              href="tel:+4466464654"
              className="whitespace-nowrap rounded-none bg-white text-zinc-900 hover:bg-zinc-200 px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"
            >
              <PhoneCall className="w-4 h-4" /> Contact: +4466464654
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#FAFAFA] p-6 sm:p-8 border border-zinc-300 rounded-none shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-300 mb-6">
              <h2 className="text-base font-medium text-zinc-900 tracking-wide">
                Delivery Information
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoDetectGPS}
                disabled={gettingLocation}
                className="rounded-none border-zinc-400 bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white h-9 text-xs uppercase"
              >
                {gettingLocation ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5 mr-2" />
                )}
                Auto-Detect GPS
              </Button>
            </div>

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
                      <Label className="text-xs font-semibold uppercase text-zinc-700 tracking-wider">
                        Full Name *
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="rounded-none border-zinc-400 bg-white text-zinc-900 placeholder:text-zinc-400 h-11 focus-visible:ring-1 focus-visible:ring-zinc-900"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={orderForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-xs font-semibold uppercase text-zinc-700 tracking-wider">
                        UK Phone Number *
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="+44 7123 456789"
                          {...field}
                          className="rounded-none border-zinc-400 bg-white text-zinc-900 placeholder:text-zinc-400 h-11 focus-visible:ring-1 focus-visible:ring-zinc-900"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={orderForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-xs font-semibold uppercase text-zinc-700 tracking-wider">
                        Street Address & UK Postcode *
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                          <Input
                            placeholder="Type postcode e.g. E8 1EB or address to test"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              verifyTypedAddress(e.target.value);
                            }}
                            className="rounded-none border-zinc-400 bg-white text-zinc-900 placeholder:text-zinc-400 h-11 pl-10 focus-visible:ring-1 focus-visible:ring-zinc-900"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs" />
                    </FormItem>
                  )}
                />

                {checkingDistance && (
                  <div className="text-xs text-zinc-500 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking
                    distance from Hackney...
                  </div>
                )}

                <div className="pt-1">
                  <Label className="text-xs font-semibold uppercase text-zinc-700 tracking-wider mb-2 block">
                    Delivery Fee
                  </Label>
                  <div className="flex items-center justify-between p-3.5 border border-zinc-400 bg-white">
                    <span className="text-sm font-medium text-zinc-800">
                      Hackney Local Delivery (Within 5 Miles)
                    </span>
                    <span className="font-semibold text-zinc-900">£3.99</span>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 bg-[#FAFAFA] p-6 sm:p-8 border border-zinc-300 rounded-none shadow-sm h-fit">
            <h3 className="text-base font-medium text-zinc-900 pb-4 border-b border-zinc-300 mb-5 flex justify-between tracking-wide">
              <span>ORDER SUMMARY</span>
              <span className="text-xs text-zinc-500 font-normal">
                {products.length} Items
              </span>
            </h3>

            <div className="max-h-56 overflow-y-auto space-y-3 mb-5 pr-2">
              {products.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm border-b border-zinc-200 pb-2.5"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.thumbnail || item.image}
                      alt=""
                      className="w-11 h-11 object-cover border border-zinc-300"
                    />
                    <div>
                      <p className="font-medium text-zinc-900 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-zinc-900">
                    {formatCurrency(
                      (item.sellingPrice || item.price || 0) * item.quantity,
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Box */}
            <div className="mb-5">
              {appliedCoupon ? (
                <div className="flex justify-between items-center bg-white border border-zinc-400 p-2.5 text-sm">
                  <span className="text-xs uppercase text-zinc-900 font-semibold tracking-wider">
                    {appliedCoupon.code} ({appliedCoupon.discountPercentage}%
                    OFF)
                  </span>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-zinc-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="COUPON CODE"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="uppercase rounded-none border-zinc-400 bg-white text-zinc-900 placeholder:text-zinc-400 h-10 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!couponCodeInput.trim()) return;
                      setValidatingCoupon(true);
                      axios
                        .post("/api/coupons/verify", {
                          code: couponCodeInput.trim(),
                          subtotalAmount: subtotal,
                        })
                        .then(({ data }) => {
                          if (!data.success) throw new Error(data.message);
                          setAppliedCoupon(data.coupon);
                          showToast(
                            "success",
                            `Coupon "${data.coupon.code}" applied!`,
                          );
                          setCouponCodeInput("");
                        })
                        .catch((err) =>
                          showToast(
                            "error",
                            err.response?.data?.message || "Invalid coupon",
                          ),
                        )
                        .finally(() => setValidatingCoupon(false));
                    }}
                    disabled={validatingCoupon}
                    className="rounded-none border-zinc-400 bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white h-10 text-xs uppercase px-4 font-semibold"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm text-zinc-700 mb-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-900 font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-zinc-900 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-zinc-900 font-medium">
                  {formatCurrency(shippingCost)}
                </span>
              </div>
              <Separator className="bg-zinc-300 my-2.5" />
              <div className="flex justify-between font-bold text-base text-zinc-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-zinc-300 flex items-center gap-3 mb-5">
              <ShieldCheck className="text-zinc-900 w-5 h-5 shrink-0" />
              <p className="text-[11px] text-zinc-600">
                Secured & encrypted payment powered by Stripe.
              </p>
            </div>

            <Button
              form="checkout-form"
              type="submit"
              className="w-full rounded-none bg-zinc-900 hover:bg-zinc-800 text-white h-11 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2"
              disabled={placingOrder || products.length === 0 || isOutOfRange}
            >
              {placingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : isOutOfRange ? (
                "Call: +4466464654 (Out of Range)"
              ) : (
                <>
                  Pay Now — {formatCurrency(total)}{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

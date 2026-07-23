import mongoose from "mongoose";
import crypto from "crypto";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const PaymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["cod", "stripe"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    amount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "BDT",
    },

    stripeSessionId: {
      type: String,
      default: "",
    },

    paymentIntentId: {
      type: String,
      default: "",
    },

    stripeCustomerId: {
      type: String,
      default: "",
    },

    transactionId: {
      type: String,
      default: "",
    },

    rawResponse: {
      type: Object,
      default: {},
    },

    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    customer: {
      name: String,
      phone: String,
      email: String,
      address: String,
    },

    items: {
      type: [OrderItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "BDT",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    paymentMethodSelected: {
      type: String,
      enum: ["cod", "stripe"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },

    payments: {
      type: [PaymentSchema],
      default: [],
    },

    activePaymentIndex: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

OrderSchema.pre("validate", function () {
  if (!this.orderNumber) {
    this.orderNumber =
      "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

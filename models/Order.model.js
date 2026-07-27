import mongoose from "mongoose";
import crypto from "crypto";

const ORDER_STATUSES = [
  "placed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "cancelled", "refunded"];

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
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
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
      default: "stripe",
    },

    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
    },

    stripeSessionId: {
      type: String,
      default: "",
    },

    paymentIntentId: {
      type: String,
      default: "",
    },

    transactionId: {
      type: String,
      default: "",
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
      index: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
      index: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },
    },

    deliveryAddress: {
      type: {
        address: {
          type: String,
          default: "",
          trim: true,
        },
        city: {
          type: String,
          default: "",
          trim: true,
        },
        postcode: {
          type: String,
          default: "",
          trim: true,
        },
        notes: {
          type: String,
          default: "",
          trim: true,
        },
      },
      default: {},
    },

    items: {
      type: [OrderItemSchema],
      default: [],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    payment: {
      type: PaymentSchema,
      required: true,
      default: () => ({
        method: "stripe",
        status: "pending",
      }),
    },

    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },

    statusHistory: {
      type: [
        {
          status: {
            type: String,
            enum: ORDER_STATUSES,
          },
          updatedAt: {
            type: Date,
            default: Date.now,
          },
          updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
          },
        },
      ],
      default: [],
    },

    coupon: {
      code: {
        type: String,
        default: "",
        trim: true,
      },
      discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for Floating Live Order / Active status check
OrderSchema.virtual("isActive").get(function () {
  return !["completed", "cancelled"].includes(this.orderStatus);
});

// Compound Index for fast queries like GET /api/orders/ongoing
OrderSchema.index({
  userId: 1,
  orderStatus: 1,
  createdAt: -1,
});

OrderSchema.pre("validate", function () {
  if (!this.orderNumber) {
    this.orderNumber =
      "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  }
});

// Pre Save Hook for Status History & Auto Update
OrderSchema.pre("save", function () {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.orderStatus,
      updatedAt: new Date(),
    });
  }

  if (!this.isNew && this.isModified("orderStatus")) {
    this.statusHistory.push({
      status: this.orderStatus,
      updatedAt: new Date(),
    });
  }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: false,
      default: null,
    },
    calories: {
      type: Number,
      default: null,
    },

    mrp: { type: Number, required: true, min: 0 },

    sellingPrice: { type: Number, required: true, min: 0 },

    discountPercentage: { type: Number, min: 0, max: 100 },

    // 🟢 1. isMostLoved ফিল্ড যুক্ত করা হলো (Default: false)
    isMostLoved: { type: Boolean, default: false, index: true },

    // 🟢 2. Dynamic Badge ফিল্ড যুক্ত করা হলো (e.g. "must try", "popular")
    badge: { type: String, default: "", trim: true },

    // রেস্তোরাঁর জন্য প্রমোশন বা ট্যাগ (যেমন: combo, chef-special, trending)
    offers: {
      type: [String],
      enum: ["mega", "new", "top", "free", "combo", "chef-special"],
      default: [],
    },

    freeDelivery: { type: Boolean, default: false },

    media: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
    ],

    description: { type: String, required: true },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

// Indexes
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ offers: 1 });
productSchema.index({ isMostLoved: 1 }); // Fast query execution for homepage/menu

const ProductModel =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "products");

export default ProductModel;

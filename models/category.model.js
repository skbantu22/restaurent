import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Fast lookup by slug in frontend routes
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ FIXED: Array of ObjectIds referencing your Media model
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],

    // ✅ Soft Delete Support
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

const CategoryModel =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema, "categories");

export default CategoryModel;

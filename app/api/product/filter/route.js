import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseconnection";
import ProductModel from "@/models/Product.model";
import CategoryModel from "@/models/category.model";
import MediaModel from "@/models/Media.model";
const CATEGORY_MAP = {
  beef: ["smash-burgers", "steak-burger-premium-burgers"],
  chicken: ["chicken-burgers"],
  plant: ["plant-based"],
};

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type || !CATEGORY_MAP[type]) {
      return NextResponse.json(
        { success: false, message: "Invalid type" },
        { status: 400 },
      );
    }

    // Find category ids by slug
    const categories = await CategoryModel.find({
      slug: { $in: CATEGORY_MAP[type] },
      deletedAt: null,
    }).select("_id");

    const categoryIds = categories.map((c) => c._id);

    // Category membership only — a name/description keyword fallback
    // used to also match here, but that pulled in anything merely
    // mentioning "beef"/"chicken" (Loaded Fries with beef mince,
    // Healthier Options chicken wraps/salads), not just burgers.
    const products = await ProductModel.find({
      deletedAt: null,
      category: { $in: categoryIds },
    })
      .populate("media")
      .populate("category", "name slug");

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}

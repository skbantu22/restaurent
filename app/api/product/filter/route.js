import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseconnection";
import ProductModel from "@/models/Product.model";
import CategoryModel from "@/models/category.model";

const CATEGORY_MAP = {
  beef: ["smash-burgers", "stack-burger"],
  chicken: ["chicken-smashed"],
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

    // Find products by category ids
    const products = await ProductModel.find({
      category: { $in: categoryIds },
      deletedAt: null,
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

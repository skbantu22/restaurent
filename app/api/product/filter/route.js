import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseconnection";
import ProductModel from "@/models/Product.model";
import CategoryModel from "@/models/category.model";
import MediaModel from "@/models/Media.model";
const CATEGORY_MAP = {
  beef: ["smash-burgers", "stack-burger"],
  chicken: ["chicken-burgers"],
  plant: ["plant-based"],
};

// Fallback keyword match: a product whose name/description mentions
// "beef"/"chicken"/"plant" is included even if it isn't assigned to
// one of the hardcoded category slugs above. This is what actually
// decides membership for most products, since category slugs are
// easy to get out of sync with the real menu — matching on the word
// itself is more forgiving and matches how staff naturally describe
// items ("Beef Mushroom Burger", "...chicken breast...", etc).
const KEYWORD_MAP = {
  beef: /beef/i,
  chicken: /chicken/i,
  plant: /plant/i,
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
    const keyword = KEYWORD_MAP[type];

    // A product qualifies if it's assigned to one of the mapped
    // categories OR its name/description mentions the keyword.
    const products = await ProductModel.find({
      deletedAt: null,
      $or: [
        { category: { $in: categoryIds } },
        { name: { $regex: keyword } },
        { description: { $regex: keyword } },
      ],
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

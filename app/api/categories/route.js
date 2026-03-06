import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category"; 
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
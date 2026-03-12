import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No token found" },
        { status: 401 }
      );
    }

    // Verify token - this will throw if expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      valid: true,
      userId: decoded.userId,
      message: "Token is valid"
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Token expired", valid: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Invalid token", valid: false },
      { status: 401 }
    );
  }
}

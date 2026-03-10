import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Get email from query params or cookies
        // For now, using query param - in production use proper session management
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({ email: email }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Convert to plain object to ensure proper serialization
        const userData = user.toObject ? user.toObject() : user;

        return NextResponse.json(userData);

    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

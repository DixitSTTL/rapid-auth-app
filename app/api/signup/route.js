import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");
        const imageFile = formData.get("profileImage");

        console.log("Received signup request:", { email, name });
        await connectDB();

        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashed,
            name,
            profileImage: imageFile
        });

        return NextResponse.json({ message: "User created" });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}
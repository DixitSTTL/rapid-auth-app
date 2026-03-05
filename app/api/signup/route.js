import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {

    try {
        const { email, password } = await req.json();

        console.log("Received signup request:", { email, password });
        await connectDB();

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashed
        });
        console.log("Collection:", newUser.collection.name);
        console.log("Connected DB:", mongoose.connection.name);
        return NextResponse.json({ message: "User created" });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}
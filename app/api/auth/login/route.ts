import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    const isPasswordValid = await bcrypt.compare(password, user?.password_hash);

    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // 3. Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    // 4. Set token in HttpOnly cookie using NextResponse cookies API
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set({
      name: "accessToken",
      value: token,
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24, // 15 minutes
      path: "/",
      sameSite: "strict",
    });

    return response; // Grab token from rsponse to sign in
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

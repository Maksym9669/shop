import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();

    const { email, password, fullName } = body;

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

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      role: "customer", // TODO: create enum later
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

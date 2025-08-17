import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
      fullName: string;
    };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, full_name, age, phone_number, created_at")
    .eq("id", decoded.userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
      fullName: string;
    };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { email, full_name, age, phone_number } = body;

  // Validate required fields
  if (!email || !full_name) {
    return NextResponse.json(
      { error: "Email and full name are required" },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  // Validate age if provided
  if (age !== null && age !== undefined && (age < 13 || age > 120)) {
    return NextResponse.json(
      { error: "Age must be between 13 and 120" },
      { status: 400 }
    );
  }

  // Validate phone number format if provided
  if (phone_number && !/^\+?[\d\s\-\(\)]{10,15}$/.test(phone_number)) {
    return NextResponse.json(
      { error: "Invalid phone number format" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Check if email is already taken by another user
  if (email !== decoded.email) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", decoded.userId)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already taken" },
        { status: 400 }
      );
    }
  }

  const updateData: any = {
    email,
    full_name,
    updated_at: new Date(),
  };

  if (age !== undefined) updateData.age = age;
  if (phone_number !== undefined) updateData.phone_number = phone_number;

  const { data: updatedUser, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", decoded.userId)
    .select("id, email, full_name, age, phone_number, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedUser);
}

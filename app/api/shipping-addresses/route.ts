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
  const { data: addresses, error } = await supabase
    .from("shipping_addresses")
    .select("*")
    .eq("user_id", decoded.userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(addresses || []);
}

export async function POST(req: NextRequest) {
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
  const {
    first_name,
    last_name,
    company,
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    country,
    phone_number,
    is_default,
  } = body;

  // Validate required fields
  if (
    !first_name ||
    !last_name ||
    !address_line_1 ||
    !city ||
    !postal_code ||
    !country
  ) {
    return NextResponse.json(
      {
        error:
          "First name, last name, address line 1, city, postal code, and country are required",
      },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // If this address is set as default, remove default from other addresses
  if (is_default) {
    await supabase
      .from("shipping_addresses")
      .update({ is_default: false })
      .eq("user_id", decoded.userId);
  }

  const newAddress = {
    user_id: decoded.userId,
    first_name,
    last_name,
    company: company || null,
    address_line_1,
    address_line_2: address_line_2 || null,
    city,
    state: state || null,
    postal_code,
    country,
    phone_number: phone_number || null,
    is_default: is_default || false,
  };

  const { data: address, error } = await supabase
    .from("shipping_addresses")
    .insert([newAddress])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(address, { status: 201 });
}

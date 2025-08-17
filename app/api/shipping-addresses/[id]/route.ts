import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import jwt from "jsonwebtoken";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  // Check if address belongs to user
  const { data: existingAddress, error: fetchError } = await supabase
    .from("shipping_addresses")
    .select("*")
    .eq("id", id)
    .eq("user_id", decoded.userId)
    .single();

  if (fetchError || !existingAddress) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
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

  // If this address is set as default, remove default from other addresses
  if (is_default && !existingAddress.is_default) {
    await supabase
      .from("shipping_addresses")
      .update({ is_default: false })
      .eq("user_id", decoded.userId)
      .neq("id", id);
  }

  const updateData = {
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
    updated_at: new Date(),
  };

  const { data: updatedAddress, error } = await supabase
    .from("shipping_addresses")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", decoded.userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedAddress);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const { error } = await supabase
    .from("shipping_addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", decoded.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Address deleted successfully" });
}

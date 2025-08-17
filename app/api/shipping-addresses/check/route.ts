import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
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

  // Get all addresses for the user to check if they have complete data
  const { data: addresses, error } = await supabase
    .from("shipping_addresses")
    .select("*")
    .eq("user_id", decoded.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Check if user has at least one complete address
  const hasCompleteAddress =
    addresses &&
    addresses.some(
      (address) =>
        address.first_name &&
        address.last_name &&
        address.address_line_1 &&
        address.city &&
        address.postal_code &&
        address.country
    );

  return NextResponse.json({
    hasAddresses: (addresses?.length || 0) > 0,
    hasCompleteAddress: hasCompleteAddress || false,
    addressCount: addresses?.length || 0,
  });
}

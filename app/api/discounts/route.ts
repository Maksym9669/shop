import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "../../../lib/supabase/server";

// GET - List all discounts (admin only) or active discounts for products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productIds = searchParams.get("product_ids"); // Comma-separated product IDs
  const adminView = searchParams.get("admin") === "true";

  const supabase = await createClient();

  try {
    if (adminView) {
      // Admin view - require authentication
      const token = req.cookies.get("accessToken")?.value;
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          userId: string;
          role: string;
        };
      } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (decoded.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Fetch all discounts for admin
      const { data: discounts, error } = await supabase
        .from("discounts")
        .select(
          `
          *,
          product_discounts (
            product_id,
            products (id, name)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(discounts);
    } else {
      // Public view - only active discounts for specific products
      if (!productIds) {
        return NextResponse.json({ discounts: [] });
      }

      const productIdArray = productIds.split(",").map((id) => parseInt(id));
      const now = new Date().toISOString();

      const { data: discounts, error } = await supabase
        .from("discounts")
        .select(
          `
          *,
          product_discounts!inner (
            product_id
          )
        `
        )
        .eq("is_active", true)
        .lte("start_date", now)
        .gte("end_date", now)
        .in("product_discounts.product_id", productIdArray)
        .order("value", { ascending: false }); // Highest discount first

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ discounts });
    }
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}

// POST - Create new discount (admin only)
export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (decoded.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      description,
      type,
      value,
      start_date,
      end_date,
      min_amount,
      max_amount,
      usage_limit,
      product_ids = [],
    } = body;

    // Validation
    if (!name || !type || !value || !start_date || !end_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["percentage", "fixed"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid discount type" },
        { status: 400 }
      );
    }

    if (value <= 0) {
      return NextResponse.json(
        { error: "Discount value must be positive" },
        { status: 400 }
      );
    }

    if (type === "percentage" && value > 100) {
      return NextResponse.json(
        { error: "Percentage discount cannot exceed 100%" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create discount
    const { data: discount, error: discountError } = await supabase
      .from("discounts")
      .insert({
        name,
        description,
        type,
        value,
        start_date,
        end_date,
        min_amount,
        max_amount,
        usage_limit,
        created_by: decoded.userId,
      })
      .select()
      .single();

    if (discountError) {
      return NextResponse.json(
        { error: discountError.message },
        { status: 500 }
      );
    }

    // Link products to discount
    if (product_ids.length > 0) {
      const productDiscounts = product_ids.map((productId: number) => ({
        discount_id: discount.id,
        product_id: productId,
      }));

      const { error: linkError } = await supabase
        .from("product_discounts")
        .insert(productDiscounts);

      if (linkError) {
        return NextResponse.json({ error: linkError.message }, { status: 500 });
      }
    }

    return NextResponse.json(discount, { status: 201 });
  } catch (error) {
    console.error("Error creating discount:", error);
    return NextResponse.json(
      { error: "Failed to create discount" },
      { status: 500 }
    );
  }
}


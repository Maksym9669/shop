import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "../../../../lib/supabase/server";

// GET - Get specific discount (admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const { id } = params;
  const supabase = await createClient();

  try {
    const { data: discount, error } = await supabase
      .from("discounts")
      .select(
        `
        *,
        product_discounts (
          product_id,
          products (id, name, price)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Discount not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(discount);
  } catch (error) {
    console.error("Error fetching discount:", error);
    return NextResponse.json(
      { error: "Failed to fetch discount" },
      { status: 500 }
    );
  }
}

// PATCH - Update discount (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const { id } = params;

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
      is_active,
      product_ids,
    } = body;

    // Validation
    if (type && !["percentage", "fixed"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid discount type" },
        { status: 400 }
      );
    }

    if (value !== undefined && value <= 0) {
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

    // Update discount
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = value;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    if (min_amount !== undefined) updateData.min_amount = min_amount;
    if (max_amount !== undefined) updateData.max_amount = max_amount;
    if (usage_limit !== undefined) updateData.usage_limit = usage_limit;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: discount, error: updateError } = await supabase
      .from("discounts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update product associations if provided
    if (product_ids !== undefined) {
      // Delete existing associations
      const { error: deleteError } = await supabase
        .from("product_discounts")
        .delete()
        .eq("discount_id", id);

      if (deleteError) {
        return NextResponse.json(
          { error: deleteError.message },
          { status: 500 }
        );
      }

      // Insert new associations
      if (product_ids.length > 0) {
        const productDiscounts = product_ids.map((productId: number) => ({
          discount_id: parseInt(id),
          product_id: productId,
        }));

        const { error: insertError } = await supabase
          .from("product_discounts")
          .insert(productDiscounts);

        if (insertError) {
          return NextResponse.json(
            { error: insertError.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json(discount);
  } catch (error) {
    console.error("Error updating discount:", error);
    return NextResponse.json(
      { error: "Failed to update discount" },
      { status: 500 }
    );
  }
}

// DELETE - Delete discount (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const { id } = params;
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("discounts").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Discount deleted successfully" });
  } catch (error) {
    console.error("Error deleting discount:", error);
    return NextResponse.json(
      { error: "Failed to delete discount" },
      { status: 500 }
    );
  }
}


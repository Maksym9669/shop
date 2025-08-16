import { NextResponse, NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify token
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

  // Admin can see all orders, customers can only see their own
  if (decoded.role === "admin") {
    const { data, error } = await supabase.from("orders").select("*");
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } else {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", decoded.userId);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify token
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

  // Only customers can create orders
  if (decoded.role !== "customer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { items, total_amount: totalAmount } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Order must contain at least one item" },
      { status: 400 }
    );
  }

  if (!totalAmount || totalAmount <= 0) {
    return NextResponse.json(
      { error: "Invalid total amount" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  try {
    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: decoded.userId,
          total_amount: totalAmount,
          status: "pending", // Default status
        },
      ])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Update product quantities (reduce stock)
    for (const item of items) {
      // First get current quantity
      const { data: product, error: getError } = await supabase
        .from("products")
        .select("quantity")
        .eq("id", item.product_id)
        .single();

      if (getError) {
        return NextResponse.json({ error: getError.message }, { status: 500 });
      }

      // Update with new quantity
      const { error: updateError } = await supabase
        .from("products")
        .update({
          quantity: product.quantity - item.quantity,
        })
        .eq("id", item.product_id);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { liqpay } from "../../../lib/liqpay";
import { createClient } from "../../../lib/supabase/server";
import jwt from "jsonwebtoken";

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

  // Only customers can make payments
  if (decoded.role !== "customer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { order_id, amount, description } = body;

  if (!order_id || !amount || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Generate LiqPay payment URL
    const paymentUrl = liqpay.generate_payment_url({
      version: "3",
      public_key: process.env.LIQPAY_PUBLIC_KEY || "sandbox_i1234567890",
      action: "pay",
      amount: amount,
      currency: "UAH",
      description: description,
      order_id: order_id,
      result_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?order_id=${order_id}`,
      server_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
      sandbox: process.env.NODE_ENV !== "production" ? 1 : 0,
    });

    return NextResponse.json({
      payment_url: paymentUrl,
      order_id: order_id,
    });
  } catch (error) {
    console.error("Error generating payment URL:", error);
    return NextResponse.json(
      { error: "Failed to generate payment URL" },
      { status: 500 }
    );
  }
}

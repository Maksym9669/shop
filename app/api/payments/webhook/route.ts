import { NextRequest, NextResponse } from "next/server";
import { liqpay } from "../../../../lib/liqpay";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(req: NextRequest) {
  console.log("=== WEBHOOK CALLED ===");
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  try {
    const formData = await req.formData();
    const data = formData.get("data") as string;
    const signature = formData.get("signature") as string;

    if (!data || !signature) {
      return NextResponse.json(
        { error: "Missing data or signature" },
        { status: 400 }
      );
    }

    // Verify signature
    if (!liqpay.verify_signature(data, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Decode payment data
    const paymentData = liqpay.decode_data(data);
    console.log("LiqPay webhook data:", paymentData);
    console.log("Raw form data:", Object.fromEntries(formData.entries()));

    const {
      order_id,
      status,
      liqpay_order_id,
      transaction_id,
      amount,
      currency,
      sender_phone,
      sender_card_mask2,
    } = paymentData;

    const supabase = await createClient();

    // Update order status based on payment result
    let orderStatus = "pending";
    switch (status) {
      case "success":
      case "sandbox":
        orderStatus = "paid";
        break;
      case "failure":
        orderStatus = "payment_failed";
        break;
      case "error":
        orderStatus = "payment_error";
        break;
      case "reversed":
        orderStatus = "refunded";
        break;
      default:
        orderStatus = "pending";
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        // payment_id: transaction_id,
        // payment_status: status,
        updated_at: new Date(),
      })
      .eq("id", order_id);

    if (updateError) {
      console.error("Error updating order:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // Log payment details
    console.log(`Order ${order_id} status updated to: ${orderStatus}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

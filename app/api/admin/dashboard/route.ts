import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
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

  if (decoded?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();

  try {
    // Get current date for filtering
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Products statistics - total count from products table
    const { count: totalProductsCount, error: productsCountError } =
      await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

    if (productsCountError) throw productsCountError;

    // Low stock products (≤ 10 items)
    const { data: lowStockData, error: lowStockError } = await supabase
      .from("products")
      .select("id")
      .lte("quantity", 10);

    if (lowStockError) throw lowStockError;

    const totalProducts = totalProductsCount || 0;
    const lowStockProducts = lowStockData?.length || 0;

    // 2. Orders statistics - orders from last week
    const { data: ordersStats, error: ordersError } = await supabase
      .from("orders")
      .select("id, status, created_at, total_amount")
      .gte("created_at", lastWeek.toISOString());

    if (ordersError) throw ordersError;

    const weeklyOrdersCount = ordersStats?.length || 0;
    const newOrders =
      ordersStats?.filter((order) => order.status === "pending").length || 0;
    const processingOrders =
      ordersStats?.filter((order) => order.status === "processing").length || 0;
    const weeklyRevenue =
      ordersStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) ||
      0;

    // 3. Discounts statistics
    // Active discounts - count from discounts table
    const { count: activeDiscountsCount, error: activeDiscountsError } =
      await supabase
        .from("discounts")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
        .lte("start_date", now.toISOString())
        .gte("end_date", now.toISOString());

    console.log("11111111111111111");
    console.log("Count: ", activeDiscountsCount);
    console.log("111111111111111");

    if (activeDiscountsError) throw activeDiscountsError;

    // Average discount - only percentage type discounts
    const { data: percentageDiscounts, error: percentageDiscountsError } =
      await supabase
        .from("discounts")
        .select("value")
        .eq("type", "percentage")
        .eq("is_active", true)
        .lte("start_date", now.toISOString())
        .gte("end_date", now.toISOString());

    if (percentageDiscountsError) throw percentageDiscountsError;

    let averageDiscount = 0;
    if (percentageDiscounts && percentageDiscounts.length > 0) {
      const totalDiscountValue = percentageDiscounts.reduce(
        (sum, discount) => sum + discount.value,
        0
      );
      averageDiscount = Math.round(
        totalDiscountValue / percentageDiscounts.length
      );
    }

    // 4. Users/Customers statistics
    const { count: totalCustomersCount, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer");

    if (usersError) throw usersError;

    const totalCustomers = totalCustomersCount || 0;

    return NextResponse.json({
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
      orders: {
        total: weeklyOrdersCount,
        new: newOrders,
        processing: processingOrders,
        weeklyRevenue: weeklyRevenue,
      },
      discounts: {
        active: activeDiscountsCount || 0,
        averagePercentage: averageDiscount,
      },
      customers: {
        total: totalCustomers,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

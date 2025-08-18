import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { applyDiscountsToProducts } from "../../../lib/discount-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Get query parameters for pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  try {
    // Get current timestamp for active discount filtering
    const now = new Date().toISOString();

    // Query products that have active discounts
    let query = supabase.from("products").select(`
      *,
      product_discounts!left (
        discount_id,
        discounts!inner (
          id,
          name,
          type,
          value,
          start_date,
          end_date,
          is_active,
          min_amount,
          max_amount,
          usage_limit,
          usage_count
        )
      )
    `);

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter products that actually have active discounts
    const productsWithActiveDiscounts =
      data?.filter((product) => {
        if (
          !product.product_discounts ||
          product.product_discounts.length === 0
        ) {
          return false;
        }

        // Check if any of the product's discounts are currently active
        return product.product_discounts.some((pd: any) => {
          const discount = pd.discounts;
          if (!discount) return false;

          return (
            discount.is_active &&
            new Date(discount.start_date) <= new Date() &&
            new Date(discount.end_date) >= new Date()
          );
        });
      }) || [];

    // Process products to extract and apply active discounts
    const processedProducts = productsWithActiveDiscounts.map((product) => {
      const activeDiscounts =
        product.product_discounts
          ?.map((pd: any) => pd.discounts)
          .filter(
            (discount: any) =>
              discount?.is_active &&
              new Date(discount.start_date) <= new Date() &&
              new Date(discount.end_date) >= new Date()
          ) || [];

      return {
        ...product,
        discounts: activeDiscounts,
      };
    });

    // Apply discount calculations
    const productsWithDiscounts = applyDiscountsToProducts(processedProducts);

    // Filter out products where discount calculation failed or no discount was applied
    const finalProducts = productsWithDiscounts.filter(
      (product) => product.discount_amount && product.discount_amount > 0
    );

    // Get total count for pagination (only products with active discounts)
    const totalCount = finalProducts.length;

    return NextResponse.json({
      data: finalProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products with discounts" },
      { status: 500 }
    );
  }
}

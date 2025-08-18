import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../../lib/s3";
import jwt from "jsonwebtoken";
import { applyDiscountsToProducts } from "../../../lib/discount-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Get query parameters
  const categoryId = searchParams.get("category_id");
  const sortBy = searchParams.get("sort_by"); // 'price_asc', 'price_desc', 'created_at_asc', 'created_at_desc'
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  // Get current timestamp for active discount filtering
  const now = new Date().toISOString();

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

  // Apply category filter
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "created_at_asc":
        query = query.order("created_at", { ascending: true });
        break;
      case "created_at_desc":
        query = query.order("created_at", { ascending: false });
        break;
      default:
        // Default sorting by created_at desc (newest first)
        query = query.order("created_at", { ascending: false });
    }
  } else {
    // Default sorting by created_at desc (newest first)
    query = query.order("created_at", { ascending: false });
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Get total count for pagination
  let countQuery = supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // Apply the same category filter for count query
  if (categoryId) {
    countQuery = countQuery.eq("category_id", categoryId);
  }

  const { count: totalCount } = await countQuery;

  // Process products to extract and apply active discounts
  const processedProducts =
    data?.map((product) => {
      const activeDiscounts =
        product.product_discounts
          ?.map((pd) => pd.discounts)
          .filter(
            (discount) =>
              discount?.is_active &&
              new Date(discount.start_date) <= new Date() &&
              new Date(discount.end_date) >= new Date()
          ) || [];

      return {
        ...product,
        discounts: activeDiscounts,
      };
    }) || [];

  // Apply discount calculations
  const productsWithDiscounts = applyDiscountsToProducts(processedProducts);

  return NextResponse.json({
    data: productsWithDiscounts,
    pagination: {
      page,
      limit,
      total: totalCount || 0,
      totalPages: Math.ceil((totalCount || 0) / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  console.log("s3: ", s3);
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
    // TODO: Change to enum
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const categoryId = formData.get("category_id");
  const quantity = formData.get("quantity");

  const image = formData.get("image") as File;

  let imageUrl;
  if (image) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const key = `products/${Date.now()}-${image.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: image.type,
      })
    );

    imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  if (!name || !price || !categoryId || !quantity || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const insertFields = {} as any;
  if (name) insertFields.name = name;
  if (price) insertFields.price = price;
  if (categoryId) insertFields.category_id = categoryId;
  if (quantity) insertFields.quantity = quantity;
  if (description) insertFields.description = description;
  if (imageUrl) insertFields.image_url = imageUrl;

  const { data, error } = await supabase
    .from("products")
    .insert([insertFields])
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

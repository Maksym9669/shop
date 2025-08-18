import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../../../lib/s3";
import jwt from "jsonwebtoken";
import { applyDiscountsToProducts } from "../../../../lib/discount-utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const { id } = await params;

  const formData = await req.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const categoryId = formData.get("category_id");
  const quantity = formData.get("quantity");
  const image = formData.get("image") as File;

  // const body = await req.json();
  // const {
  //   name,
  //   description,
  //   price,
  //   categoryId,
  //   image_url: imageUrl,
  //   quantity,
  // } = body;

  if (!name && !description && !price && !categoryId && !image && !quantity) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const updates: any = {};

  if (name) updates.name = name;
  if (description) updates.description = description;
  if (price) updates.price = price;
  if (categoryId) updates.category_id = categoryId;
  if (quantity) updates.quantity = quantity;

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

    updates.image_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    if (product.image_url) {
      const oldKey = product.image_url.split("/").pop();

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: `products/${oldKey}`,
        })
      );
    }
  }

  updates.updated_at = new Date();

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const { id } = await params;

  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    if (product.image_url) {
      const oldKey = product.image_url.split("/").pop();

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: `products/${oldKey}`,
        })
      );
    }

    await supabase.from("products").delete().eq("id", id);
  } catch (err) {
    console.log("Error: ", err);
    throw new Error("Error deleting product");
  }

  return NextResponse.json({ message: "Deleted successfully" });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
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
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Process product to extract and apply active discounts
  const activeDiscounts =
    product.product_discounts
      ?.map((pd) => pd.discounts)
      .filter(
        (discount) =>
          discount?.is_active &&
          new Date(discount.start_date) <= new Date() &&
          new Date(discount.end_date) >= new Date()
      ) || [];

  const productWithDiscounts = {
    ...product,
    discounts: activeDiscounts,
  };

  // Apply discount calculations
  const [processedProduct] = applyDiscountsToProducts([productWithDiscounts]);

  return NextResponse.json(processedProduct);
}

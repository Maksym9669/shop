// Discount utility functions

export interface Discount {
  id: number;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  min_amount?: number;
  max_amount?: number;
  usage_limit?: number;
  usage_count: number;
}

export interface ProductWithDiscount {
  id: number;
  name: string;
  price: number;
  discount?: Discount;
  discounted_price?: number;
  discount_amount?: number;
  discount_percentage?: number;
}

/**
 * Calculate the discounted price for a product
 * @param originalPrice Original price in kopecks
 * @param discount Discount object
 * @returns Object with discounted price and discount amount
 */
export function calculateDiscount(originalPrice: number, discount: Discount) {
  if (!discount || !isDiscountActive(discount)) {
    return {
      discounted_price: originalPrice,
      discount_amount: 0,
      discount_percentage: 0,
    };
  }

  let discountAmount = 0;

  if (discount.type === "percentage") {
    discountAmount = Math.round((originalPrice * discount.value) / 100);

    // Apply max discount cap if set
    if (discount.max_amount && discountAmount > discount.max_amount) {
      discountAmount = discount.max_amount;
    }
  } else if (discount.type === "fixed") {
    discountAmount = discount.value;

    // Discount cannot exceed the product price
    if (discountAmount > originalPrice) {
      discountAmount = originalPrice;
    }
  }

  const discountedPrice = originalPrice - discountAmount;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  return {
    discounted_price: Math.max(0, discountedPrice),
    discount_amount: discountAmount,
    discount_percentage: discountPercentage,
  };
}

/**
 * Check if a discount is currently active
 * @param discount Discount object
 * @returns Boolean indicating if discount is active
 */
export function isDiscountActive(discount: Discount): boolean {
  if (!discount.is_active) return false;

  const now = new Date();
  const startDate = new Date(discount.start_date);
  const endDate = new Date(discount.end_date);

  return now >= startDate && now <= endDate;
}

/**
 * Check if order meets minimum amount requirement for discount
 * @param orderAmount Order amount in kopecks
 * @param discount Discount object
 * @returns Boolean indicating if minimum amount is met
 */
export function meetsMinimumAmount(
  orderAmount: number,
  discount: Discount
): boolean {
  if (!discount.min_amount) return true;
  return orderAmount >= discount.min_amount;
}

/**
 * Get the best discount for a product from multiple available discounts
 * @param originalPrice Product price in kopecks
 * @param discounts Array of available discounts
 * @returns Best discount with calculated values
 */
export function getBestDiscount(originalPrice: number, discounts: Discount[]) {
  if (!discounts || discounts.length === 0) {
    return null;
  }

  let bestDiscount = null;
  let bestDiscountAmount = 0;

  for (const discount of discounts) {
    if (!isDiscountActive(discount)) continue;

    const calculation = calculateDiscount(originalPrice, discount);

    if (calculation.discount_amount > bestDiscountAmount) {
      bestDiscountAmount = calculation.discount_amount;
      bestDiscount = {
        ...discount,
        ...calculation,
      };
    }
  }

  return bestDiscount;
}

/**
 * Apply discounts to an array of products
 * @param products Array of products with their discounts
 * @returns Array of products with discount calculations applied
 */
export function applyDiscountsToProducts(
  products: any[]
): ProductWithDiscount[] {
  return products.map((product) => {
    if (!product.discounts || product.discounts.length === 0) {
      return {
        ...product,
        discounted_price: product.price,
        discount_amount: 0,
        discount_percentage: 0,
      };
    }

    const bestDiscount = getBestDiscount(product.price, product.discounts);

    if (bestDiscount) {
      return {
        ...product,
        discount: bestDiscount,
        discounted_price: bestDiscount.discounted_price,
        discount_amount: bestDiscount.discount_amount,
        discount_percentage: bestDiscount.discount_percentage,
      };
    }

    return {
      ...product,
      discounted_price: product.price,
      discount_amount: 0,
      discount_percentage: 0,
    };
  });
}

/**
 * Format price for display
 * @param priceInKopecks Price in kopecks
 * @returns Formatted price string
 */
export function formatPrice(priceInKopecks: number): string {
  return (priceInKopecks / 100).toFixed(2);
}

/**
 * Calculate cart total with discounts
 * @param cartItems Array of cart items with quantities
 * @returns Object with original total, discount total, and final total
 */
export function calculateCartTotal(cartItems: any[]) {
  let originalTotal = 0;
  let discountTotal = 0;

  for (const item of cartItems) {
    const itemOriginalTotal = item.price * item.quantity;
    const itemDiscountTotal =
      (item.discounted_price || item.price) * item.quantity;

    originalTotal += itemOriginalTotal;
    discountTotal += itemDiscountTotal;
  }

  return {
    original_total: originalTotal,
    discount_amount: originalTotal - discountTotal,
    final_total: discountTotal,
    savings_percentage:
      originalTotal > 0
        ? Math.round(((originalTotal - discountTotal) / originalTotal) * 100)
        : 0,
  };
}


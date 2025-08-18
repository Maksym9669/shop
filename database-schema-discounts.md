# Discount System Database Schema

## Create Discounts Table

```sql
-- Create discounts table
CREATE TABLE discounts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('percentage', 'fixed')), -- percentage or fixed amount
  value DECIMAL(10, 2) NOT NULL, -- discount value (percentage or amount in kopecks)
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  min_amount INTEGER, -- minimum order amount in kopecks (optional)
  max_amount INTEGER, -- maximum discount amount in kopecks (optional, for percentage discounts)
  usage_limit INTEGER, -- total usage limit (optional)
  usage_count INTEGER DEFAULT 0, -- current usage count
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id)
);

-- Create product_discounts table (many-to-many relationship)
CREATE TABLE product_discounts (
  id BIGSERIAL PRIMARY KEY,
  discount_id BIGINT NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(discount_id, product_id)
);

-- Create indexes for performance
CREATE INDEX idx_discounts_active_dates ON discounts(is_active, start_date, end_date);
CREATE INDEX idx_discounts_created_by ON discounts(created_by);
CREATE INDEX idx_product_discounts_discount_id ON product_discounts(discount_id);
CREATE INDEX idx_product_discounts_product_id ON product_discounts(product_id);

-- Create updated_at trigger for discounts
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON discounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Example Data

```sql
-- Example discount: 20% off on selected products
INSERT INTO discounts (name, description, type, value, start_date, end_date, min_amount, max_amount)
VALUES (
  'New Year Sale',
  'Знижка 20% на обрані товари до Нового року',
  'percentage',
  20.00,
  '2024-12-20 00:00:00+00',
  '2025-01-10 23:59:59+00',
  50000, -- minimum 500 грн
  10000  -- max discount 100 грн
);

-- Example discount: Fixed 50 грн off
INSERT INTO discounts (name, description, type, value, start_date, end_date, min_amount)
VALUES (
  'First Order Discount',
  'Знижка 50 грн на перше замовлення',
  'fixed',
  5000, -- 50 грн in kopecks
  '2024-12-01 00:00:00+00',
  '2025-03-31 23:59:59+00',
  30000  -- minimum 300 грн
);
```

## Discount Types Explanation

1. **percentage**: Discount as percentage (e.g., 20 = 20% off)
2. **fixed**: Fixed amount discount in kopecks (e.g., 5000 = 50 грн off)

## Business Rules

1. Discounts can be applied to specific products via `product_discounts` table
2. `start_date` and `end_date` define the validity period
3. `is_active` allows manual enable/disable
4. `min_amount` sets minimum order value requirement
5. `max_amount` caps the maximum discount (useful for percentage discounts)
6. `usage_limit` and `usage_count` control total usage
7. Only admin users can create/manage discounts

/*
  # Seed Initial Data for NovaMart

  1. Categories
    - Create main categories and subcategories
  
  2. Sample Products
    - Add diverse product catalog with images and variants
  
  3. Admin User
    - Create initial admin profile
*/

-- Insert main categories
INSERT INTO categories (name, slug, parent_id) VALUES
  ('Electronics', 'electronics', NULL),
  ('Home & Garden', 'home-garden', NULL),
  ('Fashion', 'fashion', NULL),
  ('Sports & Outdoors', 'sports-outdoors', NULL),
  ('Health & Beauty', 'health-beauty', NULL),
  ('Toys & Games', 'toys-games', NULL),
  ('Books & Media', 'books-media', NULL),
  ('Automotive', 'automotive', NULL),
  ('Office Supplies', 'office-supplies', NULL),
  ('Pet Supplies', 'pet-supplies', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for subcategories
DO $$
DECLARE
  electronics_id uuid;
  home_id uuid;
  fashion_id uuid;
  sports_id uuid;
BEGIN
  SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics';
  SELECT id INTO home_id FROM categories WHERE slug = 'home-garden';
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';
  SELECT id INTO sports_id FROM categories WHERE slug = 'sports-outdoors';

  -- Electronics subcategories
  INSERT INTO categories (name, slug, parent_id) VALUES
    ('Smartphones', 'smartphones', electronics_id),
    ('Laptops', 'laptops', electronics_id),
    ('Headphones', 'headphones', electronics_id),
    ('Smart Home', 'smart-home', electronics_id)
  ON CONFLICT (slug) DO NOTHING;

  -- Home subcategories
  INSERT INTO categories (name, slug, parent_id) VALUES
    ('Furniture', 'furniture', home_id),
    ('Kitchen', 'kitchen', home_id),
    ('Decor', 'decor', home_id),
    ('Garden', 'garden', home_id)
  ON CONFLICT (slug) DO NOTHING;

  -- Fashion subcategories
  INSERT INTO categories (name, slug, parent_id) VALUES
    ('Mens Clothing', 'mens-clothing', fashion_id),
    ('Womens Clothing', 'womens-clothing', fashion_id),
    ('Shoes', 'shoes', fashion_id),
    ('Accessories', 'accessories', fashion_id)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- Insert sample products
DO $$
DECLARE
  electronics_id uuid;
  smartphones_id uuid;
  headphones_id uuid;
  home_id uuid;
  fashion_id uuid;
BEGIN
  SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics';
  SELECT id INTO smartphones_id FROM categories WHERE slug = 'smartphones';
  SELECT id INTO headphones_id FROM categories WHERE slug = 'headphones';
  SELECT id INTO home_id FROM categories WHERE slug = 'home-garden';
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';

  -- Electronics products
  INSERT INTO products (title, slug, description, category_id, price_cents, rating, tags, attributes) VALUES
    (
      'Wireless Bluetooth Headphones',
      'wireless-bluetooth-headphones',
      'Premium wireless headphones with noise cancellation and 30-hour battery life.',
      headphones_id,
      12999,
      4.5,
      '["trending", "new"]'::jsonb,
      '{"brand": "AudioTech", "color": "Black", "wireless": true}'::jsonb
    ),
    (
      'Smart Fitness Watch',
      'smart-fitness-watch',
      'Track your health and fitness with this advanced smartwatch featuring GPS and heart rate monitoring.',
      electronics_id,
      24999,
      4.3,
      '["trending", "fast"]'::jsonb,
      '{"brand": "FitTech", "waterproof": true, "battery_days": 7}'::jsonb
    ),
    (
      'Portable Bluetooth Speaker',
      'portable-bluetooth-speaker',
      'Compact speaker with powerful sound and 12-hour battery life. Perfect for outdoor adventures.',
      electronics_id,
      7999,
      4.2,
      '["eco", "fast"]'::jsonb,
      '{"brand": "SoundWave", "waterproof": true, "battery_hours": 12}'::jsonb
    ),
    (
      'Wireless Charging Pad',
      'wireless-charging-pad',
      'Fast wireless charging for all Qi-enabled devices. Sleek design fits any desk setup.',
      electronics_id,
      3999,
      4.1,
      '["new", "fast"]'::jsonb,
      '{"brand": "ChargeTech", "fast_charging": true, "led_indicator": true}'::jsonb
    ),
    (
      'Gaming Mechanical Keyboard',
      'gaming-mechanical-keyboard',
      'RGB backlit mechanical keyboard with customizable keys and tactile switches.',
      electronics_id,
      15999,
      4.6,
      '["trending"]'::jsonb,
      '{"brand": "GameTech", "rgb": true, "switch_type": "Blue"}'::jsonb
    ),

    -- Home products
    (
      'Ceramic Coffee Mug Set',
      'ceramic-coffee-mug-set',
      'Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe.',
      home_id,
      2999,
      4.4,
      '["eco", "new"]'::jsonb,
      '{"material": "Ceramic", "set_size": 4, "dishwasher_safe": true}'::jsonb
    ),
    (
      'Bamboo Cutting Board',
      'bamboo-cutting-board',
      'Sustainable bamboo cutting board with juice groove. Naturally antimicrobial.',
      home_id,
      4999,
      4.7,
      '["eco", "trending"]'::jsonb,
      '{"material": "Bamboo", "size": "Large", "antimicrobial": true}'::jsonb
    ),
    (
      'LED Desk Lamp',
      'led-desk-lamp',
      'Adjustable LED desk lamp with touch controls and USB charging port.',
      home_id,
      6999,
      4.3,
      '["new", "fast"]'::jsonb,
      '{"led": true, "usb_port": true, "adjustable": true}'::jsonb
    ),

    -- Fashion products
    (
      'Classic Cotton T-Shirt',
      'classic-cotton-t-shirt',
      'Comfortable 100% cotton t-shirt in various colors. Perfect for everyday wear.',
      fashion_id,
      1999,
      4.2,
      '["eco"]'::jsonb,
      '{"material": "100% Cotton", "fit": "Regular", "colors": ["White", "Black", "Navy"]}'::jsonb
    ),
    (
      'Denim Jacket',
      'denim-jacket',
      'Classic denim jacket with vintage wash. A timeless addition to any wardrobe.',
      fashion_id,
      7999,
      4.5,
      '["trending"]'::jsonb,
      '{"material": "Denim", "wash": "Vintage", "fit": "Regular"}'::jsonb
    )
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- Insert product images
DO $$
DECLARE
  product_record RECORD;
BEGIN
  FOR product_record IN SELECT id, slug FROM products LOOP
    CASE product_record.slug
      WHEN 'wireless-bluetooth-headphones' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', 0),
          (product_record.id, 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800', 1)
        ON CONFLICT DO NOTHING;
      
      WHEN 'smart-fitness-watch' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800', 0),
          (product_record.id, 'https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=800', 1)
        ON CONFLICT DO NOTHING;
      
      WHEN 'portable-bluetooth-speaker' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
      
      WHEN 'wireless-charging-pad' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
      
      WHEN 'gaming-mechanical-keyboard' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
      
      WHEN 'ceramic-coffee-mug-set' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
      
      WHEN 'bamboo-cutting-board' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
      
      WHEN 'led-desk-lamp' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
      
      WHEN 'classic-cotton-t-shirt' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
      
      WHEN 'denim-jacket' THEN
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
      
      ELSE
        -- Default image for products without specific images
        INSERT INTO product_images (product_id, url, position) VALUES
          (product_record.id, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
        ON CONFLICT DO NOTHING;
    END CASE;
  END LOOP;
END $$;

-- Insert sample variants
DO $$
DECLARE
  product_record RECORD;
BEGIN
  FOR product_record IN SELECT id, slug FROM products LOOP
    CASE product_record.slug
      WHEN 'wireless-bluetooth-headphones' THEN
        INSERT INTO variants (product_id, sku, name, price_delta_cents, stock, attributes) VALUES
          (product_record.id, 'WBH-BLACK', 'Black', 0, 50, '{"color": "Black"}'::jsonb),
          (product_record.id, 'WBH-WHITE', 'White', 0, 30, '{"color": "White"}'::jsonb),
          (product_record.id, 'WBH-BLUE', 'Blue', 500, 25, '{"color": "Blue"}'::jsonb)
        ON CONFLICT (sku) DO NOTHING;
      
      WHEN 'smart-fitness-watch' THEN
        INSERT INTO variants (product_id, sku, name, price_delta_cents, stock, attributes) VALUES
          (product_record.id, 'SFW-42MM', '42mm', 0, 40, '{"size": "42mm"}'::jsonb),
          (product_record.id, 'SFW-46MM', '46mm', 2000, 35, '{"size": "46mm"}'::jsonb)
        ON CONFLICT (sku) DO NOTHING;
      
      WHEN 'classic-cotton-t-shirt' THEN
        INSERT INTO variants (product_id, sku, name, price_delta_cents, stock, attributes) VALUES
          (product_record.id, 'CCT-S-WHITE', 'Small - White', 0, 100, '{"size": "S", "color": "White"}'::jsonb),
          (product_record.id, 'CCT-M-WHITE', 'Medium - White', 0, 120, '{"size": "M", "color": "White"}'::jsonb),
          (product_record.id, 'CCT-L-WHITE', 'Large - White', 0, 80, '{"size": "L", "color": "White"}'::jsonb),
          (product_record.id, 'CCT-S-BLACK', 'Small - Black', 0, 90, '{"size": "S", "color": "Black"}'::jsonb),
          (product_record.id, 'CCT-M-BLACK', 'Medium - Black', 0, 110, '{"size": "M", "color": "Black"}'::jsonb),
          (product_record.id, 'CCT-L-BLACK', 'Large - Black', 0, 75, '{"size": "L", "color": "Black"}'::jsonb)
        ON CONFLICT (sku) DO NOTHING;
      
      ELSE
        -- Default variant for products without specific variants
        INSERT INTO variants (product_id, sku, name, price_delta_cents, stock, attributes) VALUES
          (product_record.id, CONCAT(UPPER(LEFT(product_record.slug, 3)), '-DEFAULT'), 'Standard', 0, 50, '{}'::jsonb)
        ON CONFLICT (sku) DO NOTHING;
    END CASE;
  END LOOP;
END $$;

-- Create sample competitor products
INSERT INTO competitor_products (product_id, source, url, price_cents, currency) 
SELECT 
  p.id,
  'Amazon',
  'https://amazon.com/dp/example',
  p.price_cents + (RANDOM() * 2000 - 1000)::integer,
  'USD'
FROM products p
WHERE p.slug IN ('wireless-bluetooth-headphones', 'smart-fitness-watch', 'portable-bluetooth-speaker')
ON CONFLICT DO NOTHING;

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW mv_trending_products;
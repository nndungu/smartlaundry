-- ============================================================
-- SMARTLAUNDRY DEV SEED DATA
-- ============================================================

-- ===============================
-- ROLES
-- ===============================
INSERT INTO role (id, name) VALUES
  (1, 'ADMIN'),
  (2, 'DRIVER'),
  (3, 'CUSTOMER')
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- USERS
-- ===============================
INSERT INTO app_user (id, username, email, phone, password_hash, role_id, status, verified)
VALUES
  (1, 'admin', 'admin@dev.smartlaundry', '+254700000001',
   '$2y$10$UQYBk/NhI37lPRSZHgWHtej2u0gd0sY.NX2GjJkAgoHsCzWYeSEHG', 1, 'ACTIVE', TRUE),
  (2, 'driver1', 'driver1@dev.smartlaundry', '+254700000002',
   '$2y$10$m7WO3ZHylX2aOONT7hzX0upnX1bnTOC0xWg/ci5eZtSoD8Tg82762', 2, 'ACTIVE', TRUE),
  (3, 'customer1', 'customer1@dev.smartlaundry', '+254700000003',
   '$2y$10$/sMZXuXvzUHe.uQc14Bq4eshoE6U3/wdMXTVeggP0KcKl5IsiMEFG', 3, 'ACTIVE', TRUE),
  (4, 'customer2', 'customer2@dev.smartlaundry', '+254700000004',
   '$2y$10$XQYBk/NhI37lPRSZHgWHtej2u0gd0sY.NX2GjJkAgoHsCzWYeDEV', 3, 'ACTIVE', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- LOCATION: COUNTRY, COUNTY, TOWNSHIP
-- ===============================
INSERT INTO country (id, iso2, name) VALUES
  (1, 'KE', 'Kenya')
ON CONFLICT (id) DO NOTHING;

INSERT INTO county (id, name) VALUES
  (1, 'Nairobi'),
  (2, 'Mombasa'),
  (3, 'Kisumu')
ON CONFLICT (id) DO NOTHING;

INSERT INTO township (id, name, county_id) VALUES
  (1, 'Nairobi CBD', 1),
  (2, 'Westlands', 1),
  (3, 'Nyali', 2),
  (4, 'Mombasa CBD', 2),
  (5, 'Kisumu CBD', 3)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- BRANCHES
-- ===============================
INSERT INTO branch (id, code, name, phone, email, address, township_id, latitude, longitude, location) VALUES
  (1, 'NRB-CBD', 'Nairobi CBD Branch', '+254700111222', 'nrb-cbd@dev.smartlaundry', 'Kimathi St, Nairobi', 1, -1.28333, 36.81667,
   ST_GeogFromText('SRID=4326;POINT(36.81667 -1.28333)')),
  (2, 'MBSA-NYALI', 'Mombasa Nyali Branch', '+254700111333', 'nyali@dev.smartlaundry', 'Nyali Rd, Mombasa', 3, -4.05000, 39.65000,
   ST_GeogFromText('SRID=4326;POINT(39.65000 -4.05000)'))
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- SERVICE TYPES
-- ===============================
INSERT INTO service_type (id, code, name, description) VALUES
  (1, 'WASH_FOLD', 'Wash & Fold', 'Standard wash and fold service'),
  (2, 'DRY_CLEAN', 'Dry Cleaning', 'Professional dry cleaning'),
  (3, 'IRON', 'Iron Only', 'Ironing service only')
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- CATEGORIES
-- ===============================
INSERT INTO category (id, code, name, description) VALUES
  (1, 'SHIRT', 'Shirt', 'Shirt laundry category'),
  (2, 'TROUSER', 'Trouser', 'Trouser laundry category'),
  (3, 'DUVET', 'Duvet', 'Duvet laundry category'),
  (4, 'BED_SHEET', 'Bed Sheet', 'Bed Sheet laundry category')
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- CURRENCY
-- ===============================
INSERT INTO currency (code, name, symbol) VALUES
  ('KES', 'Kenyan Shilling', 'KSh'),
  ('USD', 'US Dollar', '$')
ON CONFLICT (code) DO NOTHING;

-- ===============================
-- PRICE LIST
-- ===============================
INSERT INTO price_list (id, branch_id, service_type_id, category_id, currency, unit_price) VALUES
  (1, 1, 1, 1, 'KES', 150),
  (2, 1, 1, 2, 'KES', 200),
  (3, 1, 1, 3, 'KES', 800),
  (4, 1, 2, 1, 'KES', 250),
  (5, 2, 1, 1, 'KES', 160),
  (6, 2, 1, 2, 'KES', 220)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- CUSTOMER PROFILES
-- ===============================
INSERT INTO customer_profile (id, customer_id, user_id, full_name, street, township_id, city, country_id, loyalty_points) VALUES
  (1, 3, 3, 'John Mwangi', 'Kenyatta Ave 123', 1, 'Nairobi', 1, 50),
  (2, 4, 4, 'Mary Wanjiku', 'Nyali Rd Apt 2', 3, 'Mombasa', 1, 20)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- CARTS & CART ITEMS
-- ===============================
INSERT INTO carts (id, user_id) VALUES
  (1, 3),
  (2, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cart_items (id, cart_id, item_name, quantity, price, category_id) VALUES
  (1, 1, 'Shirt', 3, 150, 1),
  (2, 1, 'Trouser', 2, 200, 2),
  (3, 2, 'Duvet', 1, 800, 3)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- ORDERS & ORDER ITEMS
-- ===============================
INSERT INTO orders (id, order_no, branch_id, customer_id, user_id, service_type_id, pickup_at, delivery_due_at, street, township_id, city, currency, status, delivery_fee, total) VALUES
  (1, 'ORD-DEV-0001', 1, 3, 3, 1, NOW(), NOW() + INTERVAL '3 DAY', 'Kimathi St Apt 3A', 1, 'Nairobi', 'KES', 'RECEIVED', 150, 1150),
  (2, 'ORD-DEV-0002', 2, 4, 4, 2, NOW(), NOW() + INTERVAL '2 DAY', 'Nyali Rd Apt 2', 3, 'Mombasa', 'KES', 'RECEIVED', 200, 1200)
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_item (id, order_id, category_id, quantity, unit_price) VALUES
  (1, 1, 1, 5, 150),
  (2, 1, 2, 3, 200),
  (3, 2, 3, 1, 800)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- PAYMENT PROVIDERS & METHODS
-- ===============================
INSERT INTO payment_provider (id, code, name) VALUES
  (1, 'MPESA', 'Safaricom M-Pesa'),
  (2, 'CARD', 'Visa/MasterCard')
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment_method (id, user_id, provider_id, mpesa_msisdn, label, active) VALUES
  (1, 3, 1, '+254712345678', 'John M-Pesa', TRUE),
  (2, 4, 2, NULL, 'Mary Card', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment (id, order_id, provider_id, payment_method_id, amount, currency, status) VALUES
  (1, 1, 1, 1, 1150, 'KES', 'PENDING'),
  (2, 2, 2, 2, 1200, 'KES', 'PAID')
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- DELIVERY REQUESTS & DRIVER LOCATIONS
-- ===============================
INSERT INTO delivery_request (id, order_id, driver_id, status, created_at) VALUES
  (1, 1, 2, 'PENDING', NOW()),
  (2, 2, 2, 'PENDING', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO driver_location (id, driver_id, location, recorded_at) VALUES
  (1, 2, ST_GeogFromText('SRID=4326;POINT(36.81660 -1.28310)'), NOW()),
  (2, 2, ST_GeogFromText('SRID=4326;POINT(36.81670 -1.28300)'), NOW())
ON CONFLICT (id) DO NOTHING;


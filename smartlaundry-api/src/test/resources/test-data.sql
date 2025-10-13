-- ============================
-- CURRENCIES
-- ============================
INSERT INTO currency (code, name, symbol) VALUES
    ('KES', 'Kenyan Shilling', 'KSh');

-- ============================
-- COUNTRIES, COUNTIES & TOWNSHIPS
-- ============================
INSERT INTO country (iso2, name) VALUES ('KE', 'Kenya');

INSERT INTO county (name) VALUES
                              ('Nairobi'), ('Mombasa'), ('Kiambu');

INSERT INTO township (name, county_id) VALUES
                                           ('Nairobi CBD', 1),
                                           ('Westlands', 1),
                                           ('Parklands', 1),
                                           ('Nyali', 2);

-- ============================
-- ROLES
-- ============================
INSERT INTO role (name) VALUES
                            ('ADMIN'), ('OWNER'), ('STAFF'), ('DRIVER'), ('CUSTOMER');

-- ============================
-- USERS
-- ============================
INSERT INTO app_user (username, email, phone, password_hash, role_id, status, verified) VALUES
                                                                                            ('admin', 'admin@laundromart.ke', '+254700000001',
                                                                                             '$2y$10$UQYBk/NhI37lPRSZHgWHtej2u0gd0sY.NX2GjJkAgoHsCzWYeSEHG', 1, 'ACTIVE', TRUE),
                                                                                            ('owner', 'owner@laundromart.ke', '+254700000010',
                                                                                             '$2y$10$V5itNrn7s.p0AZgjktf.r.pKJ/Di4QGlxLKEbNVLPhDEmmk3LmDjC', 2, 'ACTIVE', TRUE),
                                                                                            ('staff1', 'staff1@laundromart.ke', '+254700000002',
                                                                                             '$2y$10$dsvqOKL2LoY1g6IqiPQw5enpCs9gq6mfFPe0wabR5HnBOJGLZoSea', 3, 'ACTIVE', TRUE),
                                                                                            ('driver1', 'driver1@laundromart.ke', '+254700000003',
                                                                                             '$2y$10$m7WO3ZHylX2aOONT7hzX0upnX1bnTOC0xWg/ci5eZtSoD8Tg82762', 4, 'ACTIVE', TRUE),
                                                                                            ('customer1', 'customer1@laundromart.ke', '+254700000004',
                                                                                             '$2y$10$/sMZXuXvzUHe.uQc14Bq4eshoE6U3/wdMXTVeggP0KcKl5IsiMEFG', 5, 'ACTIVE', FALSE); -- not verified

-- ============================
-- BRANCHES & STAFF
-- ============================
INSERT INTO branch (code, name, owner_user_id, phone, email, address, township_id, latitude, longitude)
VALUES ('NRB-CBD', 'Nairobi CBD Branch', 2, '+254700111222', 'nrb-cbd@laundromart.ke',
        'Kimathi St, Nairobi', 1, -1.28333, 36.81667);

INSERT INTO branch_staff (branch_id, user_id) VALUES
                                                  (1, 3), (1, 4);

-- ============================
-- SERVICES & CATEGORIES
-- ============================
INSERT INTO service_type (code, name) VALUES
                                          ('WASH_FOLD', 'Wash & Fold'),
                                          ('DRY_CLEAN', 'Dry Cleaning'),
                                          ('IRON', 'Iron Only'),
                                          ('EXPRESS', 'Express');

INSERT INTO category (code, name) VALUES
                                      ('SHIRT', 'Shirt'),
                                      ('TROUSER', 'Trouser'),
                                      ('SUIT', 'Suit'),
                                      ('DUVET', 'Duvet');

INSERT INTO price_list (branch_id, service_type_id, category_id, currency, unit_price) VALUES
                                                                                           (1, 1, 1, 'KES', 150),
                                                                                           (1, 1, 2, 'KES', 200),
                                                                                           (1, 1, 3, 'KES', 600),
                                                                                           (1, 1, 4, 'KES', 800);

-- ============================
-- CUSTOMER PROFILES & LOYALTY
-- ============================
INSERT INTO customer_profile (customer_id, full_name, street, township_id, city, country_id, loyalty_points)
VALUES (5, 'John Mwangi', 'Kenyatta Ave 123', 1, 'Nairobi', 1, 50);

INSERT INTO loyalty_tier (code, name, min_points, multiplier, benefits) VALUES
                                                                            ('BRONZE', 'Bronze', 0, 1.000, 'Basic'),
                                                                            ('SILVER', 'Silver', 500, 1.100, '+10% points'),
                                                                            ('GOLD', 'Gold', 1500, 1.200, 'Priority support'),
                                                                            ('PLATINUM', 'Platinum', 3000, 1.300, 'Free delivery offers');

INSERT INTO customer_tier (customer_id, tier_id) VALUES (1, 1);

-- ============================
-- ORDERS & ITEMS
-- ============================
INSERT INTO orders (order_no, branch_id, customer_id, service_type_id, pickup_at, delivery_due_at, street, township_id, city, currency, status, delivery_fee, discount, total)
VALUES ('ORD-2025-0001', 1, 5, 1, NOW(), NOW() + INTERVAL '3 DAY', 'Kimathi St Apt 3A', 1, 'Nairobi', 'KES', 'RECEIVED', 150, 0, 1150);

INSERT INTO order_item (order_id, category_id, quantity, unit_price) VALUES
                                                                         (1, 1, 5, 150),
                                                                         (1, 2, 3, 200);

-- ============================
-- PAYMENT PROVIDERS & METHODS
-- ============================
INSERT INTO payment_provider (code, name) VALUES
                                              ('MPESA', 'Safaricom M-Pesa'),
                                              ('STRIPE', 'Stripe');

INSERT INTO payment_method (customer_id, provider_id, mpesa_msisdn, label, active)
VALUES (5, 1, '+254712345678', 'John M-Pesa', TRUE);

INSERT INTO payment (order_id, provider_id, payment_method_id, amount, currency, status)
VALUES (1, 1, 1, 1150, 'KES', 'PENDING');

-- ============================
-- DELIVERY & DRIVER LOCATIONS
-- ============================
INSERT INTO delivery (order_id, branch_id, driver_id, scheduled_pickup_at, status)
VALUES (1, 1, 4, NOW(), 'PENDING');

INSERT INTO driver_location (driver_id, latitude, longitude) VALUES
                                                                 (4, -1.28310, 36.81650),
                                                                 (4, -1.28300, 36.81660);

-- ============================
-- OTP / Verification Test Users
-- ============================
-- For email verification endpoint testing
INSERT INTO app_user (username, email, phone, password_hash, role_id, status, verified) VALUES
                                                                                            ('testuser1', 'test1@example.com', '+254700000100',
                                                                                             '$2y$10$examplehash1', 5, 'ACTIVE', FALSE),
                                                                                            ('testuser2', 'test2@example.com', '+254700000101',
                                                                                             '$2y$10$examplehash2', 5, 'ACTIVE', FALSE);

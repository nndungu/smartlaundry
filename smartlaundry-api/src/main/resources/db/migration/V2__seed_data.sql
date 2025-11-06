-- ===============================================
-- SMARTLAUNDRY SEED DATA (POSTMAN-READY)
-- ===============================================

-- ============================
-- 1. CURRENCIES
-- ============================
INSERT INTO currency (code, name, symbol) VALUES
    ('KES', 'Kenyan Shilling', 'KSh')
ON CONFLICT (code) DO NOTHING;

-- ============================
-- 2. COUNTRIES, COUNTIES & TOWNSHIPS
-- ============================
INSERT INTO country (iso2, name) VALUES
    ('KE', 'Kenya')
ON CONFLICT (iso2) DO NOTHING;

INSERT INTO county (name, country_id) VALUES
                                          ('Nairobi', 1),
                                          ('Mombasa', 1),
                                          ('Kiambu', 1)
ON CONFLICT (name) DO NOTHING;

INSERT INTO township (name, county_id) VALUES
                                           ('Nairobi CBD', 1),
                                           ('Westlands', 1),
                                           ('Parklands', 1),
                                           ('Nyali', 2)
ON CONFLICT (name, county_id) DO NOTHING;

-- ============================
-- 3. ROLES
-- ============================
INSERT INTO role (name) VALUES
                            ('ADMIN'),
                            ('OWNER'),
                            ('STAFF'),
                            ('DRIVER'),
                            ('CUSTOMER')
ON CONFLICT (name) DO NOTHING;

-- ============================
-- 4. USERS
-- ============================
INSERT INTO app_user (username, email, phone, password_hash, role_id, status, verified) VALUES
                                                                                            ('admin', 'admin@smartlaundry.ke', '+254700000001', '$2y$10$KFMYYN6azgfStB5MoGFBBu0SRH.Qvy8QBuI1q71XGz.hrMl4TBVki', 1, 'ACTIVE', TRUE),
                                                                                            ('owner', 'owner@smartlaundry.ke', '+254700000010', '$2y$10$AZ1faAPK4UFJIvmFDylltujdsUUXL4QVeA4LX7X9h5EO0tD42pvYa', 2, 'ACTIVE', TRUE),
                                                                                            ('staff1', 'staff1@smartlaundry.ke', '+254700000002', '$2y$10$MiJ0.6GNnqTgT1JXrryIau6RiFeqAbiI.0FmP/92rKud50fGmYMOG', 3, 'ACTIVE', TRUE),
                                                                                            ('driver1', 'driver1@smartlaundry.ke', '+254700000003', '$2y$10$8.X9nwKDYApYJI2hx5F53.FRky/9zDrdEveDpCj7wle0vtiLDyZpW', 4, 'ACTIVE', TRUE),
                                                                                            ('customer1', 'customer1@smartlaundry.ke', '+254700000004', '$2y$10$rZkaKCdPgJsOqiaF5PAeBepWT.rUYt9hhd4SuWAIqOltcymCeILmK', 5, 'ACTIVE', TRUE),
                                                                                            ('testuser1', 'test1@example.com', '+254700000100', '$2y$10$ByZkuTqLAKrwyWVjrZJBmOwAiOIeSHgoGxeHVOdnX0GRZ6C1tUCNi', 5, 'ACTIVE', FALSE),
                                                                                            ('testuser2', 'test2@example.com', '+254700000101', '$2y$10$f4rUcBzslPQ7mSIASF6USeYB/v7RMbVCNKonlRZB9cw2RKtgOwee6', 5, 'ACTIVE', FALSE)
ON CONFLICT (email) DO NOTHING;

-- ============================
-- 5. BRANCHES & STAFF
-- ============================
INSERT INTO branch (code, name, owner_user_id, phone, email, address, township_id, latitude, longitude, location) VALUES
    ('NRB-CBD', 'Nairobi CBD Branch', 2, '+254700111222', 'owner@smartlaundry.ke', 'Kimathi St, Nairobi', 1, -1.28333, 36.81667, ST_SetSRID(ST_MakePoint(36.81667, -1.28333), 4326))
ON CONFLICT (code) DO NOTHING;

INSERT INTO branch_staff (branch_id, user_id, role) VALUES
                                                        (1, 3, 'STAFF'),
                                                        (1, 4, 'DRIVER')
ON CONFLICT (branch_id, user_id) DO NOTHING;

-- ============================
-- 6. SERVICES & CATEGORIES
-- ============================
INSERT INTO service_type (code, name) VALUES
                                          ('WASH_FOLD', 'Wash & Fold'),
                                          ('DRY_CLEAN', 'Dry Cleaning'),
                                          ('IRON', 'Iron Only'),
                                          ('EXPRESS', 'Express')
ON CONFLICT (code) DO NOTHING;

INSERT INTO category (code, name) VALUES
                                      ('SHIRT', 'Shirt'),
                                      ('TROUSER', 'Trouser'),
                                      ('SUIT', 'Suit'),
                                      ('DUVET', 'Duvet')
ON CONFLICT (code) DO NOTHING;

INSERT INTO price_list (branch_id, service_type_id, category_id, currency, unit_price) VALUES
                                                                                           (1, 1, 1, 'KES', 150.00),
                                                                                           (1, 1, 2, 'KES', 200.00),
                                                                                           (1, 1, 3, 'KES', 600.00),
                                                                                           (1, 1, 4, 'KES', 800.00)
ON CONFLICT (branch_id, service_type_id, category_id, currency) DO NOTHING;

-- ============================
-- 7. CUSTOMER PROFILE & LOYALTY
-- ============================
INSERT INTO customer_profile (id, customer_id, full_name, street, township_id, city, country_id, loyalty_points) VALUES
                                                                                                                     (5, 5, 'John Mwangi', 'Kenyatta Ave 123', 1, 'Nairobi', 1, 50),
                                                                                                                     (6, 6, 'Test User One', 'Test Street 123', 1, 'Nairobi', 1, 0),
                                                                                                                     (7, 7, 'Test User Two', 'Test Avenue 456', 1, 'Nairobi', 1, 0)
ON CONFLICT (customer_id) DO NOTHING;


INSERT INTO loyalty_tier (code, name, min_points, multiplier, benefits) VALUES
                                                                            ('BRONZE', 'Bronze', 0, 1.000, 'Basic membership'),
                                                                            ('SILVER', 'Silver', 500, 1.100, '+10% loyalty bonus'),
                                                                            ('GOLD', 'Gold', 1500, 1.200, 'Priority support'),
                                                                            ('PLATINUM', 'Platinum', 3000, 1.300, 'Free delivery offers')
ON CONFLICT (code) DO NOTHING;

INSERT INTO customer_tier (customer_id, tier_id) VALUES
                                                     (5, 1),
                                                     (6, 1),
                                                     (7, 1)
ON CONFLICT (customer_id, tier_id) DO NOTHING;

INSERT INTO loyalty_ledger (customer_id, points, type) VALUES
    (5, 50, 'EARNED')
ON CONFLICT DO NOTHING;

-- ============================
-- 8. ORDERS & ITEMS
-- ============================
INSERT INTO orders (order_no, branch_id, customer_id, service_type_id, pickup_at, delivery_due_at, street, township_id, city, currency, status, delivery_fee, discount, subtotal, total) VALUES
    ('ORD-2025-0001', 1, 5, 1, NOW(), NOW() + INTERVAL '3 days', 'Kimathi St Apt 3A', 1, 'Nairobi', 'KES', 'RECEIVED', 150.00, 0.00, 1350.00, 1500.00)
ON CONFLICT (order_no) DO NOTHING;

INSERT INTO order_item (order_id, category_id, quantity, unit_price, total_price) VALUES
                                                                                      (1, 1, 5, 150.00, 750.00),
                                                                                      (1, 2, 3, 200.00, 600.00)
ON CONFLICT DO NOTHING;

-- ============================
-- 9. PAYMENT PROVIDERS & METHODS
-- ============================
INSERT INTO payment_provider (code, name) VALUES
                                              ('MPESA', 'Safaricom M-Pesa'),
                                              ('STRIPE', 'Stripe')
ON CONFLICT (code) DO NOTHING;

INSERT INTO payment_method (customer_id, provider_id, mpesa_msisdn, label, active) VALUES
    (5, 1, '+254712345678', 'John M-Pesa', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO payment (order_id, provider_id, payment_method_id, amount, currency, status) VALUES
    (1, 1, 1, 1500.00, 'KES', 'COMPLETED')
ON CONFLICT DO NOTHING;

-- ============================
-- 10. DELIVERY & DRIVER LOCATIONS
-- ============================
INSERT INTO delivery (order_id, branch_id, driver_id, scheduled_pickup_at, status) VALUES
    (1, 1, 4, NOW(), 'PENDING')
ON CONFLICT (order_id) DO NOTHING;

INSERT INTO driver_location (driver_id, latitude, longitude, location) VALUES
                                                                           (4, -1.28310, 36.81650, ST_SetSRID(ST_MakePoint(36.81650, -1.28310), 4326)),
                                                                           (4, -1.28300, 36.81660, ST_SetSRID(ST_MakePoint(36.81660, -1.28300), 4326))
ON CONFLICT DO NOTHING;

-- ============================
-- 11. UPDATE SEQUENCES
-- ============================
SELECT setval('app_user_id_seq', COALESCE((SELECT MAX(id) FROM app_user), 1));
SELECT setval('branch_id_seq', COALESCE((SELECT MAX(id) FROM branch), 1));
SELECT setval('orders_id_seq', COALESCE((SELECT MAX(id) FROM orders), 1));
SELECT setval('customer_profile_id_seq', COALESCE((SELECT MAX(id) FROM customer_profile), 1));
SELECT setval('loyalty_tier_id_seq', COALESCE((SELECT MAX(id) FROM loyalty_tier), 1));
SELECT setval('payment_provider_id_seq', COALESCE((SELECT MAX(id) FROM payment_provider), 1));

-- =========================================
-- TEST SEED FOR SmartLaundry API (Cleaned & Hashed Passwords)
-- =========================================

-- ===============================
-- ROLES
-- ===============================
INSERT INTO role (id, name)
VALUES (1, 'ADMIN'), (2, 'DRIVER'), (3, 'CUSTOMER')
    ON CONFLICT (id) DO NOTHING;

-- ===============================
-- USERS
-- ===============================
INSERT INTO app_user (username, email, phone, password_hash, role_id, status, verified)
VALUES
    ('test_admin', 'admin_test@example.com', '+254700000101', '$2a$10$TjPReR5eR/3Sh/Bp8efq0u8h1w1XY4PMqjUu6qlAhwzZ8N1r6n0PS', 1, 'ACTIVE', TRUE),
    ('test_driver1', 'driver_test1@example.com', '+254700000102', '$2a$10$3wT4uT3dU1v8l6Yv0kXz4uL3PoQ.mzC1Z9Hn4hQGQy/pBw1t4/e9C', 2, 'ACTIVE', TRUE),
    ('test_driver2', 'driver_test2@example.com', '+254700000103', '$2a$10$k9XG0y0jM0y4eA9F1f/5yeF5PfO4a5eWc8P1wVxYoQj4FxO5/t6u2', 2, 'ACTIVE', TRUE),
    ('test_customer1', 'customer_test1@example.com', '+254700000104', '$2a$10$z7XJ0y9uH0y7eB9F0g/6yfG4PfO3b5eWc9P2wWxZoQj3FxM4/t8v4', 3, 'ACTIVE', TRUE),
    ('test_customer2', 'customer_test2@example.com', '+254700000105', '$2a$10$p8YK0z1vH0y8eC0G1h/7yfH5PfO2c6eXc1P3wYxZoQk2FxL5/u9w5', 3, 'ACTIVE', TRUE)
    ON CONFLICT (email) DO NOTHING;

-- ===============================
-- COUNTRY, COUNTY & TOWNSHIP
-- ===============================
INSERT INTO country (id, iso2, name)
VALUES (1, 'KE', 'Kenya')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO county (id, name)
VALUES (1, 'Nairobi'), (2, 'Mombasa')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO township (id, name, county_id)
VALUES (1, 'Nairobi CBD', 1),
       (2, 'Westlands', 1),
       (3, 'Nyali', 2)
    ON CONFLICT (id) DO NOTHING;

-- ===============================
-- BRANCHES
-- ===============================
INSERT INTO branch (id, code, name, phone, email, address, township_id, latitude, longitude, location)
VALUES
    (1, 'NRB-CBD', 'Nairobi CBD Branch', '+254700111222', 'nrb-cbd@smartlaundry.test', 'Kimathi St', 1, -1.28333, 36.81667, ST_GeogFromText('SRID=4326;POINT(36.81667 -1.28333)')),
    (2, 'NRB-WL', 'Westlands Branch', '+254700111223', 'westlands@smartlaundry.test', 'Westlands Ave', 2, -1.2640, 36.8070, ST_GeogFromText('SRID=4326;POINT(36.8070 -1.2640)'))
    ON CONFLICT (id) DO NOTHING;

-- ===============================
-- SERVICE TYPES
-- ===============================
INSERT INTO service_type (id, code, name, description)
VALUES
    (1, 'WASH_FOLD', 'Wash & Fold', 'Standard wash & fold service'),
    (2, 'DRY_CLEAN', 'Dry Cleaning', 'Professional dry cleaning'),
    (3, 'IRON', 'Iron Only', 'Ironing service only')
    ON CONFLICT (id) DO NOTHING;

-- ===============================
-- CATEGORY
-- ===============================
INSERT INTO category (id, code, name, description)
VALUES
    (1, 'SHIRT', 'Shirt', 'Shirt laundry'),
    (2, 'TROUSER', 'Trouser', 'Trouser laundry'),
    (3, 'DUVET', 'Duvet', 'Duvet laundry')
    ON CONFLICT (id) DO NOTHING;

-- ===============================
-- CURRENCY
-- ===============================
INSERT INTO currency (code, name, symbol)
VALUES ('KES', 'Kenyan Shilling', 'KSh')
    ON CONFLICT (code) DO NOTHING;

-- ===============================
-- PRICE LIST
-- ===============================
INSERT INTO price_list (branch_id, service_type_id, category_id, currency, unit_price)
VALUES
    (1,1,1,'KES',150), (1,1,2,'KES',200), (1,1,3,'KES',800),
    (1,2,1,'KES',250), (1,2,2,'KES',350), (1,2,3,'KES',1200),
    (2,1,1,'KES',160), (2,1,2,'KES',210), (2,1,3,'KES',850)
    ON CONFLICT DO NOTHING;

-- ===============================
-- CUSTOMER PROFILES
-- ===============================
INSERT INTO customer_profile (customer_id, user_id, full_name, street, township_id, city, country_id, loyalty_points)
SELECT id, id, username || ' Test', 'Test Street 1', 1, 'Nairobi', 1, 0
FROM app_user
WHERE role_id = 3
    ON CONFLICT (customer_id) DO NOTHING;

-- ===============================
-- CARTS & CART ITEMS
-- ===============================
INSERT INTO carts (user_id)
SELECT id FROM app_user WHERE role_id = 3
    ON CONFLICT (user_id) DO NOTHING;

INSERT INTO cart_items (cart_id, item_name, quantity, price, category_id)
SELECT c.id, 'Shirt', 2, 150, 1
FROM carts c
         JOIN app_user u ON c.user_id = u.id
WHERE u.role_id = 3
    ON CONFLICT DO NOTHING;

-- ===============================
-- ORDERS & ORDER ITEMS
-- ===============================
INSERT INTO orders (order_no, branch_id, customer_id, user_id, service_type_id, status, currency, total)
SELECT 'TEST-ORD-' || nextval('orders_id_seq'), 1, u.id, u.id, 1, 'RECEIVED', 'KES', 500
FROM app_user u
WHERE u.role_id = 3
    ON CONFLICT DO NOTHING;

INSERT INTO order_item (order_id, category_id, quantity, unit_price)
SELECT o.id, 1, 2, 150
FROM orders o
         JOIN app_user u ON o.customer_id = u.id
WHERE u.role_id = 3
    ON CONFLICT DO NOTHING;

-- ===============================
-- PAYMENT PROVIDERS & METHODS
-- ===============================
INSERT INTO payment_provider (id, code, name)
VALUES (1, 'MPESA', 'Safaricom M-Pesa')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO payment_method (user_id, provider_id, mpesa_msisdn, label)
SELECT id, 1, '+254712345600', username || ' M-Pesa'
FROM app_user
WHERE role_id = 3
    ON CONFLICT DO NOTHING;

-- ===============================
-- PAYMENT RECORDS
-- ===============================
INSERT INTO payment (order_id, provider_id, payment_method_id, amount, currency, status)
SELECT o.id, 1, pm.id, 500, 'KES', 'PENDING'
FROM orders o
         JOIN app_user u ON o.customer_id = u.id
         JOIN payment_method pm ON pm.user_id = u.id
WHERE u.role_id = 3
    ON CONFLICT DO NOTHING;

-- ===============================
-- DELIVERY REQUESTS & DRIVER LOCATIONS
-- ===============================
INSERT INTO delivery_request (order_id, driver_id, status)
SELECT o.id, d.id, 'PENDING'
FROM orders o
         CROSS JOIN app_user d
WHERE d.role_id = 2
    ON CONFLICT DO NOTHING;

INSERT INTO driver_location (driver_id, location)
SELECT d.id, ST_GeogFromText('SRID=4326;POINT(' || (36.8 + random()/10) || ' ' || (-1.28 + random()/10) || ')')
FROM app_user d
WHERE d.role_id = 2
    ON CONFLICT DO NOTHING;

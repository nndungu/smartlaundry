-- ==========================================================
-- SEED DATA (MySQL 8.0+)
-- ==========================================================

-- Currency
INSERT INTO currency (code, name, symbol) VALUES
    ('KES','Kenyan Shilling','KSh');

-- Country
INSERT INTO country (iso2, name) VALUES ('KE','Kenya');

-- Counties
INSERT INTO county (name) VALUES ('Nairobi'), ('Mombasa'), ('Kiambu');

-- Townships
INSERT INTO township (name, county_id) VALUES
                                           ('Nairobi CBD', (SELECT county_id FROM county WHERE name='Nairobi')),
                                           ('Westlands',   (SELECT county_id FROM county WHERE name='Nairobi')),
                                           ('Parklands',   (SELECT county_id FROM county WHERE name='Nairobi')),
                                           ('Nyali',       (SELECT county_id FROM county WHERE name='Mombasa'));

-- Roles
INSERT INTO role (name) VALUES ('ADMIN'),('OWNER'),('STAFF'),('DRIVER'),('CUSTOMER');

-- Users (with bcrypt hashes)
-- Plain passwords for testing:
--   admin / admin123
--   owner / owner123
--   staff1 / staff123
--   driver1 / driver123
--   customer1 / customer123
INSERT INTO user (username,email,phone,password_hash,role_id)
VALUES
    ('admin','admin@laundromart.ke','+254700000001','$2a$10$kZB2o1s4kq8cXW9m7C9Kwe9r2m5mG3mWnS1y3sQX13l9aH5l1Kc8K',(SELECT role_id FROM role WHERE name='ADMIN')),
    ('owner','owner@laundromart.ke','+254700000010','$2a$10$kZB2o1s4kq8cXW9m7C9Kwe9r2m5mG3mWnS1y3sQX13l9aH5l1Kc8K',(SELECT role_id FROM role WHERE name='OWNER')),
    ('staff1','staff1@laundromart.ke','+254700000002','$2a$10$kZB2o1s4kq8cXW9m7C9Kwe9r2m5mG3mWnS1y3sQX13l9aH5l1Kc8K',(SELECT role_id FROM role WHERE name='STAFF')),
    ('driver1','driver1@laundromart.ke','+254700000003','$2a$10$kZB2o1s4kq8cXW9m7C9Kwe9r2m5mG3mWnS1y3sQX13l9aH5l1Kc8K',(SELECT role_id FROM role WHERE name='DRIVER')),
    ('customer1','customer1@laundromart.ke','+254700000004','$2a$10$kZB2o1s4kq8cXW9m7C9Kwe9r2m5mG3mWnS1y3sQX13l9aH5l1Kc8K',(SELECT role_id FROM role WHERE name='CUSTOMER'));

-- Branches
INSERT INTO branch (code,name,owner_user_id,phone,email,address,township_id,latitude,longitude)
VALUES
    ('NRB-CBD','Nairobi CBD Branch',(SELECT user_id FROM user WHERE username='owner'),'+254700111222','nrb-cbd@laundromart.ke','Kimathi St, Nairobi',(SELECT township_id FROM township WHERE name='Nairobi CBD'),-1.28333,36.81667),
    ('NRB-WST','Westlands Branch',(SELECT user_id FROM user WHERE username='owner'),'+254700111333','westlands@laundromart.ke','Waiyaki Way, Nairobi',(SELECT township_id FROM township WHERE name='Westlands'),-1.26800,36.80400);

-- Staff and driver assignment
INSERT INTO branch_staff (branch_id,user_id)
SELECT b.branch_id, u.user_id
FROM branch b JOIN user u
WHERE b.code='NRB-CBD' AND u.username IN ('staff1','driver1');

-- Customer profile
INSERT INTO customer_profile (customer_id, full_name, street, township_id, city, country_id, loyalty_points)
VALUES ((SELECT user_id FROM user WHERE username='customer1'),
        'John Mwangi','Kenyatta Ave 123',(SELECT township_id FROM township WHERE name='Nairobi CBD'),
        'Nairobi',(SELECT country_id FROM country WHERE iso2='KE'), 50);

-- Loyalty tiers
INSERT INTO loyalty_tier (code,name,min_points,multiplier,benefits) VALUES
                                                                        ('BRONZE','Bronze',0,1.000,'Basic'),
                                                                        ('SILVER','Silver',500,1.100,'+10% points'),
                                                                        ('GOLD','Gold',1500,1.200,'Priority support'),
                                                                        ('PLATINUM','Platinum',3000,1.300,'Free delivery offers');

-- Assign customer1 to Bronze
INSERT INTO customer_tier (customer_id, tier_id)
VALUES ((SELECT customer_id FROM customer_profile WHERE customer_id=(SELECT user_id FROM user WHERE username='customer1')),
        (SELECT tier_id FROM loyalty_tier WHERE code='BRONZE'));

-- Service types
INSERT INTO service_type (code,name,description) VALUES
                                                     ('WASH_FOLD','Wash & Fold','Standard wash and fold'),
                                                     ('DRY_CLEAN','Dry Cleaning','Dry-clean garments'),
                                                     ('IRON','Iron Only','Pressing service'),
                                                     ('EXPRESS','Express','Priority service');

-- Categories
INSERT INTO category (code,name) VALUES
                                     ('SHIRT','Shirt'), ('TROUSER','Trouser'), ('SUIT','Suit'), ('DUVET','Duvet');

-- Price list
INSERT INTO price_list (branch_id,service_type_id,category_id,currency,unit_price)
SELECT b.branch_id, st.service_type_id, c.category_id, 'KES',
       CASE c.code
           WHEN 'SHIRT' THEN 150
           WHEN 'TROUSER' THEN 200
           WHEN 'SUIT' THEN 600
           WHEN 'DUVET' THEN 800
           ELSE 250
           END
FROM branch b
         CROSS JOIN service_type st
         CROSS JOIN category c
WHERE b.code IN ('NRB-CBD','NRB-WST');

-- Payment providers
INSERT INTO payment_provider (code,name) VALUES ('MPESA','Safaricom M-Pesa'),('STRIPE','Stripe');

-- Payment config
INSERT INTO payment_config (branch_id,provider_id,mpesa_short_code,mpesa_party_b,mpesa_pass_key,stripe_acct_id,currency)
VALUES
    ((SELECT branch_id FROM branch WHERE code='NRB-CBD'), (SELECT provider_id FROM payment_provider WHERE code='MPESA'), '123456','123456','<MPESA_PASSKEY>','', 'KES'),
    ((SELECT branch_id FROM branch WHERE code='NRB-CBD'), (SELECT provider_id FROM payment_provider WHERE code='STRIPE'), NULL,NULL,NULL,'acct_123KES','KES');

-- Customer payment method
INSERT INTO payment_method (customer_id,provider_id,mpesa_msisdn,label,active)
VALUES ((SELECT user_id FROM user WHERE username='customer1'),
        (SELECT provider_id FROM payment_provider WHERE code='MPESA'), '+254712345678', 'John M-Pesa', 1);

-- Sample order
INSERT INTO orders (order_no,branch_id,customer_id,service_type_id,pickup_at,delivery_due_at,street,township_id,city,country_id,currency,status,delivery_fee,discount)
VALUES ('ORD-2025-000001',
        (SELECT branch_id FROM branch WHERE code='NRB-CBD'),
        (SELECT user_id FROM user WHERE username='customer1'),
        (SELECT service_type_id FROM service_type WHERE code='WASH_FOLD'),
        DATE_ADD(NOW(), INTERVAL 1 DAY),
        DATE_ADD(NOW(), INTERVAL 3 DAY),
        'Kimathi St Apt 3A',
        (SELECT township_id FROM township WHERE name='Nairobi CBD'),
        'Nairobi',(SELECT country_id FROM country WHERE iso2='KE'),
        'KES','RECEIVED',150,0);

-- Order items
INSERT INTO order_item (order_id, category_id, quantity, unit_price)
SELECT o.order_id, (SELECT category_id FROM category WHERE code='SHIRT'), 5,
       (SELECT unit_price FROM price_list WHERE branch_id=o.branch_id
                                            AND category_id=(SELECT category_id FROM category WHERE code='SHIRT')
                                            AND service_type_id=(SELECT service_type_id FROM service_type WHERE code='WASH_FOLD')
                                            AND active=1)
FROM orders o WHERE o.order_no='ORD-2025-000001';

INSERT INTO order_item (order_id, category_id, quantity, unit_price)
SELECT o.order_id, (SELECT category_id FROM category WHERE code='TROUSER'), 3,
       (SELECT unit_price FROM price_list WHERE branch_id=o.branch_id
                                            AND category_id=(SELECT category_id FROM category WHERE code='TROUSER')
                                            AND service_type_id=(SELECT service_type_id FROM service_type WHERE code='WASH_FOLD')
                                            AND active=1)
FROM orders o WHERE o.order_no='ORD-2025-000001';

-- Assign driver & delivery record
UPDATE orders SET assigned_driver_id = (SELECT user_id FROM user WHERE username='driver1')
WHERE order_no='ORD-2025-000001';

INSERT INTO delivery (order_id, branch_id, driver_id, scheduled_pickup_at, status)
SELECT order_id, branch_id, assigned_driver_id, pickup_at, 'PENDING' FROM orders WHERE order_no='ORD-2025-000001';

-- Payment for order
INSERT INTO payment (order_id, provider_id, payment_method_id, amount, currency, status, mpesa_checkout_request_id, mpesa_merchant_request_id)
VALUES (
           (SELECT order_id FROM orders WHERE order_no='ORD-2025-000001'),
           (SELECT provider_id FROM payment_provider WHERE code='MPESA'),
           (SELECT payment_method_id FROM payment_method WHERE label='John M-Pesa'),
           (SELECT total FROM orders WHERE order_no='ORD-2025-000001'),
           'KES','PENDING','ws_CO_2025_ABC123','21588-112233-1'
       );

-- Driver location
INSERT INTO driver_location (driver_id, latitude, longitude, recorded_at)
VALUES
    ((SELECT user_id FROM user WHERE username='driver1'), -1.28310, 36.81650, NOW()),
    ((SELECT user_id FROM user WHERE username='driver1'), -1.28300, 36.81660, DATE_ADD(NOW(), INTERVAL 5 MINUTE));

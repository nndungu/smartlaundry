-- ==========================================
-- LAUNDROMART H2 SEED DATA
-- ==========================================

-- Roles
INSERT INTO role (name) VALUES ('ADMIN'),('OWNER'),('STAFF'),('DRIVER'),('CUSTOMER');

-- Users
INSERT INTO app_user (username,email,phone,password_hash,role_id) VALUES
                                                                      ('admin','admin@laundromart.ke','+254700000001','$2a$10$9dK6wBbpXDbqwPw9g8h5QeU7pQTx4jSR4fkgVlf3O1ZPVlE.7t7bK',1),
                                                                      ('owner','owner@laundromart.ke','+254700000010','$2a$10$wBW3HRjZVn8Rcf2V6my4ReyH1bxEvRnA14xS/wL5Yc5MnCwejWk4m',2),
                                                                      ('staff1','staff1@laundromart.ke','+254700000002','$2a$10$YcM3OYF7Z0WdyO/61L7SGut1HQTSqRkDiIoFkQqL3hhiwzzNm/kyK',3),
                                                                      ('driver1','driver1@laundromart.ke','+254700000003','$2a$10$ExmliZwZTLCNo6ikKWeRz.NikQeWgTq4UbZzIt7gV8n6Wb8XHh1ya',4),
                                                                      ('customer1','customer1@laundromart.ke','+254700000004','$2a$10$BQ3yEvC5UKwYdFZy9Y4NFe6nqj0Ce0e4FnobEw8fVndOi8Zr8sLne',5);

-- Currency
INSERT INTO currency (code,name,symbol) VALUES ('KES','Kenyan Shilling','KSh');

-- Locations
INSERT INTO country (iso2,name) VALUES ('KE','Kenya');
INSERT INTO county (name) VALUES ('Nairobi'),('Mombasa'),('Kiambu');
INSERT INTO township (name,county_id) VALUES ('Nairobi CBD',1),('Westlands',1),('Parklands',1),('Nyali',2);

-- Branch
INSERT INTO branch (code,name,owner_user_id,phone,email,address,township_id,latitude,longitude) VALUES
    ('NRB-CBD','Nairobi CBD Branch',2,'+254700111222','nrb-cbd@laundromart.ke','Kimathi St, Nairobi',1,-1.28333,36.81667);

-- Service & Category
INSERT INTO service_type (code,name) VALUES ('WASH_FOLD','Wash & Fold'),('DRY_CLEAN','Dry Cleaning'),('IRON','Iron Only');
INSERT INTO category (code,name) VALUES ('SHIRT','Shirt'),('TROUSER','Trouser'),('SUIT','Suit');

-- Price List
INSERT INTO price_list (branch_id,service_type_id,category_id,currency,unit_price) VALUES
                                                                                       (1,1,1,'KES',150),(1,1,2,'KES',200),(1,1,3,'KES',600);

-- Customer Profile & Loyalty
INSERT INTO customer_profile (customer_id,full_name,street,township_id,city,country_id,loyalty_points) VALUES
    (5,'John Mwangi','Kenyatta Ave 123',1,'Nairobi',1,50);

INSERT INTO loyalty_tier (code,name,min_points,multiplier,benefits) VALUES
                                                                        ('BRONZE','Bronze',0,1.000,'Basic'),('SILVER','Silver',500,1.100,'+10% points');

INSERT INTO customer_tier (customer_id,tier_id) VALUES (5,1);

-- Orders & Items
INSERT INTO orders (order_no,branch_id,customer_id,service_type_id,pickup_at,delivery_due_at,street,township_id,city,currency,status,delivery_fee,discount,total) VALUES
    ('ORD-2025-0001',1,5,1,NOW(),DATEADD('DAY',3,NOW()),'Kimathi St Apt 3A',1,'Nairobi','KES','RECEIVED',150,0,1150);

INSERT INTO order_item (order_id,category_id,quantity,unit_price) VALUES (1,1,5,150),(1,2,3,200);

-- Payment
INSERT INTO payment_provider (code,name) VALUES ('MPESA','Safaricom M-Pesa'),('STRIPE','Stripe');
INSERT INTO payment_method (customer_id,provider_id,mpesa_msisdn,label,active) VALUES (5,1,'+254712345678','John M-Pesa',TRUE);
INSERT INTO payment (order_id,provider_id,payment_method_id,amount,currency,status) VALUES (1,1,1,1150,'KES','PENDING');

-- Delivery & Driver Location
INSERT INTO delivery (order_id,branch_id,driver_id,scheduled_pickup_at,status) VALUES (1,1,4,NOW(),'PENDING');
INSERT INTO driver_location (driver_id,latitude,longitude) VALUES (4,-1.28310,36.81650),(4,-1.28300,36.81660);

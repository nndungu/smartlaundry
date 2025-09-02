-- H2 Laundromart Seed Data

INSERT INTO role (name) VALUES ('ADMIN'),('OWNER'),('STAFF'),('DRIVER'),('CUSTOMER');

INSERT INTO user (username,email,phone,password_hash,role_id)
VALUES
    ('admin','admin@laundromart.ke','+254700000001','admin123',(SELECT role_id FROM role WHERE name='ADMIN')),
    ('owner','owner@laundromart.ke','+254700000010','owner123',(SELECT role_id FROM role WHERE name='OWNER')),
    ('staff1','staff1@laundromart.ke','+254700000002','staff123',(SELECT role_id FROM role WHERE name='STAFF')),
    ('driver1','driver1@laundromart.ke','+254700000003','driver123',(SELECT role_id FROM role WHERE name='DRIVER')),
    ('customer1','customer1@laundromart.ke','+254700000004','customer123',(SELECT role_id FROM role WHERE name='CUSTOMER'));

INSERT INTO branch (code,name,owner_user_id,phone,email,address,latitude,longitude)
VALUES
    ('NRB-CBD','Nairobi CBD Branch',(SELECT user_id FROM user WHERE username='owner'),'+254700111222','nrb-cbd@laundromart.ke','Kimathi St, Nairobi',-1.28333,36.81667);

INSERT INTO service_type (code,name) VALUES
                                         ('WASH_FOLD','Wash & Fold'),
                                         ('DRY_CLEAN','Dry Cleaning'),
                                         ('IRON','Iron Only');

INSERT INTO category (code,name) VALUES
                                     ('SHIRT','Shirt'),
                                     ('TROUSER','Trouser'),
                                     ('SUIT','Suit');

INSERT INTO payment_provider (code,name) VALUES
                                             ('MPESA','Safaricom M-Pesa'),
                                             ('STRIPE','Stripe');

INSERT INTO orders (order_no,branch_id,customer_id,status,subtotal,total)
VALUES ('ORD-2025-000001',(SELECT branch_id FROM branch WHERE code='NRB-CBD'),
        (SELECT user_id FROM user WHERE username='customer1'),
        'PENDING',1000,1150);


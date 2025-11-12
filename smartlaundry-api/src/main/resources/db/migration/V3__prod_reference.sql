-- ============================================================
-- PROD REFERENCE DATA – Only idempotent reference tables
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
-- SERVICE TYPES
-- ===============================
INSERT INTO service_type (id, code, name, description) VALUES
                                                           (1, 'WASH_FOLD', 'Wash & Fold', 'Standard wash and fold service'),
                                                           (2, 'DRY_CLEAN', 'Dry Cleaning', 'Professional dry cleaning'),
                                                           (3, 'IRON', 'Iron Only', 'Ironing service only')
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- CATEGORY
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
-- PAYMENT PROVIDERS
-- ===============================
INSERT INTO payment_provider (id, code, name) VALUES
                                                  (1, 'MPESA', 'Safaricom M-Pesa'),
                                                  (2, 'CARD', 'Visa/MasterCard')
ON CONFLICT (id) DO NOTHING;

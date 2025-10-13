-- ===============================
-- RESET DATABASE (for local dev)
-- ===============================
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- ===============================
-- 1. Roles
-- ===============================
CREATE TABLE role (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(50) NOT NULL UNIQUE
);

-- ===============================
-- 2. Users
-- ===============================
CREATE TABLE app_user (
                          id BIGSERIAL PRIMARY KEY,
                          username VARCHAR(100) NOT NULL,
                          email VARCHAR(100) NOT NULL UNIQUE,
                          phone VARCHAR(20),
                          password_hash VARCHAR(255) NOT NULL,
                          role_id INT NOT NULL REFERENCES role(id),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          status VARCHAR(20) DEFAULT 'ACTIVE',
                          verified BOOLEAN DEFAULT FALSE -- ✅ email/phone verification flag
);

-- ===============================
-- 3. Country
-- ===============================
CREATE TABLE country (
                         id SERIAL PRIMARY KEY,
                         iso2 CHAR(2) NOT NULL UNIQUE,
                         name VARCHAR(100) NOT NULL
);

-- ===============================
-- 4. County
-- ===============================
CREATE TABLE county (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL
);

-- ===============================
-- 5. Township
-- ===============================
CREATE TABLE township (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          county_id INT NOT NULL REFERENCES county(id)
);

-- ===============================
-- 6. Branch
-- ===============================
CREATE TABLE branch (
                        id SERIAL PRIMARY KEY,
                        code VARCHAR(50) NOT NULL UNIQUE,
                        name VARCHAR(100) NOT NULL,
                        owner_user_id BIGINT NOT NULL REFERENCES app_user(id),
                        phone VARCHAR(20),
                        email VARCHAR(100),
                        address VARCHAR(255),
                        township_id INT NOT NULL REFERENCES township(id),
                        latitude DECIMAL(10,8),
                        longitude DECIMAL(11,8)
);

-- ===============================
-- 7. Branch Staff
-- ===============================
CREATE TABLE branch_staff (
                              id BIGSERIAL PRIMARY KEY,
                              branch_id INT NOT NULL REFERENCES branch(id),
                              user_id BIGINT NOT NULL REFERENCES app_user(id)
);

-- ===============================
-- 8. Service Type
-- ===============================
CREATE TABLE service_type (
                              id SERIAL PRIMARY KEY,
                              code VARCHAR(50) NOT NULL UNIQUE,
                              name VARCHAR(50) NOT NULL
);

-- ===============================
-- 9. Category
-- ===============================
CREATE TABLE category (
                          id SERIAL PRIMARY KEY,
                          code VARCHAR(50) NOT NULL UNIQUE,
                          name VARCHAR(50) NOT NULL
);

-- ===============================
-- 10. Currency
-- ===============================
CREATE TABLE currency (
                          code CHAR(3) PRIMARY KEY,
                          name VARCHAR(50) NOT NULL,
                          symbol VARCHAR(10)
);

-- ===============================
-- 11. Price List
-- ===============================
CREATE TABLE price_list (
                            id BIGSERIAL PRIMARY KEY,
                            branch_id INT NOT NULL REFERENCES branch(id),
                            service_type_id INT NOT NULL REFERENCES service_type(id),
                            category_id INT NOT NULL REFERENCES category(id),
                            currency CHAR(3) NOT NULL REFERENCES currency(code),
                            unit_price DECIMAL(10,2) NOT NULL
);

-- ===============================
-- 12. Orders
-- ===============================
CREATE TABLE orders (
                        id BIGSERIAL PRIMARY KEY,
                        order_no VARCHAR(50) NOT NULL UNIQUE,
                        branch_id INT NOT NULL REFERENCES branch(id),
                        customer_id BIGINT NOT NULL REFERENCES app_user(id),
                        service_type_id INT NOT NULL REFERENCES service_type(id),
                        pickup_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        delivery_due_at TIMESTAMP,
                        street VARCHAR(255),
                        township_id INT REFERENCES township(id),
                        city VARCHAR(100),
                        currency CHAR(3) REFERENCES currency(code),
                        status VARCHAR(20) NOT NULL,
                        delivery_fee DECIMAL(10,2) DEFAULT 0,
                        discount DECIMAL(10,2) DEFAULT 0,
                        total DECIMAL(10,2) DEFAULT 0
);

-- ===============================
-- 13. Order Items
-- ===============================
CREATE TABLE order_item (
                            id BIGSERIAL PRIMARY KEY,
                            order_id BIGINT NOT NULL REFERENCES orders(id),
                            category_id INT NOT NULL REFERENCES category(id),
                            quantity INT NOT NULL,
                            unit_price DECIMAL(10,2) NOT NULL
);

-- ===============================
-- 14. Customer Profile
-- ===============================
CREATE TABLE customer_profile (
                                  id BIGSERIAL PRIMARY KEY,
                                  customer_id BIGINT NOT NULL REFERENCES app_user(id),
                                  full_name VARCHAR(100),
                                  street VARCHAR(255),
                                  township_id INT REFERENCES township(id),
                                  city VARCHAR(100),
                                  country_id INT REFERENCES country(id),
                                  loyalty_points INT DEFAULT 0
);

-- ===============================
-- 15. Loyalty Tier
-- ===============================
CREATE TABLE loyalty_tier (
                              id SERIAL PRIMARY KEY,
                              code VARCHAR(20) NOT NULL UNIQUE,
                              name VARCHAR(50) NOT NULL,
                              min_points INT NOT NULL,
                              multiplier DECIMAL(5,3) DEFAULT 1.000,
                              benefits VARCHAR(255)
);

-- ===============================
-- 16. Customer Tier
-- ===============================
CREATE TABLE customer_tier (
                               id BIGSERIAL PRIMARY KEY,
                               customer_id BIGINT NOT NULL REFERENCES customer_profile(id),
                               tier_id INT NOT NULL REFERENCES loyalty_tier(id)
);

-- ===============================
-- 17. Loyalty Ledger
-- ===============================
CREATE TABLE loyalty_ledger (
                                id BIGSERIAL PRIMARY KEY,
                                customer_id BIGINT NOT NULL REFERENCES customer_profile(id),
                                points INT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 18. Payment Provider
-- ===============================
CREATE TABLE payment_provider (
                                  id SERIAL PRIMARY KEY,
                                  code VARCHAR(50) NOT NULL UNIQUE,
                                  name VARCHAR(50) NOT NULL
);

-- ===============================
-- 19. Payment Method
-- ===============================
CREATE TABLE payment_method (
                                id SERIAL PRIMARY KEY,
                                customer_id BIGINT REFERENCES app_user(id),
                                provider_id INT NOT NULL REFERENCES payment_provider(id),
                                mpesa_msisdn VARCHAR(20),
                                label VARCHAR(100),
                                active BOOLEAN DEFAULT TRUE
);

-- ===============================
-- 20. Payment
-- ===============================
CREATE TABLE payment (
                         id BIGSERIAL PRIMARY KEY,
                         order_id BIGINT NOT NULL REFERENCES orders(id),
                         provider_id INT NOT NULL REFERENCES payment_provider(id),
                         payment_method_id INT REFERENCES payment_method(id),
                         amount DECIMAL(10,2) NOT NULL,
                         currency CHAR(3) REFERENCES currency(code),
                         status VARCHAR(20),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 21. Delivery
-- ===============================
CREATE TABLE delivery (
                          id BIGSERIAL PRIMARY KEY,
                          order_id BIGINT NOT NULL REFERENCES orders(id),
                          branch_id INT NOT NULL REFERENCES branch(id),
                          driver_id BIGINT NOT NULL REFERENCES app_user(id),
                          scheduled_pickup_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          status VARCHAR(20) NOT NULL
);

-- ===============================
-- 22. Driver Location
-- ===============================
CREATE TABLE driver_location (
                                 id BIGSERIAL PRIMARY KEY,
                                 driver_id BIGINT NOT NULL REFERENCES app_user(id),
                                 latitude DECIMAL(10,8) NOT NULL,
                                 longitude DECIMAL(11,8) NOT NULL,
                                 recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

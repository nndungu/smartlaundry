-- ================================================
-- SMARTLAUNDRY DATABASE SCHEMA (Production Ready)
-- Version: 1.0
-- ================================================

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- ===============================
-- 1. Roles
-- ===============================
CREATE TABLE role (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(50) NOT NULL UNIQUE,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
                          role_id INT NOT NULL REFERENCES role(id) ON DELETE RESTRICT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          status VARCHAR(20) DEFAULT 'ACTIVE',
                          verified BOOLEAN DEFAULT FALSE,
                          deleted_at TIMESTAMP NULL,
                          CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

-- ===============================
-- 3. Country / County / Township
-- ===============================
CREATE TABLE country (
                         id SERIAL PRIMARY KEY,
                         iso2 CHAR(2) NOT NULL UNIQUE,
                         name VARCHAR(100) NOT NULL,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE county (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL UNIQUE,
                        country_id INT NOT NULL REFERENCES country(id) ON DELETE CASCADE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE township (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          county_id INT NOT NULL REFERENCES county(id) ON DELETE CASCADE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT township_name_county_unique UNIQUE(name, county_id)
);

-- ===============================
-- 4. Branches
-- ===============================
CREATE TABLE branch (
                        id SERIAL PRIMARY KEY,
                        code VARCHAR(50) NOT NULL UNIQUE,
                        name VARCHAR(100) NOT NULL,
                        owner_user_id BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
                        phone VARCHAR(20),
                        email VARCHAR(100),
                        address VARCHAR(255),
                        township_id INT NOT NULL REFERENCES township(id) ON DELETE CASCADE,
                        latitude DOUBLE PRECISION,
                        longitude DOUBLE PRECISION,
                        location geometry(Point, 4326),
                        status VARCHAR(20) DEFAULT 'ACTIVE',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        deleted_at TIMESTAMP NULL,
                        CONSTRAINT chk_branch_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE'))
);

CREATE TABLE branch_staff (
                              id BIGSERIAL PRIMARY KEY,
                              branch_id INT NOT NULL REFERENCES branch(id) ON DELETE CASCADE,
                              user_id BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
                              role VARCHAR(50) NOT NULL DEFAULT 'STAFF',
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              UNIQUE (branch_id, user_id),
                              CONSTRAINT chk_staff_role CHECK (role IN ('MANAGER', 'STAFF', 'DRIVER'))
);

-- ===============================
-- 5. Services, Categories & Pricing
-- ===============================
CREATE TABLE service_type (
                              id SERIAL PRIMARY KEY,
                              code VARCHAR(50) NOT NULL UNIQUE,
                              name VARCHAR(50) NOT NULL,
                              description TEXT,
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
                          id SERIAL PRIMARY KEY,
                          code VARCHAR(50) NOT NULL UNIQUE,
                          name VARCHAR(50) NOT NULL,
                          description TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE currency (
                          code CHAR(3) PRIMARY KEY,
                          name VARCHAR(50) NOT NULL,
                          symbol VARCHAR(10),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_list (
                            id BIGSERIAL PRIMARY KEY,
                            branch_id INT NOT NULL REFERENCES branch(id) ON DELETE CASCADE,
                            service_type_id INT NOT NULL REFERENCES service_type(id) ON DELETE CASCADE,
                            category_id INT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
                            currency CHAR(3) NOT NULL REFERENCES currency(code),
                            unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
                            is_active BOOLEAN DEFAULT TRUE,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            UNIQUE (branch_id, service_type_id, category_id, currency)
);

-- ===============================
-- 6. Cart and Order & Items
-- ===============================
CREATE TABLE cart (
                      id BIGSERIAL PRIMARY KEY,
                      user_id BIGINT NOT NULL UNIQUE REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
                           id BIGSERIAL PRIMARY KEY,
                           cart_id BIGINT NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
                           item_name VARCHAR(255) NOT NULL,
                           quantity INT NOT NULL CHECK (quantity > 0),
                           price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
                           category_id INT REFERENCES category(id) ON DELETE SET NULL
);

CREATE TABLE orders (
                        id BIGSERIAL PRIMARY KEY,
                        order_no VARCHAR(50) NOT NULL UNIQUE,
                        branch_id INT NOT NULL REFERENCES branch(id),
                        customer_id BIGINT NOT NULL REFERENCES app_user(id),
                        service_type_id INT NOT NULL REFERENCES service_type(id),
                        pickup_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        delivery_due_at TIMESTAMP,
                        actual_delivery_at TIMESTAMP,
                        street VARCHAR(255),
                        township_id INT REFERENCES township(id),
                        city VARCHAR(100),
                        currency CHAR(3) REFERENCES currency(code),
                        status VARCHAR(20) NOT NULL DEFAULT 'RECEIVED',
                        delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
                        discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
                        subtotal DECIMAL(10,2) DEFAULT 0 CHECK (subtotal >= 0),
                        tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
                        total DECIMAL(10,2) DEFAULT 0 CHECK (total >= 0),
                        notes TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT chk_order_status CHECK (status IN ('RECEIVED', 'PROCESSING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELLED')),
                        CONSTRAINT chk_delivery_time CHECK (delivery_due_at > pickup_at)
);

CREATE TABLE order_item (
                            id BIGSERIAL PRIMARY KEY,
                            order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                            category_id INT NOT NULL REFERENCES category(id),
                            quantity INT NOT NULL CHECK (quantity > 0),
                            unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
                            total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 7. Customer Profiles & Loyalty
-- ===============================
CREATE TABLE customer_profile (
                                  id BIGSERIAL PRIMARY KEY,
                                  customer_id BIGINT NOT NULL UNIQUE REFERENCES app_user(id) ON DELETE CASCADE,
                                  full_name VARCHAR(100) NOT NULL,
                                  street VARCHAR(255),
                                  township_id INT REFERENCES township(id),
                                  city VARCHAR(100),
                                  country_id INT REFERENCES country(id),
                                  loyalty_points INT DEFAULT 0 CHECK (loyalty_points >= 0),
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loyalty_tier (
                              id SERIAL PRIMARY KEY,
                              code VARCHAR(20) NOT NULL UNIQUE,
                              name VARCHAR(50) NOT NULL,
                              min_points INT NOT NULL CHECK (min_points >= 0),
                              multiplier DECIMAL(5,3) DEFAULT 1.000 CHECK (multiplier >= 0),
                              benefits TEXT,
                              is_active BOOLEAN DEFAULT TRUE,
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_tier (
                               id BIGSERIAL PRIMARY KEY,
                               customer_id BIGINT NOT NULL REFERENCES customer_profile(id) ON DELETE CASCADE,
                               tier_id INT NOT NULL REFERENCES loyalty_tier(id) ON DELETE CASCADE,
                               assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               is_active BOOLEAN DEFAULT TRUE,
                               UNIQUE (customer_id, tier_id)
);

CREATE TABLE loyalty_ledger (
                                id BIGSERIAL PRIMARY KEY,
                                customer_id BIGINT NOT NULL REFERENCES customer_profile(id) ON DELETE CASCADE,
                                points INT NOT NULL,
                                type VARCHAR(20) NOT NULL DEFAULT 'EARNED',
                                reference_type VARCHAR(50),
                                reference_id BIGINT,
                                expires_at TIMESTAMP,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT chk_ledger_type CHECK (type IN ('EARNED', 'SPENT', 'EXPIRED'))
);

-- ===============================
-- 8. Payments
-- ===============================
CREATE TABLE payment_provider (
                                  id SERIAL PRIMARY KEY,
                                  code VARCHAR(50) NOT NULL UNIQUE,
                                  name VARCHAR(50) NOT NULL,
                                  is_active BOOLEAN DEFAULT TRUE,
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_method (
                                id SERIAL PRIMARY KEY,
                                customer_id BIGINT NOT NULL REFERENCES app_user(id),
                                provider_id INT NOT NULL REFERENCES payment_provider(id),
                                mpesa_msisdn VARCHAR(20),
                                label VARCHAR(100),
                                is_default BOOLEAN DEFAULT FALSE,
                                active BOOLEAN DEFAULT TRUE,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment (
                         id BIGSERIAL PRIMARY KEY,
                         order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                         provider_id INT NOT NULL REFERENCES payment_provider(id),
                         payment_method_id INT REFERENCES payment_method(id),
                         amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
                         currency CHAR(3) NOT NULL REFERENCES currency(code),
                         status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                         transaction_id VARCHAR(100),
                         metadata JSONB,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'))
);

-- ===============================
-- 9. Delivery & Driver Locations
-- ===============================
CREATE TABLE delivery (
                          id BIGSERIAL PRIMARY KEY,
                          order_id BIGINT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
                          branch_id INT NOT NULL REFERENCES branch(id),
                          driver_id BIGINT NOT NULL REFERENCES app_user(id),
                          scheduled_pickup_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          actual_pickup_at TIMESTAMP,
                          scheduled_delivery_at TIMESTAMP,
                          actual_delivery_at TIMESTAMP,
                          status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                          notes TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT chk_delivery_status CHECK (status IN ('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED'))
);

CREATE TABLE delivery_request (
                                  id BIGSERIAL PRIMARY KEY,
                                  order_id BIGINT NOT NULL,
                                  driver_id BIGINT,
                                  status VARCHAR(50) DEFAULT 'PENDING',
                                  created_at TIMESTAMP DEFAULT NOW(),
                                  accepted_at TIMESTAMP,
                                  completed_at TIMESTAMP,
                                  CONSTRAINT fk_order FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
                                  CONSTRAINT fk_driver FOREIGN KEY(driver_id) REFERENCES app_user(id) ON DELETE SET NULL
);

CREATE TABLE driver_location (
                                 id BIGSERIAL PRIMARY KEY,
                                 driver_id BIGINT NOT NULL REFERENCES app_user(id),
                                 latitude DOUBLE PRECISION NOT NULL,
                                 longitude DOUBLE PRECISION NOT NULL,
                                 location geometry(Point, 4326),
                                 recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE earnings_ledger (
                                 id SERIAL PRIMARY KEY,
                                 driver_id INT REFERENCES app_user(id),
                                 order_id INT REFERENCES orders(id),
                                 service_type_id INT REFERENCES service_type(id),
                                 transaction_type VARCHAR(50),
                                 amount NUMERIC(10,2),
                                 created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- FUNCTIONS & TRIGGERS for updated_at
-- ===============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_user_updated_at BEFORE UPDATE ON app_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branch_updated_at BEFORE UPDATE ON branch FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_updated_at BEFORE UPDATE ON payment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_updated_at BEFORE UPDATE ON delivery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_profile_updated_at BEFORE UPDATE ON customer_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_list_updated_at BEFORE UPDATE ON price_list FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_method_updated_at BEFORE UPDATE ON payment_method FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- COMMENT on tables and columns
-- ===============================
COMMENT ON TABLE app_user IS 'Stores all user accounts for the system';
COMMENT ON TABLE orders IS 'Main orders table tracking laundry service requests';
COMMENT ON TABLE delivery IS 'Tracks delivery assignments and status for orders';
COMMENT ON TABLE payment IS 'Records all payment transactions for orders';

-- ===============================
-- END OF SCHEMA
-- ===============================

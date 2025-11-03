-- ===============================
-- SETUP
-- ===============================
SET search_path TO public;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
       CREATE EXTENSION postgis;
END IF;
END$$;

-- ===============================
-- Roles
-- ===============================
CREATE TABLE IF NOT EXISTS role (
                                    id SERIAL PRIMARY KEY,
                                    name VARCHAR(50) NOT NULL UNIQUE
    );

-- ===============================
-- Users
-- ===============================
CREATE TABLE IF NOT EXISTS app_user (
                                        id BIGSERIAL PRIMARY KEY,
                                        username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES role(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             status VARCHAR(20) DEFAULT 'ACTIVE',
    verified BOOLEAN DEFAULT FALSE,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8)
    );

-- ===============================
-- Location Tables
-- ===============================
CREATE TABLE IF NOT EXISTS country (
                                       id SERIAL PRIMARY KEY,
                                       iso2 CHAR(2) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
    );

CREATE TABLE IF NOT EXISTS county (
                                      id SERIAL PRIMARY KEY,
                                      name VARCHAR(100) NOT NULL
    );

CREATE TABLE IF NOT EXISTS township (
                                        id SERIAL PRIMARY KEY,
                                        name VARCHAR(100) NOT NULL,
    county_id INT NOT NULL REFERENCES county(id)
    );

-- ===============================
-- Branch
-- ===============================
CREATE TABLE IF NOT EXISTS branch (
                                      id SERIAL PRIMARY KEY,
                                      code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    township_id INT NOT NULL REFERENCES township(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    location GEOGRAPHY(Point,4326)
    );

CREATE INDEX IF NOT EXISTS idx_branch_location_gist ON branch USING GIST (location);

-- ===============================
-- Service & Category
-- ===============================
CREATE TABLE IF NOT EXISTS service_type (
                                            id SERIAL PRIMARY KEY,
                                            code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT
    );

CREATE TABLE IF NOT EXISTS category (
                                        id SERIAL PRIMARY KEY,
                                        code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT
    );

-- ===============================
-- Currency & Pricing
-- ===============================
CREATE TABLE IF NOT EXISTS currency (
                                        code CHAR(3) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10)
    );

CREATE TABLE IF NOT EXISTS price_list (
                                          id BIGSERIAL PRIMARY KEY,
                                          branch_id INT NOT NULL REFERENCES branch(id),
    service_type_id INT NOT NULL REFERENCES service_type(id),
    category_id INT NOT NULL REFERENCES category(id),
    currency CHAR(3) NOT NULL REFERENCES currency(code),
    unit_price DECIMAL(10,2) NOT NULL
    );

-- ===============================
-- Cart & Items
-- ===============================
CREATE TABLE IF NOT EXISTS carts (
                                     id BIGSERIAL PRIMARY KEY,
                                     user_id BIGINT NOT NULL UNIQUE REFERENCES app_user(id)
    );

CREATE TABLE IF NOT EXISTS cart_items (
                                          id BIGSERIAL PRIMARY KEY,
                                          cart_id BIGINT NOT NULL REFERENCES carts(id),
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INT REFERENCES category(id)
    );

-- ===============================
-- Orders
-- ===============================
CREATE TABLE IF NOT EXISTS orders (
                                      id BIGSERIAL PRIMARY KEY,
                                      order_no VARCHAR(50) NOT NULL UNIQUE,
    branch_id INT NOT NULL REFERENCES branch(id),
    customer_id BIGINT NOT NULL REFERENCES app_user(id),
    user_id BIGINT NOT NULL REFERENCES app_user(id),
    service_type_id INT NOT NULL REFERENCES service_type(id),
    pickup_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivery_due_at TIMESTAMP WITH TIME ZONE,
                                  street VARCHAR(255),
    township_id INT REFERENCES township(id),
    city VARCHAR(100),
    currency CHAR(3) REFERENCES currency(code),
    status VARCHAR(20) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                  );

CREATE TABLE IF NOT EXISTS order_item (
                                          id BIGSERIAL PRIMARY KEY,
                                          order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES category(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
    );

-- ===============================
-- Customer Profile
-- ===============================
CREATE TABLE IF NOT EXISTS customer_profile (
                                                id BIGSERIAL PRIMARY KEY,
                                                customer_id BIGINT NOT NULL REFERENCES app_user(id),
    user_id BIGINT NOT NULL REFERENCES app_user(id),
    full_name VARCHAR(100),
    street VARCHAR(255),
    township_id INT REFERENCES township(id),
    city VARCHAR(100),
    country_id INT REFERENCES country(id),
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                             );

-- ===============================
-- Payment
-- ===============================
CREATE TABLE IF NOT EXISTS payment_provider (
                                                id SERIAL PRIMARY KEY,
                                                code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
    );

CREATE TABLE IF NOT EXISTS payment_method (
                                              id SERIAL PRIMARY KEY,
                                              user_id BIGINT REFERENCES app_user(id),
    provider_id INT NOT NULL REFERENCES payment_provider(id),
    mpesa_msisdn VARCHAR(20),
    label VARCHAR(100),
    active BOOLEAN DEFAULT TRUE
    );

CREATE TABLE IF NOT EXISTS payment (
                                       id BIGSERIAL PRIMARY KEY,
                                       order_id BIGINT NOT NULL REFERENCES orders(id),
    provider_id INT NOT NULL REFERENCES payment_provider(id),
    payment_method_id INT REFERENCES payment_method(id),
    amount DECIMAL(12,2) NOT NULL,
    currency CHAR(3) REFERENCES currency(code),
    transaction_ref VARCHAR(200) UNIQUE,
    status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                             );

-- ===============================
-- Delivery
-- ===============================
CREATE TABLE IF NOT EXISTS delivery_request (
                                                id BIGSERIAL PRIMARY KEY,
                                                order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    driver_id BIGINT REFERENCES app_user(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
                                                                                                   );

CREATE TABLE IF NOT EXISTS driver_location (
                                               id BIGSERIAL PRIMARY KEY,
                                               driver_id BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    location GEOGRAPHY(Point,4326) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                                                                                     );

CREATE INDEX IF NOT EXISTS idx_driver_location_geog ON driver_location USING GIST (location);

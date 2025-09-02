-- H2 Laundromart Schema (v1)
-- Adjustments: ENGINE removed, AUTO_INCREMENT → IDENTITY, JSON → CLOB, ENUM → VARCHAR

DROP TABLE IF EXISTS user CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS branch CASCADE;
DROP TABLE IF EXISTS branch_staff CASCADE;
DROP TABLE IF EXISTS customer_profile CASCADE;
DROP TABLE IF EXISTS loyalty_tier CASCADE;
DROP TABLE IF EXISTS customer_tier CASCADE;
DROP TABLE IF EXISTS loyalty_ledger CASCADE;
DROP TABLE IF EXISTS service_type CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS price_list CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS delivery CASCADE;
DROP TABLE IF EXISTS driver_location CASCADE;
DROP TABLE IF EXISTS payment_provider CASCADE;
DROP TABLE IF EXISTS payment_method CASCADE;
DROP TABLE IF EXISTS payment_config CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS payment_webhook CASCADE;
DROP TABLE IF EXISTS earnings_ledger CASCADE;

CREATE TABLE role (
                      role_id IDENTITY PRIMARY KEY,
                      name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE user (
                      user_id IDENTITY PRIMARY KEY,
                      username VARCHAR(60) NOT NULL UNIQUE,
                      email VARCHAR(120),
                      phone VARCHAR(32),
                      password_hash VARCHAR(255) NOT NULL,
                      role_id BIGINT NOT NULL,
                      status VARCHAR(20) DEFAULT 'ACTIVE',
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE branch (
                        branch_id IDENTITY PRIMARY KEY,
                        code VARCHAR(40) NOT NULL UNIQUE,
                        name VARCHAR(120) NOT NULL,
                        owner_user_id BIGINT NOT NULL,
                        phone VARCHAR(32),
                        email VARCHAR(120),
                        address VARCHAR(255),
                        latitude DECIMAL(9,6),
                        longitude DECIMAL(9,6),
                        active BOOLEAN DEFAULT TRUE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_branch_owner FOREIGN KEY (owner_user_id) REFERENCES user(user_id)
);

CREATE TABLE branch_staff (
                              branch_id BIGINT NOT NULL,
                              user_id BIGINT NOT NULL,
                              PRIMARY KEY (branch_id, user_id),
                              CONSTRAINT fk_bstaff_branch FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE,
                              CONSTRAINT fk_bstaff_user FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE service_type (
                              service_type_id IDENTITY PRIMARY KEY,
                              code VARCHAR(40) NOT NULL UNIQUE,
                              name VARCHAR(100) NOT NULL
);

CREATE TABLE category (
                          category_id IDENTITY PRIMARY KEY,
                          code VARCHAR(40) NOT NULL UNIQUE,
                          name VARCHAR(100) NOT NULL
);

CREATE TABLE price_list (
                            price_id IDENTITY PRIMARY KEY,
                            branch_id BIGINT NOT NULL,
                            service_type_id BIGINT NOT NULL,
                            category_id BIGINT NOT NULL,
                            currency VARCHAR(3) NOT NULL,
                            unit_price DECIMAL(12,2) NOT NULL,
                            active BOOLEAN DEFAULT TRUE,
                            CONSTRAINT fk_price_branch FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
                            CONSTRAINT fk_price_stype FOREIGN KEY (service_type_id) REFERENCES service_type(service_type_id),
                            CONSTRAINT fk_price_cat FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE orders (
                        order_id IDENTITY PRIMARY KEY,
                        order_no VARCHAR(40) NOT NULL UNIQUE,
                        branch_id BIGINT NOT NULL,
                        customer_id BIGINT NOT NULL,
                        placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        pickup_at TIMESTAMP,
                        delivery_due_at TIMESTAMP,
                        status VARCHAR(20) DEFAULT 'PENDING',
                        subtotal DECIMAL(12,2) DEFAULT 0,
                        delivery_fee DECIMAL(12,2) DEFAULT 0,
                        discount DECIMAL(12,2) DEFAULT 0,
                        total DECIMAL(12,2) DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_order_branch FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
                        CONSTRAINT fk_order_cust FOREIGN KEY (customer_id) REFERENCES user(user_id)
);

CREATE TABLE order_item (
                            order_id BIGINT NOT NULL,
                            category_id BIGINT NOT NULL,
                            quantity INT NOT NULL,
                            unit_price DECIMAL(12,2) NOT NULL,
                            PRIMARY KEY (order_id, category_id),
                            CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                            CONSTRAINT fk_oi_cat FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE payment_provider (
                                  provider_id IDENTITY PRIMARY KEY,
                                  code VARCHAR(40) NOT NULL UNIQUE,
                                  name VARCHAR(100) NOT NULL
);

CREATE TABLE payment (
                         payment_id IDENTITY PRIMARY KEY,
                         order_id BIGINT NOT NULL,
                         provider_id BIGINT NOT NULL,
                         amount DECIMAL(12,2) NOT NULL,
                         currency VARCHAR(3) NOT NULL,
                         status VARCHAR(20) DEFAULT 'PENDING',
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_pay_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                         CONSTRAINT fk_pay_provider FOREIGN KEY (provider_id) REFERENCES payment_provider(provider_id)
);

-- ----------------------------------------------------------
-- VIEWS (H2 compatible versions of MySQL views)
-- ----------------------------------------------------------

CREATE OR REPLACE VIEW vw_order_summary AS
SELECT o.order_id, o.order_no, o.status, o.placed_at,
       b.name AS branch_name,
       u.username AS customer_username,
       o.subtotal, o.delivery_fee, o.discount, o.total, o.currency
FROM orders o
         JOIN branch b   ON b.branch_id = o.branch_id
         JOIN user   u   ON u.user_id   = o.customer_id;

CREATE OR REPLACE VIEW vw_driver_my_orders AS
SELECT o.order_id, o.order_no, o.status, o.pickup_at, o.delivery_due_at,
       o.street, o.city,
       o.total, o.currency
FROM orders o
WHERE o.assigned_driver_id IS NOT NULL;

CREATE OR REPLACE VIEW vw_payment_status AS
SELECT p.payment_id, o.order_no, pr.code AS provider,
       p.amount, p.currency, p.status, p.created_at
FROM payment p
         JOIN orders o ON o.order_id = p.order_id
         JOIN payment_provider pr ON pr.provider_id = p.provider_id;

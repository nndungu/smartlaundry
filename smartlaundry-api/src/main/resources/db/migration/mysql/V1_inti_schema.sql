-- ==========================================================
-- LAUNDROMART SCHEMA (MySQL 8.0+)
-- ==========================================================

DROP DATABASE IF EXISTS laundromart;
CREATE DATABASE laundromart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE laundromart;

-- Tables for currency, country, county, township
CREATE TABLE currency (
                          code CHAR(3) PRIMARY KEY,
                          name VARCHAR(64) NOT NULL,
                          symbol VARCHAR(8) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE country (
                         country_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
                         iso2 CHAR(2) NOT NULL UNIQUE,
                         name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE county (
                        county_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE township (
                          township_id INT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(120) NOT NULL,
                          county_id SMALLINT NOT NULL,
                          UNIQUE KEY uq_township (name, county_id),
                          CONSTRAINT fk_township_county FOREIGN KEY (county_id) REFERENCES county(county_id)
) ENGINE=InnoDB;

-- Roles & Users
CREATE TABLE role (
                      role_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
                      name VARCHAR(40) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE user (
                      user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                      username VARCHAR(60) NOT NULL UNIQUE,
                      email VARCHAR(120) UNIQUE,
                      phone VARCHAR(32) UNIQUE,
                      password_hash VARCHAR(255) NOT NULL,
                      role_id SMALLINT NOT NULL,
                      status ENUM('ACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id)
) ENGINE=InnoDB;

-- Branches
CREATE TABLE branch (
                        branch_id INT PRIMARY KEY AUTO_INCREMENT,
                        code VARCHAR(40) NOT NULL UNIQUE,
                        name VARCHAR(120) NOT NULL,
                        owner_user_id BIGINT NOT NULL,
                        phone VARCHAR(32),
                        email VARCHAR(120),
                        address VARCHAR(255),
                        township_id INT,
                        latitude DECIMAL(9,6),
                        longitude DECIMAL(9,6),
                        active TINYINT(1) DEFAULT 1,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_branch_owner FOREIGN KEY (owner_user_id) REFERENCES user(user_id),
                        CONSTRAINT fk_branch_township FOREIGN KEY (township_id) REFERENCES township(township_id)
) ENGINE=InnoDB;

CREATE TABLE branch_staff (
                              branch_id INT NOT NULL,
                              user_id BIGINT NOT NULL,
                              PRIMARY KEY (branch_id, user_id),
                              FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE,
                              FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Customer profiles, loyalty, tiers
CREATE TABLE customer_profile (
                                  customer_id BIGINT PRIMARY KEY,
                                  full_name VARCHAR(140) NOT NULL,
                                  street VARCHAR(255),
                                  township_id INT,
                                  city VARCHAR(120),
                                  country_id SMALLINT,
                                  loyalty_points INT DEFAULT 0,
                                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                  FOREIGN KEY (customer_id) REFERENCES user(user_id) ON DELETE CASCADE,
                                  FOREIGN KEY (township_id) REFERENCES township(township_id),
                                  FOREIGN KEY (country_id) REFERENCES country(country_id)
) ENGINE=InnoDB;

CREATE TABLE loyalty_tier (
                              tier_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
                              code VARCHAR(40) NOT NULL UNIQUE,
                              name VARCHAR(60) NOT NULL,
                              min_points INT DEFAULT 0,
                              multiplier DECIMAL(6,3) DEFAULT 1.000,
                              benefits VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE customer_tier (
                               customer_id BIGINT PRIMARY KEY,
                               tier_id SMALLINT NOT NULL,
                               updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (customer_id) REFERENCES customer_profile(customer_id) ON DELETE CASCADE,
                               FOREIGN KEY (tier_id) REFERENCES loyalty_tier(tier_id)
) ENGINE=InnoDB;

CREATE TABLE loyalty_ledger (
                                ledger_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                customer_id BIGINT NOT NULL,
                                delta INT NOT NULL,
                                reason VARCHAR(255) NOT NULL,
                                order_id BIGINT,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (customer_id) REFERENCES customer_profile(customer_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Catalog, price list
CREATE TABLE service_type (
                              service_type_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
                              code VARCHAR(40) NOT NULL UNIQUE,
                              name VARCHAR(100) NOT NULL,
                              description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE category (
                          category_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
                          code VARCHAR(40) NOT NULL UNIQUE,
                          name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE price_list (
                            price_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            branch_id INT NOT NULL,
                            service_type_id SMALLINT NOT NULL,
                            category_id SMALLINT NOT NULL,
                            currency CHAR(3) NOT NULL,
                            unit_price DECIMAL(12,2) NOT NULL,
                            active TINYINT(1) DEFAULT 1,
                            UNIQUE KEY uq_price_active (branch_id, service_type_id, category_id, active),
                            FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE,
                            FOREIGN KEY (service_type_id) REFERENCES service_type(service_type_id),
                            FOREIGN KEY (category_id) REFERENCES category(category_id),
                            FOREIGN KEY (currency) REFERENCES currency(code)
) ENGINE=InnoDB;

-- Orders & items
CREATE TABLE orders (
                        order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                        order_no VARCHAR(40) NOT NULL UNIQUE,
                        branch_id INT NOT NULL,
                        customer_id BIGINT NOT NULL,
                        service_type_id SMALLINT,
                        placed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        pickup_at DATETIME,
                        delivery_due_at DATETIME,
                        street VARCHAR(255),
                        township_id INT,
                        city VARCHAR(120),
                        country_id SMALLINT,
                        assigned_driver_id BIGINT,
                        currency CHAR(3) NOT NULL,
                        note VARCHAR(255),
                        remark VARCHAR(255),
                        status ENUM('PENDING','RECEIVED','PROCESSING','READY','OUT_FOR_DELIVERY','COMPLETED','CANCELLED') DEFAULT 'PENDING',
                        subtotal DECIMAL(12,2) DEFAULT 0,
                        delivery_fee DECIMAL(12,2) DEFAULT 0,
                        discount DECIMAL(12,2) DEFAULT 0,
                        total DECIMAL(12,2) DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
                        FOREIGN KEY (customer_id) REFERENCES user(user_id),
                        FOREIGN KEY (assigned_driver_id) REFERENCES user(user_id),
                        FOREIGN KEY (service_type_id) REFERENCES service_type(service_type_id),
                        FOREIGN KEY (township_id) REFERENCES township(township_id),
                        FOREIGN KEY (country_id) REFERENCES country(country_id),
                        FOREIGN KEY (currency) REFERENCES currency(code)
) ENGINE=InnoDB;

CREATE TABLE order_item (
                            order_id BIGINT NOT NULL,
                            category_id SMALLINT NOT NULL,
                            quantity INT NOT NULL,
                            unit_price DECIMAL(12,2) NOT NULL,
                            line_total DECIMAL(12,2) AS (quantity * unit_price) STORED,
                            PRIMARY KEY (order_id, category_id),
                            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                            FOREIGN KEY (category_id) REFERENCES category(category_id)
) ENGINE=InnoDB;

-- Delivery & driver tracking
CREATE TABLE delivery (
                          delivery_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          order_id BIGINT NOT NULL,
                          branch_id INT NOT NULL,
                          driver_id BIGINT,
                          scheduled_pickup_at DATETIME,
                          picked_up_at DATETIME,
                          out_for_delivery_at DATETIME,
                          delivered_at DATETIME,
                          status ENUM('PENDING','PICKED_UP','IN_TRANSIT','DELIVERED','FAILED') DEFAULT 'PENDING',
                          note VARCHAR(255),
                          FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                          FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
                          FOREIGN KEY (driver_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

CREATE TABLE driver_location (
                                 location_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                 driver_id BIGINT NOT NULL,
                                 latitude DECIMAL(9,6) NOT NULL,
                                 longitude DECIMAL(9,6) NOT NULL,
                                 recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                 FOREIGN KEY (driver_id) REFERENCES user(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Payments
CREATE TABLE payment_provider (
                                  provider_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
                                  code VARCHAR(40) NOT NULL UNIQUE,
                                  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE payment_method (
                                payment_method_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                customer_id BIGINT,
                                provider_id SMALLINT NOT NULL,
                                mpesa_msisdn VARCHAR(20),
                                stripe_customer_id VARCHAR(100),
                                stripe_pm_id VARCHAR(100),
                                label VARCHAR(100),
                                active TINYINT(1) DEFAULT 1,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (customer_id) REFERENCES user(user_id) ON DELETE SET NULL,
                                FOREIGN KEY (provider_id) REFERENCES payment_provider(provider_id)
) ENGINE=InnoDB;

CREATE TABLE payment_config (
                                payment_config_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                branch_id INT NOT NULL,
                                provider_id SMALLINT NOT NULL,
                                mpesa_short_code VARCHAR(20),
                                mpesa_party_b VARCHAR(20),
                                mpesa_pass_key VARCHAR(120),
                                stripe_acct_id VARCHAR(100),
                                currency CHAR(3) NOT NULL,
                                active TINYINT(1) DEFAULT 1,
                                FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE,
                                FOREIGN KEY (provider_id) REFERENCES payment_provider(provider_id),
                                FOREIGN KEY (currency) REFERENCES currency(code)
) ENGINE=InnoDB;

CREATE TABLE payment (
                         payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                         order_id BIGINT NOT NULL,
                         provider_id SMALLINT NOT NULL,
                         payment_method_id BIGINT,
                         amount DECIMAL(12,2) NOT NULL,
                         currency CHAR(3) NOT NULL,
                         status ENUM('PENDING','AUTHORIZED','CAPTURED','FAILED','REFUNDED','CANCELLED') DEFAULT 'PENDING',
                         mpesa_checkout_request_id VARCHAR(100),
                         mpesa_merchant_request_id VARCHAR(100),
                         mpesa_receipt_number VARCHAR(60),
                         stripe_payment_intent_id VARCHAR(100),
                         stripe_charge_id VARCHAR(100),
                         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                         FOREIGN KEY (provider_id) REFERENCES payment_provider(provider_id),
                         FOREIGN KEY (payment_method_id) REFERENCES payment_method(payment_method_id),
                         FOREIGN KEY (currency) REFERENCES currency(code)
) ENGINE=InnoDB;

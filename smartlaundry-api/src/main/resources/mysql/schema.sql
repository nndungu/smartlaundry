-- ===============================
-- 1. Roles
-- ===============================
CREATE TABLE role (
                      id SMALLINT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(50) NOT NULL UNIQUE
);

-- ===============================
-- 2. Users
-- ===============================
CREATE TABLE app_user (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          full_name VARCHAR(100) NOT NULL,
                          email VARCHAR(100) NOT NULL UNIQUE,
                          phone VARCHAR(20),
                          password_hash VARCHAR(255) NOT NULL,
                          role_id SMALLINT NOT NULL,
                          is_active BOOLEAN DEFAULT TRUE,
                          FOREIGN KEY (role_id) REFERENCES role(id)
);

-- ===============================
-- 3. County
-- ===============================
CREATE TABLE county (
                        id SMALLINT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(100) NOT NULL
);

-- ===============================
-- 4. Township
-- ===============================
CREATE TABLE township (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          county_id SMALLINT NOT NULL,
                          FOREIGN KEY (county_id) REFERENCES county(id)
);

-- ===============================
-- 5. Branch
-- ===============================
CREATE TABLE branch (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        township_id INT NOT NULL,
                        owner_user_id BIGINT NOT NULL,
                        FOREIGN KEY (township_id) REFERENCES township(id),
                        FOREIGN KEY (owner_user_id) REFERENCES app_user(id)
);

-- ===============================
-- 6. Branch Staff
-- ===============================
CREATE TABLE branch_staff (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              branch_id INT NOT NULL,
                              user_id BIGINT NOT NULL,
                              FOREIGN KEY (branch_id) REFERENCES branch(id),
                              FOREIGN KEY (user_id) REFERENCES app_user(id)
);

-- ===============================
-- 7. Service Type
-- ===============================
CREATE TABLE service_type (
                              id SMALLINT AUTO_INCREMENT PRIMARY KEY,
                              name VARCHAR(50) NOT NULL
);

-- ===============================
-- 8. Category
-- ===============================
CREATE TABLE category (
                          id SMALLINT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(50) NOT NULL
);

-- ===============================
-- 9. Currency
-- ===============================
CREATE TABLE currency (
                          code CHAR(3) PRIMARY KEY,
                          name VARCHAR(50) NOT NULL
);

-- ===============================
-- 10. Price List
-- ===============================
CREATE TABLE price_list (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            branch_id INT NOT NULL,
                            service_type_id SMALLINT NOT NULL,
                            category_id SMALLINT NOT NULL,
                            price DECIMAL(10,2) NOT NULL,
                            currency CHAR(3) NOT NULL,
                            FOREIGN KEY (branch_id) REFERENCES branch(id),
                            FOREIGN KEY (service_type_id) REFERENCES service_type(id),
                            FOREIGN KEY (category_id) REFERENCES category(id),
                            FOREIGN KEY (currency) REFERENCES currency(code)
);

-- ===============================
-- 11. Orders
-- ===============================
CREATE TABLE orders (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        customer_id BIGINT NOT NULL,
                        branch_id INT NOT NULL,
                        status VARCHAR(20) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (customer_id) REFERENCES app_user(id),
                        FOREIGN KEY (branch_id) REFERENCES branch(id)
);

-- ===============================
-- 12. Order Items
-- ===============================
CREATE TABLE order_items (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             order_id BIGINT NOT NULL,
                             price_list_id BIGINT NOT NULL,
                             quantity INT NOT NULL,
                             FOREIGN KEY (order_id) REFERENCES orders(id),
                             FOREIGN KEY (price_list_id) REFERENCES price_list(id)
);

-- ===============================
-- 13. Customer Profile
-- ===============================
CREATE TABLE customer_profile (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  user_id BIGINT NOT NULL,
                                  loyalty_points INT DEFAULT 0,
                                  FOREIGN KEY (user_id) REFERENCES app_user(id)
);

-- ===============================
-- 14. Loyalty Tier
-- ===============================
CREATE TABLE loyalty_tier (
                              id SMALLINT AUTO_INCREMENT PRIMARY KEY,
                              name VARCHAR(50) NOT NULL,
                              min_points INT NOT NULL
);

-- ===============================
-- 15. Customer Tier
-- ===============================
CREATE TABLE customer_tier (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               customer_id BIGINT NOT NULL,
                               tier_id SMALLINT NOT NULL,
                               FOREIGN KEY (customer_id) REFERENCES customer_profile(id),
                               FOREIGN KEY (tier_id) REFERENCES loyalty_tier(id)
);

-- ===============================
-- 16. Loyalty Ledger
-- ===============================
CREATE TABLE loyalty_ledger (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                customer_id BIGINT NOT NULL,
                                points INT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (customer_id) REFERENCES customer_profile(id)
);

-- ===============================
-- 17. Delivery
-- ===============================
CREATE TABLE delivery (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          order_id BIGINT NOT NULL,
                          driver_id BIGINT NOT NULL,
                          status VARCHAR(20) NOT NULL,
                          FOREIGN KEY (order_id) REFERENCES orders(id),
                          FOREIGN KEY (driver_id) REFERENCES app_user(id)
);

-- ===============================
-- 18. Driver Location
-- ===============================
CREATE TABLE driver_location (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 driver_id BIGINT NOT NULL,
                                 latitude DECIMAL(10,8) NOT NULL,
                                 longitude DECIMAL(11,8) NOT NULL,
                                 recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 FOREIGN KEY (driver_id) REFERENCES app_user(id)
);

-- ===============================
-- 19. Payment Provider
-- ===============================
CREATE TABLE payment_provider (
                                  id SMALLINT AUTO_INCREMENT PRIMARY KEY,
                                  name VARCHAR(50) NOT NULL
);

-- ===============================
-- 20. Payment Method
-- ===============================
CREATE TABLE payment_method (
                                id SMALLINT AUTO_INCREMENT PRIMARY KEY,
                                provider_id SMALLINT NOT NULL,
                                name VARCHAR(50) NOT NULL,
                                FOREIGN KEY (provider_id) REFERENCES payment_provider(id)
);

-- ===============================
-- 21. Payment
-- ===============================
CREATE TABLE payment (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         order_id BIGINT NOT NULL,
                         method_id SMALLINT NOT NULL,
                         amount DECIMAL(10,2) NOT NULL,
                         paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (order_id) REFERENCES orders(id),
                         FOREIGN KEY (method_id) REFERENCES payment_method(id)
);

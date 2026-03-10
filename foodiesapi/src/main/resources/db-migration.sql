-- Migration script for Restaurant Owner Role and RBAC

-- 1. Add role column to users table
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'CUSTOMER';

-- 2. Create restaurants table
CREATE TABLE restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    phone_number VARCHAR(20),
    owner_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- 3. Add restaurant_id to foods table
-- Note: Assuming the table name is 'foods' based on @Table(name = "foods") in FoodEntity
ALTER TABLE foods ADD COLUMN restaurant_id BIGINT;
ALTER TABLE foods ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);

-- 4. Add restaurant_id to orders table
-- Note: Assuming the table name is 'orders' based on @Table(name = "orders") in OrderEntity
ALTER TABLE orders ADD COLUMN restaurant_id BIGINT;
ALTER TABLE orders ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);

-- 5. Set existing users as CUSTOMER if not already done by default
UPDATE users SET role = 'CUSTOMER' WHERE role IS NULL;

-- 6. Optional: Create an admin user if needed (example)
-- INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@example.com', '$2a$10$xyz...', 'ADMIN');

CREATE DATABASE IF NOT EXISTS ecommerce;
CREATE DATABASE IF NOT EXISTS ecommerce_test;

-- Grant all privileges on both databases to the mysql-user
GRANT ALL PRIVILEGES ON ecommerce.* TO 'mysql-user'@'%';
GRANT ALL PRIVILEGES ON ecommerce_test.* TO 'mysql-user'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

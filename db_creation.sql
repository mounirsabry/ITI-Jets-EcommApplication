DROP DATABASE IF EXISTS project2_ecomm_db;

CREATE DATABASE project2_ecomm_db
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

USE project2_ecomm_db;

CREATE TABLE AdminUser
(
	user_ID INT AUTO_INCREMENT PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	display_name VARCHAR(50) NOT NULL
);

CREATE TABLE NormalUser
(
	user_ID INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

CREATE TABLE Product
(
	product_ID INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    product_desc TEXT NOT NULL,
    product_img_URL VARCHAR(100),
    is_available BOOLEAN DEFAULT(TRUE),
    available_quantity INT NOT NULL,
    added_at DATETIME NOT NULL 
        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UserCart
(
	user_ID INT,
    product_ID INT,
    quantity INT NOT NULL,
    PRIMARY KEY (user_ID, product_ID),
    CONSTRAINT `user_cart_user_ID`
		FOREIGN KEY (user_ID)
		REFERENCES NormalUser(user_ID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
	CONSTRAINT `user_cart_product_ID`
		FOREIGN KEY (product_ID)
		REFERENCES Product(product_ID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
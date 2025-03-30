
CREATE TABLE `Genre` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE
  );

INSERT INTO `Genre` (`name`) VALUES 
  ('Fiction'),
  ('Non-Fiction'),
  ('Self-Help & Personal Development'),
  ('Business & Finance'),
  ('Science & Technology'),
  ('Health & Wellness'),
  ('Education & Academic'),
  ('Biography & Memoir'),
  ('Children’s Books'),
  ('Religion & Spirituality');



CREATE TABLE `User` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `hashPassword` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `address` TEXT,
  `birthDate` DATE,
  `phoneNumber` VARCHAR(20),
  `balance` DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE `Book` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `genreId` BIGINT NOT NULL,
  `publisher` VARCHAR(255),
  `publicationDate` DATE,
  `isbn` VARCHAR(20) UNIQUE,
  `description` TEXT,
  `overview` VARCHAR(500),
  `numberOfPages` INT,
  `language` VARCHAR(50),
  `isAvailable` BOOLEAN DEFAULT TRUE,
  `stock` INT DEFAULT 0,
  `price` DECIMAL(10,2) NOT NULL,
  `discountPercentage` DECIMAL(5,2) DEFAULT 0.00,
  `addedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE RESTRICT
);

CREATE TABLE `BookImage` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `bookId` BIGINT NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `isMain` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE
);

CREATE TABLE `UserInterest` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `userId` BIGINT NOT NULL,
  `genreId` BIGINT NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_genre` (`userId`, `genreId`)
);

CREATE TABLE `Wishlist` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `userId` BIGINT NOT NULL,
  `bookId` BIGINT NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_wishlist_item` (`userId`, `bookId`)
);

CREATE TABLE `Order` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `userId` BIGINT NOT NULL,
  `orderDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `address` TEXT NOT NULL,
  `status` ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  `paymentMethod` VARCHAR(50) NOT NULL,
  `shippingCost` DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT
);

CREATE TABLE `CartItem` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `userId` BIGINT NOT NULL,
  `bookId` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_cart_item` (`userId`, `bookId`)
);

CREATE TABLE `OrderItem` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `orderId` BIGINT NOT NULL,
  `bookId` BIGINT NOT NULL,
  `quantity` BIGINT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `discountPercentage` DECIMAL(5,2) DEFAULT 0.00,
  FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT
);
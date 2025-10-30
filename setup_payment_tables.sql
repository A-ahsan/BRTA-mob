-- SQL script to add payment tables for BRTA driving license system
-- Run this in phpMyAdmin (database: brta_mob)

-- Create license_payments table for driving license fee payments
CREATE TABLE IF NOT EXISTS `license_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 1,
  `application_id` int(11) NOT NULL,
  `tran_id` varchar(255) NOT NULL UNIQUE,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'BDT',
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `license_type` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `payment_method` varchar(50) DEFAULT 'sslcommerz',
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `application_id` (`application_id`),
  KEY `tran_id` (`tran_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add payment columns to driving_license_applications table (based on your existing structure)
ALTER TABLE `driving_license_applications` 
ADD COLUMN `payment_status` enum('pending','completed','failed','cancelled') DEFAULT 'pending' AFTER `face_verification_completed_at`,
ADD COLUMN `payment_completed_at` timestamp NULL DEFAULT NULL AFTER `payment_status`,
ADD COLUMN `license_fee` decimal(10,2) DEFAULT 1500.00 AFTER `payment_completed_at`;

-- Create license_fees table for different license types and costs
CREATE TABLE IF NOT EXISTS `license_fees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `license_type` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_vehicle_type` (`license_type`, `vehicle_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default license fees (you can modify these amounts)
INSERT INTO `license_fees` (`license_type`, `vehicle_type`, `amount`, `description`) VALUES
('professional', 'bike', 2000.00, 'Professional Motorcycle License Fee'),
('professional', 'car', 2500.00, 'Professional Car License Fee'),  
('professional', 'both', 3000.00, 'Professional Both Vehicle License Fee'),
('non professional', 'bike', 1500.00, 'Non-Professional Motorcycle License Fee'),
('non professional', 'car', 2000.00, 'Non-Professional Car License Fee'),
('non professional', 'both', 2500.00, 'Non-Professional Both Vehicle License Fee')
ON DUPLICATE KEY UPDATE 
amount = VALUES(amount), 
description = VALUES(description);

-- Create notifications table for payment notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 1,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'general',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `type` (`type`),
  KEY `is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Show table structures to verify
DESCRIBE `driving_license_applications`;
SELECT 'License Payments Table:' as info;
DESCRIBE `license_payments`;
SELECT 'License Fees Table:' as info;  
DESCRIBE `license_fees`;
SELECT 'Sample License Fees:' as info;
SELECT * FROM `license_fees`;
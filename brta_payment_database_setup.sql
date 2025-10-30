-- =====================================================
-- BRTA Payment System Database Setup
-- Database: brta_mob
-- Run this in phpMyAdmin SQL tab or MySQL console
-- =====================================================

-- 1. CREATE LICENSE PAYMENTS TABLE
-- This table tracks all payment transactions for driving license fees
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

-- 2. ADD PAYMENT COLUMNS TO EXISTING DRIVING_LICENSE_APPLICATIONS TABLE
-- Add payment status tracking to your existing applications table
ALTER TABLE `driving_license_applications` 
ADD COLUMN IF NOT EXISTS `payment_status` enum('pending','completed','failed','cancelled') DEFAULT 'pending' AFTER `face_verification_completed_at`;

ALTER TABLE `driving_license_applications` 
ADD COLUMN IF NOT EXISTS `payment_completed_at` timestamp NULL DEFAULT NULL AFTER `payment_status`;

ALTER TABLE `driving_license_applications` 
ADD COLUMN IF NOT EXISTS `license_fee` decimal(10,2) DEFAULT 1500.00 AFTER `payment_completed_at`;

-- 3. CREATE LICENSE FEES TABLE
-- This table stores the fee structure for different license types
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

-- 4. INSERT DEFAULT LICENSE FEES
-- You can modify these amounts as needed
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

-- 5. CREATE NOTIFICATIONS TABLE
-- For storing payment and system notifications
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

-- 6. VERIFY SETUP - Show table structures and sample data
SELECT '=== DRIVING LICENSE APPLICATIONS TABLE STRUCTURE ===' as info;
DESCRIBE `driving_license_applications`;

SELECT '=== LICENSE PAYMENTS TABLE STRUCTURE ===' as info;
DESCRIBE `license_payments`;

SELECT '=== LICENSE FEES TABLE STRUCTURE ===' as info;
DESCRIBE `license_fees`;

SELECT '=== NOTIFICATIONS TABLE STRUCTURE ===' as info;
DESCRIBE `notifications`;

SELECT '=== CURRENT LICENSE FEES ===' as info;
SELECT 
    license_type as 'License Type',
    vehicle_type as 'Vehicle Type', 
    CONCAT('৳', FORMAT(amount, 2)) as 'Fee Amount',
    description as 'Description',
    CASE WHEN is_active = 1 THEN 'Active' ELSE 'Inactive' END as 'Status'
FROM `license_fees` 
ORDER BY license_type, vehicle_type;

-- 7. TEST QUERIES (Optional - for verification)
-- Uncomment these lines to test the setup

-- SELECT '=== TEST: Sample License Application ===' as info;
-- SELECT 
--     id,
--     nid_number,
--     license_type,
--     vehicle_type,
--     status,
--     face_verification_status,
--     payment_status,
--     created_at
-- FROM driving_license_applications 
-- LIMIT 5;

-- SELECT '=== TEST: Payment Records ===' as info;
-- SELECT 
--     COUNT(*) as total_payments,
--     SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
--     SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
--     SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments
-- FROM license_payments;

SELECT '=== BRTA PAYMENT SYSTEM SETUP COMPLETE ===' as info;
SELECT 'Tables created: license_payments, license_fees, notifications' as status;
SELECT 'Payment columns added to driving_license_applications' as status;
SELECT 'Default license fees inserted' as status;
SELECT 'System ready for SSL Commerz integration' as status;
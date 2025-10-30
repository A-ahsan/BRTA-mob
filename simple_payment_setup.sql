-- =====================================================
-- SIMPLIFIED BRTA Payment System Database Setup
-- Only adds necessary tables to your existing brta_mob database
-- =====================================================

-- 1. CREATE MINIMAL LICENSE PAYMENTS TABLE
-- This tracks payment transactions for driving license fees
CREATE TABLE IF NOT EXISTS `license_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 1,
  `application_id` int(11) NOT NULL,
  `tran_id` varchar(255) NOT NULL UNIQUE,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `license_type` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `application_id` (`application_id`),
  KEY `tran_id` (`tran_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. ADD PAYMENT STATUS TO YOUR EXISTING driving_license_applications TABLE
-- Add only essential payment columns
ALTER TABLE `driving_license_applications` 
ADD COLUMN `payment_status` enum('pending','completed','failed','cancelled') DEFAULT 'pending';

ALTER TABLE `driving_license_applications` 
ADD COLUMN `payment_completed_at` timestamp NULL DEFAULT NULL;

-- 3. CREATE SIMPLE LICENSE FEES TABLE (Optional - for fee management)
CREATE TABLE IF NOT EXISTS `license_fees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `license_type` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_vehicle` (`license_type`, `vehicle_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. INSERT BASIC LICENSE FEES
INSERT INTO `license_fees` (`license_type`, `vehicle_type`, `amount`) VALUES
('professional', 'bike', 2000.00),
('professional', 'car', 2500.00),
('professional', 'both', 3000.00),
('non professional', 'bike', 1500.00),
('non professional', 'car', 2000.00),
('non professional', 'both', 2500.00)
ON DUPLICATE KEY UPDATE amount = VALUES(amount);

-- 5. VERIFY THE SETUP
SELECT 'Tables in your database:' as info;
SHOW TABLES;

SELECT 'driving_license_applications structure:' as info;
DESCRIBE `driving_license_applications`;

SELECT 'license_payments structure:' as info;
DESCRIBE `license_payments`;

SELECT 'Available license fees:' as info;
SELECT 
    license_type as 'License Type',
    vehicle_type as 'Vehicle Type',
    CONCAT('৳', amount) as 'Fee'
FROM `license_fees`;

SELECT 'Setup Complete - Ready for SSL Commerz integration!' as status;
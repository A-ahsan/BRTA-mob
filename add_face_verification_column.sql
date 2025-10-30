-- Add face_verification_completed_at column to driving_license_applications table
-- Run this SQL command in phpMyAdmin or MySQL console

ALTER TABLE `driving_license_applications` 
ADD COLUMN `face_verification_completed_at` TIMESTAMP NULL DEFAULT NULL 
AFTER `face_verification_status`;

-- Verify the column was added
DESCRIBE `driving_license_applications`;
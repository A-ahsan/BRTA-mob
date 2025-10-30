-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2025 at 06:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `brta_mob`
--

-- --------------------------------------------------------

--
-- Table structure for table `driving_licenses`
--

CREATE TABLE `driving_licenses` (
  `id` int(11) NOT NULL,
  `license_number` varchar(20) NOT NULL,
  `application_id` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nid_id` int(11) NOT NULL,
  `license_type` enum('motorcycle','car','commercial','professional') NOT NULL,
  `vehicle_type` enum('motorcycle','car','bus','truck','microbus','cng','other') NOT NULL,
  `issue_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `status` enum('active','expired','suspended','revoked') DEFAULT 'active',
  `photo_path` varchar(255) DEFAULT NULL,
  `qr_code_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `driving_licenses`
--

INSERT INTO `driving_licenses` (`id`, `license_number`, `application_id`, `user_id`, `nid_id`, `license_type`, `vehicle_type`, `issue_date`, `expiry_date`, `status`, `photo_path`, `qr_code_path`, `created_at`, `updated_at`) VALUES
(1, 'BD-2025-885770', 'APP-167', 1, 0, '', 'car', '2025-10-18', '2030-10-18', 'active', 'photo_68f31115378d6.jpg', NULL, '2025-10-18 04:08:51', '2025-10-18 04:08:51');

-- --------------------------------------------------------

--
-- Table structure for table `driving_license_applications`
--

CREATE TABLE `driving_license_applications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nid_number` varchar(20) NOT NULL,
  `license_type` varchar(50) NOT NULL,
  `vehicle_type` enum('bike','car','both') NOT NULL,
  `application_date` date NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `face_image` varchar(255) DEFAULT NULL,
  `user_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `face_verification_status` tinyint(1) DEFAULT 0,
  `face_verification_completed_at` timestamp NULL DEFAULT NULL,
  `payment_status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `payment_completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `driving_license_applications`
--

INSERT INTO `driving_license_applications` (`id`, `user_id`, `nid_number`, `license_type`, `vehicle_type`, `application_date`, `status`, `face_image`, `user_photo`, `created_at`, `face_verification_status`, `face_verification_completed_at`, `payment_status`, `payment_completed_at`) VALUES
(167, 1, '7814144619', 'non professional', 'car', '2025-10-18', '', 'face_68f311153716c.jpg', 'photo_68f31115378d6.jpg', '2025-10-18 04:01:25', 1, '2025-10-18 04:08:51', 'completed', '2025-10-18 04:01:59');

-- --------------------------------------------------------

--
-- Table structure for table `license_fees`
--

CREATE TABLE `license_fees` (
  `id` int(11) NOT NULL,
  `license_type` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `license_fees`
--

INSERT INTO `license_fees` (`id`, `license_type`, `vehicle_type`, `amount`) VALUES
(1, 'professional', 'bike', 2000.00),
(2, 'professional', 'car', 2500.00),
(3, 'professional', 'both', 3000.00),
(4, 'non professional', 'bike', 1500.00),
(5, 'non professional', 'car', 2000.00),
(6, 'non professional', 'both', 2500.00);

-- --------------------------------------------------------

--
-- Table structure for table `license_payments`
--

CREATE TABLE `license_payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 1,
  `application_id` int(11) NOT NULL,
  `tran_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `license_type` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `license_payments`
--

INSERT INTO `license_payments` (`id`, `user_id`, `application_id`, `tran_id`, `amount`, `status`, `license_type`, `vehicle_type`, `gateway_transaction_id`, `created_at`) VALUES
(9, 1, 165, 'license_165_1_1760759280', 2000.00, 'completed', 'professional', 'bike', '251018948270iSe4wzqVb2R2tB', '2025-10-18 03:48:00'),
(10, 1, 167, 'license_167_1_1760760107', 2000.00, 'completed', 'non professional', 'car', '2510181001570PZSGcHFLAVkav7', '2025-10-18 04:01:47');

-- --------------------------------------------------------

--
-- Table structure for table `nid_information`
--

CREATE TABLE `nid_information` (
  `nid_number` varchar(20) NOT NULL,
  `name_bn` varchar(100) DEFAULT NULL,
  `name_en` varchar(100) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `blood_group` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nid_information`
--

INSERT INTO `nid_information` (`nid_number`, `name_bn`, `name_en`, `father_name`, `mother_name`, `date_of_birth`, `address`, `gender`, `blood_group`) VALUES
('7814144619', 'alif ahsan', 'alif ahsan', 'kamrul ahsan', 'soheli parvin', '2002-12-04', 'aaa', 'male', 'AB-'),
('7814706961', 'george', 'George Jefferson Dessa', 'Susil Dessa', 'Shila Dessa', '2002-02-18', 'dhaka,dhaka', 'male', 'o+');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` enum('user','admin','traffic-police') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `phone`, `full_name`, `password_hash`, `user_type`, `is_active`, `last_login`, `created_at`) VALUES
(1, 'alif', 'ahsanalif96@gmail.com', '01609900977', 'alif ashan', '$2y$10$aRLV7wy87AjJOSo9blAl4uVwFh0o3S.TV3KV6ueTsvWlRxp6Qsx.S', 'user', 1, NULL, '2025-09-26 12:43:18'),
(2, 'testuser', 'test@user.com', '01712345678', 'Test User', '$2y$10$EsJWFbBguBZZ7SZEG4javuUrgfvVZsZs/nsvcp63VdHTW/aAIZvWK', 'user', 1, NULL, '2025-09-26 19:55:06'),
(3, 'urmi', 'urmi@urmi.com', '01723511954', 'rumana radia', '$2y$10$ywbIH8MJX0CS1hV1vgq1gOT2G8k5mFBsEtYSYkpFoCr.wr4dZW1zW', 'user', 1, NULL, '2025-09-26 19:57:52'),
(4, 'george', 'sujoydessa@gmail.com', '01627409546', 'George Jefferson Dessa', '$2y$10$V4gG/cCUsxh6Akg4.9g9S.53nzlBXqJfZA.jhurYWNRtnXP6wZyGy', 'user', 1, NULL, '2025-10-11 03:40:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `driving_licenses`
--
ALTER TABLE `driving_licenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_number` (`license_number`),
  ADD UNIQUE KEY `idx_license_number` (`license_number`),
  ADD UNIQUE KEY `idx_application_id` (`application_id`),
  ADD KEY `fk_license_user_id` (`user_id`),
  ADD KEY `fk_license_nid_id` (`nid_id`),
  ADD KEY `idx_license_status` (`status`),
  ADD KEY `idx_expiry_date` (`expiry_date`),
  ADD KEY `idx_user_license_status` (`user_id`,`status`);

--
-- Indexes for table `driving_license_applications`
--
ALTER TABLE `driving_license_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `nid_number` (`nid_number`);

--
-- Indexes for table `license_fees`
--
ALTER TABLE `license_fees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_vehicle` (`license_type`,`vehicle_type`);

--
-- Indexes for table `license_payments`
--
ALTER TABLE `license_payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tran_id` (`tran_id`),
  ADD KEY `application_id` (`application_id`);

--
-- Indexes for table `nid_information`
--
ALTER TABLE `nid_information`
  ADD PRIMARY KEY (`nid_number`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `driving_licenses`
--
ALTER TABLE `driving_licenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `driving_license_applications`
--
ALTER TABLE `driving_license_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- AUTO_INCREMENT for table `license_fees`
--
ALTER TABLE `license_fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `license_payments`
--
ALTER TABLE `license_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `driving_license_applications`
--
ALTER TABLE `driving_license_applications`
  ADD CONSTRAINT `driving_license_applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `driving_license_applications_ibfk_2` FOREIGN KEY (`nid_number`) REFERENCES `nid_information` (`nid_number`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

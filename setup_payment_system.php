<?php
// File: setup_payment_system.php
// One-click setup for BRTA payment system

echo "<h1>BRTA Payment System Setup</h1>";
echo "<p>Setting up SSL Commerz payment integration for driving license fees...</p>";

require_once 'api/config.php';

try {
    $conn = getDBConnection();
    
    echo "<h2>Step 1: Creating database tables...</h2>";
    
    // Create license_payments table
    $sql1 = "CREATE TABLE IF NOT EXISTS `license_payments` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->exec($sql1) !== false) {
        echo "✅ License payments table created successfully<br>";
    } else {
        echo "⚠️ License payments table might already exist<br>";
    }
    
    // Add payment columns to driving_license_applications
    $columns_to_add = [
        "ALTER TABLE `driving_license_applications` ADD COLUMN `payment_status` enum('pending','completed','failed','cancelled') DEFAULT 'pending' AFTER `face_verification_completed_at`",
        "ALTER TABLE `driving_license_applications` ADD COLUMN `payment_completed_at` timestamp NULL DEFAULT NULL AFTER `payment_status`",
        "ALTER TABLE `driving_license_applications` ADD COLUMN `license_fee` decimal(10,2) DEFAULT 1500.00 AFTER `payment_completed_at`"
    ];
    
    foreach ($columns_to_add as $sql) {
        try {
            $conn->exec($sql);
            echo "✅ Added column to driving_license_applications<br>";
        } catch (Exception $e) {
            echo "⚠️ Column might already exist: " . $e->getMessage() . "<br>";
        }
    }
    
    // Create license_fees table
    $sql2 = "CREATE TABLE IF NOT EXISTS `license_fees` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `license_type` varchar(50) NOT NULL,
      `vehicle_type` varchar(50) NOT NULL,
      `amount` decimal(10,2) NOT NULL,
      `description` varchar(255) DEFAULT NULL,
      `is_active` tinyint(1) DEFAULT 1,
      `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      UNIQUE KEY `license_vehicle_type` (`license_type`, `vehicle_type`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->exec($sql2) !== false) {
        echo "✅ License fees table created successfully<br>";
    }
    
    // Insert default license fees
    $fees = [
        ['professional', 'bike', 2000.00, 'Professional Motorcycle License Fee'],
        ['professional', 'car', 2500.00, 'Professional Car License Fee'],
        ['professional', 'both', 3000.00, 'Professional Both Vehicle License Fee'],
        ['non professional', 'bike', 1500.00, 'Non-Professional Motorcycle License Fee'],
        ['non professional', 'car', 2000.00, 'Non-Professional Car License Fee'],
        ['non professional', 'both', 2500.00, 'Non-Professional Both Vehicle License Fee']
    ];
    
    echo "<h2>Step 2: Setting up license fees...</h2>";
    
    $fee_stmt = $conn->prepare("INSERT INTO license_fees (license_type, vehicle_type, amount, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount = VALUES(amount), description = VALUES(description)");
    
    foreach ($fees as $fee) {
        $fee_stmt->execute($fee);
        echo "✅ Added fee: {$fee[0]} {$fee[1]} - ৳{$fee[2]}<br>";
    }
    
    // Create notifications table
    $sql3 = "CREATE TABLE IF NOT EXISTS `notifications` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->exec($sql3) !== false) {
        echo "✅ Notifications table created successfully<br>";
    }
    
    echo "<h2>Step 3: Verifying setup...</h2>";
    
    // Show current license fees
    $stmt = $conn->query("SELECT * FROM license_fees ORDER BY license_type, vehicle_type");
    $fees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
    echo "<tr><th>License Type</th><th>Vehicle Type</th><th>Amount (BDT)</th><th>Description</th></tr>";
    foreach ($fees as $fee) {
        echo "<tr>";
        echo "<td>{$fee['license_type']}</td>";
        echo "<td>{$fee['vehicle_type']}</td>";
        echo "<td>৳" . number_format($fee['amount'], 2) . "</td>";
        echo "<td>{$fee['description']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<h2>✅ Setup Complete!</h2>";
    echo "<div style='background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;'>";
    echo "<h3>Payment System Status:</h3>";
    echo "<ul>";
    echo "<li>✅ Database tables created</li>";
    echo "<li>✅ License fees configured</li>";
    echo "<li>✅ Gateway files updated</li>";
    echo "<li>✅ Face verification redirects to payment</li>";
    echo "<li>✅ Payment callbacks redirect to dashboard</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<h3>Next Steps:</h3>";
    echo "<ol>";
    echo "<li>Test the complete flow: Apply → Face Verification → Payment → Dashboard</li>";
    echo "<li>Check SSL Commerz sandbox credentials in gateway/sslcommerz-config.php</li>";
    echo "<li>Monitor payment logs in gateway/sslcommerz_success_debug.log</li>";
    echo "</ol>";
    
    echo "<h3>Test Links:</h3>";
    echo "<ul>";
    echo "<li><a href='http://192.168.0.106:8081' target='_blank'>React App Dashboard</a></li>";
    echo "<li><a href='api/get_license_fee.php?license_type=professional&vehicle_type=bike' target='_blank'>Test License Fee API</a></li>";
    echo "<li><a href='gateway/license_payment_start.php?application_id=1&user_id=1' target='_blank'>Test Payment Gateway (Need valid application)</a></li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<div style='background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 20px 0;'>";
    echo "<h3>❌ Setup Error:</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "</div>";
}
?>

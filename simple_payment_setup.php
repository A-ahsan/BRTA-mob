<?php
// Simple Payment Setup for BRTA (works with your existing 3 tables)
echo "<h1>BRTA Simple Payment Setup</h1>";
echo "<p>Adding only necessary payment tables to your existing database...</p>";

require_once 'api/config.php';

try {
    $conn = getDBConnection();
    
    echo "<h2>Current Database Tables:</h2>";
    $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>✅ $table</li>";
    }
    echo "</ul>";
    
    echo "<h2>Step 1: Creating license_payments table...</h2>";
    
    $sql1 = "CREATE TABLE IF NOT EXISTS `license_payments` (
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
      KEY `application_id` (`application_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->exec($sql1) !== false) {
        echo "✅ license_payments table created<br>";
    }
    
    echo "<h2>Step 2: Adding payment columns to driving_license_applications...</h2>";
    
    try {
        $conn->exec("ALTER TABLE `driving_license_applications` ADD COLUMN `payment_status` enum('pending','completed','failed','cancelled') DEFAULT 'pending'");
        echo "✅ Added payment_status column<br>";
    } catch (Exception $e) {
        echo "⚠️ payment_status column already exists<br>";
    }
    
    try {
        $conn->exec("ALTER TABLE `driving_license_applications` ADD COLUMN `payment_completed_at` timestamp NULL DEFAULT NULL");
        echo "✅ Added payment_completed_at column<br>";
    } catch (Exception $e) {
        echo "⚠️ payment_completed_at column already exists<br>";
    }
    
    echo "<h2>Step 3: Creating license_fees table...</h2>";
    
    $sql2 = "CREATE TABLE IF NOT EXISTS `license_fees` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `license_type` varchar(50) NOT NULL,
      `vehicle_type` varchar(50) NOT NULL,
      `amount` decimal(10,2) NOT NULL,
      PRIMARY KEY (`id`),
      UNIQUE KEY `license_vehicle` (`license_type`, `vehicle_type`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->exec($sql2) !== false) {
        echo "✅ license_fees table created<br>";
    }
    
    echo "<h2>Step 4: Setting up license fees...</h2>";
    
    $fees = [
        ['professional', 'bike', 2000.00],
        ['professional', 'car', 2500.00],
        ['professional', 'both', 3000.00],
        ['non professional', 'bike', 1500.00],
        ['non professional', 'car', 2000.00],
        ['non professional', 'both', 2500.00]
    ];
    
    $fee_stmt = $conn->prepare("INSERT INTO license_fees (license_type, vehicle_type, amount) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE amount = VALUES(amount)");
    
    foreach ($fees as $fee) {
        $fee_stmt->execute($fee);
        echo "✅ {$fee[0]} {$fee[1]} - ৳{$fee[2]}<br>";
    }
    
    echo "<h2>✅ Simple Setup Complete!</h2>";
    
    echo "<div style='background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;'>";
    echo "<h3>Your Database Now Has:</h3>";
    echo "<ul>";
    echo "<li>✅ driving_license_applications (with payment columns)</li>";
    echo "<li>✅ license_payments (tracks payments)</li>";
    echo "<li>✅ license_fees (fee structure)</li>";
    echo "<li>✅ nid_information (your existing table)</li>";
    echo "<li>✅ users (your existing table)</li>";
    echo "</ul>";
    echo "</div>";
    
    // Show updated tables
    echo "<h3>Updated Database Structure:</h3>";
    $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>$table</li>";
    }
    echo "</ul>";
    
    echo "<h3>License Fees:</h3>";
    $fees = $conn->query("SELECT * FROM license_fees")->fetchAll(PDO::FETCH_ASSOC);
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>License Type</th><th>Vehicle Type</th><th>Amount</th></tr>";
    foreach ($fees as $fee) {
        echo "<tr><td>{$fee['license_type']}</td><td>{$fee['vehicle_type']}</td><td>৳{$fee['amount']}</td></tr>";
    }
    echo "</table>";
    
    echo "<h3>✅ Ready for Payment Integration!</h3>";
    echo "<p>You can now test: Apply License → Face Verification → Payment → Dashboard</p>";
    
} catch (Exception $e) {
    echo "<div style='background: #f8d7da; padding: 15px; border-radius: 8px;'>";
    echo "<h3>❌ Error:</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "</div>";
}
?>
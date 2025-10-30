<?php
// File: add_missing_column.php
// Run this script once to add the missing face_verification_completed_at column

require_once 'brta/config/database.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Check if column exists
    $result = $conn->query("SHOW COLUMNS FROM driving_license_applications LIKE 'face_verification_completed_at'");
    
    if ($result->num_rows == 0) {
        // Column doesn't exist, add it
        $sql = "ALTER TABLE `driving_license_applications` 
                ADD COLUMN `face_verification_completed_at` TIMESTAMP NULL DEFAULT NULL 
                AFTER `face_verification_status`";
        
        if ($conn->query($sql) === TRUE) {
            echo "Column 'face_verification_completed_at' added successfully.\n";
        } else {
            echo "Error adding column: " . $conn->error . "\n";
        }
    } else {
        echo "Column 'face_verification_completed_at' already exists.\n";
    }
    
    // Show current table structure
    echo "\nCurrent table structure:\n";
    $result = $conn->query("DESCRIBE driving_license_applications");
    while ($row = $result->fetch_assoc()) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
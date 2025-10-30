<?php
// File: setup_driving_licenses_table.php
// Script to create the driving_licenses table

require_once 'api/config.php';

try {
    $conn = getDBConnection();
    
    echo "Creating driving_licenses table...\n";
    
    // Read the SQL file
    $sql = file_get_contents('database/driving_licenses_table.sql');
    
    // Execute the SQL
    $conn->exec($sql);
    
    echo "✓ Successfully created driving_licenses table!\n";
    echo "\nTable structure:\n";
    echo "- license_number (unique identifier)\n";
    echo "- application_id (links to application)\n";
    echo "- user_id, nid_id (foreign keys)\n";
    echo "- license_type, vehicle_type\n";
    echo "- issue_date, expiry_date\n";
    echo "- status (active/expired/suspended/revoked)\n";
    echo "- photo_path, qr_code_path\n";
    echo "\nThe table is ready to use!\n";
    
} catch (PDOException $e) {
    echo "✗ Error creating table: " . $e->getMessage() . "\n";
    exit(1);
}

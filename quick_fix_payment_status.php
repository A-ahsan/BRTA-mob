<?php
// Quick fix: Update payment status for existing applications
require_once 'api/config.php';

try {
    $conn = getDBConnection();
    
    // Update payment_status to 'completed' for applications where payment exists in license_payments table
    $stmt = $conn->query("
        UPDATE driving_license_applications dla
        INNER JOIN license_payments lp ON dla.id = lp.application_id
        SET dla.payment_status = 'completed'
        WHERE lp.status = 'completed' AND dla.payment_status != 'completed'
    ");
    
    $updated = $stmt->rowCount();
    
    echo "✅ Updated $updated application(s) payment status to 'completed'\n\n";
    
    // Show applications that are ready for license generation
    $result = $conn->query("
        SELECT 
            dla.application_id,
            dla.payment_status,
            dla.face_verification_status,
            ni.full_name,
            u.username
        FROM driving_license_applications dla
        JOIN nid_information ni ON dla.nid_id = ni.id
        JOIN users u ON dla.user_id = u.id
        WHERE dla.payment_status = 'completed'
        ORDER BY dla.submitted_at DESC
    ");
    
    $apps = $result->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($apps) > 0) {
        echo "Applications ready for license generation:\n";
        echo "============================================\n";
        foreach ($apps as $app) {
            echo "Application ID: {$app['application_id']}\n";
            echo "Name: {$app['full_name']}\n";
            echo "Username: {$app['username']}\n";
            echo "Payment Status: {$app['payment_status']}\n";
            echo "Face Verification: {$app['face_verification_status']}\n";
            echo "--------------------------------------------\n";
        }
    } else {
        echo "No applications found with completed payment.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

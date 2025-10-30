<?php
require_once 'api/config.php';

$conn = getDBConnection();

echo "Checking driving_license_applications table structure:\n";
echo "========================================================\n";
$result = $conn->query('DESCRIBE driving_license_applications');
while($row = $result->fetch()) {
    echo $row['Field'] . "\n";
}

echo "\n\nChecking license_payments table structure:\n";
echo "========================================================\n";
$result2 = $conn->query('DESCRIBE license_payments');
while($row = $result2->fetch()) {
    echo $row['Field'] . "\n";
}

echo "\n\nCurrent applications data:\n";
echo "========================================================\n";
$apps = $conn->query("
    SELECT 
        id,
        user_id,
        license_type,
        vehicle_type,
        payment_status,
        face_verification_status
    FROM driving_license_applications
    LIMIT 5
");
while($app = $apps->fetch()) {
    echo "ID: {$app['id']}, User: {$app['user_id']}, Payment: {$app['payment_status']}, Face: {$app['face_verification_status']}\n";
}

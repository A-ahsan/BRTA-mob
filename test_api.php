<?php
// Test the get_user_applications API
echo "Testing get_user_applications.php API...\n";
echo "==========================================\n\n";

$url = "http://192.168.0.106/brta_mob/api/get_user_applications.php?user_id=1";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n\n";

if ($response) {
    $data = json_decode($response, true);
    echo "Response:\n";
    print_r($data);
    
    if (isset($data['applications']) && count($data['applications']) > 0) {
        echo "\n\n✅ SUCCESS! Found " . count($data['applications']) . " application(s)\n\n";
        
        foreach ($data['applications'] as $app) {
            echo "Application ID: {$app['application_id']}\n";
            echo "License Type: {$app['license_type']}\n";
            echo "Payment Status: {$app['payment_status']}\n";
            echo "Can Generate License: " . ($app['can_generate_license'] ? 'YES' : 'NO') . "\n";
            echo "-------------------\n";
        }
    } else {
        echo "\n\n❌ No applications found\n";
    }
} else {
    echo "❌ Failed to connect to API\n";
    echo "Make sure XAMPP Apache is running\n";
}

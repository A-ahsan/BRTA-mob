<?php
// File: test_license_apis.php
// Test script to verify the license generation APIs

echo "=== BRTA License Generation API Test ===\n\n";

// Test 1: Check if driving_licenses table exists
echo "Test 1: Checking database table...\n";
require_once 'api/config.php';

try {
    $conn = getDBConnection();
    $stmt = $conn->query("SHOW TABLES LIKE 'driving_licenses'");
    if ($stmt->rowCount() > 0) {
        echo "✓ driving_licenses table exists\n";
        
        // Show table structure
        $columns = $conn->query("DESCRIBE driving_licenses")->fetchAll(PDO::FETCH_ASSOC);
        echo "  Columns: ";
        echo implode(', ', array_column($columns, 'Field')) . "\n";
    } else {
        echo "✗ driving_licenses table NOT found\n";
        echo "  Run: php setup_driving_licenses_table.php\n";
    }
} catch (Exception $e) {
    echo "✗ Database error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Check API endpoints exist
echo "Test 2: Checking API files...\n";

$apiFiles = [
    'api/get_user_applications.php' => 'Get User Applications',
    'api/generate_license.php' => 'Generate License'
];

foreach ($apiFiles as $file => $description) {
    if (file_exists($file)) {
        echo "✓ $description ($file)\n";
    } else {
        echo "✗ $description NOT found ($file)\n";
    }
}

echo "\n";

// Test 3: Check screen files exist
echo "Test 3: Checking screen files...\n";

$screenFiles = [
    'ViewLicenseScreen.js' => 'View License Screen',
    'LicenseCardScreen.js' => 'License Card Screen'
];

foreach ($screenFiles as $file => $description) {
    if (file_exists($file)) {
        echo "✓ $description ($file)\n";
    } else {
        echo "✗ $description NOT found ($file)\n";
    }
}

echo "\n";

// Test 4: Check for eligible applications
echo "Test 4: Checking for eligible applications...\n";

try {
    $stmt = $conn->query("
        SELECT 
            application_id,
            payment_status,
            face_verification_status,
            (SELECT COUNT(*) FROM driving_licenses WHERE application_id = dla.application_id) as has_license
        FROM driving_license_applications dla
        WHERE payment_status = 'completed' 
        AND face_verification_status = 'completed'
        LIMIT 5
    ");
    
    $eligible = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($eligible) > 0) {
        echo "✓ Found " . count($eligible) . " eligible application(s)\n";
        foreach ($eligible as $app) {
            $canGenerate = $app['has_license'] == 0 ? 'YES' : 'NO (already has license)';
            echo "  - {$app['application_id']}: Payment={$app['payment_status']}, Face={$app['face_verification_status']}, Can Generate=$canGenerate\n";
        }
    } else {
        echo "⚠ No eligible applications found\n";
        echo "  Applications need both payment_status='completed' AND face_verification_status='completed'\n";
    }
} catch (Exception $e) {
    echo "✗ Error checking applications: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 5: Check existing licenses
echo "Test 5: Checking existing licenses...\n";

try {
    $stmt = $conn->query("
        SELECT 
            dl.license_number,
            dl.application_id,
            dl.license_type,
            dl.issue_date,
            dl.expiry_date,
            dl.status,
            u.full_name
        FROM driving_licenses dl
        JOIN users u ON dl.user_id = u.id
        ORDER BY dl.created_at DESC
        LIMIT 5
    ");
    
    $licenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($licenses) > 0) {
        echo "✓ Found " . count($licenses) . " existing license(s)\n";
        foreach ($licenses as $lic) {
            echo "  - {$lic['license_number']}: {$lic['full_name']} ({$lic['license_type']}) - {$lic['status']}\n";
        }
    } else {
        echo "⚠ No licenses generated yet\n";
        echo "  Users can generate licenses from the 'আমার লাইসেন্স দেখুন' menu\n";
    }
} catch (Exception $e) {
    echo "✗ Error checking licenses: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 6: Test API endpoint accessibility
echo "Test 6: Testing API endpoints...\n";

// Test get_user_applications.php
$testUrl = "http://192.168.0.106/brta_mob/api/get_user_applications.php?user_id=1";
echo "Testing GET: $testUrl\n";

$ch = curl_init($testUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    $data = json_decode($response, true);
    if (isset($data['success'])) {
        echo "✓ get_user_applications.php is accessible and responding\n";
        if ($data['success']) {
            echo "  Found " . count($data['applications']) . " application(s) for user_id=1\n";
        }
    } else {
        echo "⚠ API returned unexpected format\n";
    }
} else {
    echo "✗ API returned HTTP $httpCode\n";
    echo "  Make sure XAMPP Apache is running\n";
}

echo "\n";

// Summary
echo "=== Test Summary ===\n";
echo "✓ = Pass\n";
echo "✗ = Fail\n";
echo "⚠ = Warning/Info\n\n";

echo "Next Steps:\n";
echo "1. Make sure XAMPP Apache and MySQL are running\n";
echo "2. Complete a license application with payment and face verification\n";
echo "3. Login to the app and go to Dashboard → 'আমার লাইসেন্স দেখুন'\n";
echo "4. Click 'লাইসেন্স তৈরি করুন' to generate a license\n";
echo "5. Click 'লাইসেন্স দেখুন' to view the generated license card\n";
echo "6. Download as PDF from the license card screen (web only)\n\n";

echo "For detailed documentation, see: DRIVING_LICENSE_FEATURE.md\n";

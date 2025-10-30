# Driving License Generation Feature

## Overview
This feature allows users to generate and view their driving license after successful payment and face verification completion.

## New Features Added

### 1. Database Table: `driving_licenses`
A new table to store generated driving licenses with the following fields:
- `license_number`: Unique license identifier (format: BD-YYYY-XXXXXX)
- `application_id`: Links to the driving license application
- `user_id`, `nid_id`: Foreign keys to users and NID information
- `license_type`, `vehicle_type`: Type of license and vehicle
- `issue_date`, `expiry_date`: Validity period (5 years)
- `status`: active/expired/suspended/revoked
- `photo_path`, `qr_code_path`: Paths to license photo and QR code

### 2. New API Endpoints

#### `api/get_user_applications.php`
- **Method**: GET
- **Parameters**: `user_id`
- **Description**: Fetches all applications for a user with complete details including:
  - Application status and payment status
  - NID information
  - License information (if generated)
  - Flag `can_generate_license` to indicate if license generation is available

#### `api/generate_license.php`
- **Method**: POST
- **Parameters**: `application_id` (JSON body)
- **Description**: Generates a driving license for a completed application
- **Validations**:
  - Payment must be completed
  - Face verification must be completed
  - License not already generated
- **Returns**: Generated license details with license number, issue date, and expiry date

### 3. New Screens

#### `ViewLicenseScreen.js`
- Displays all user applications in cards
- Shows application status, payment status, and license information
- Provides "Generate License" button for eligible applications
- Provides "View License" button for applications with generated licenses
- Auto-refreshes after license generation

#### `LicenseCardScreen.js`
- Displays the driving license in card format (front and back)
- Shows all license details including:
  - Photo, name, father's name, DOB, blood group
  - License number, type, vehicle type
  - Issue and expiry dates
  - NID number and address
- PDF download functionality for web users
- Professional BRTA-styled license design

### 4. Dashboard Updates
- Added new menu item "🎫 আমার লাইসেন্স দেখুন" (View My License)
- Highlighted with green border to draw attention
- Routes to ViewLicenseScreen with user information

### 5. Navigation Updates
- Added `ViewLicense` screen to navigation stack
- Added `LicenseCard` screen to navigation stack
- Proper routing between screens with parameter passing

## How It Works

### User Flow:
1. User completes driving license application
2. User completes face verification
3. User completes payment through SSL Commerce
4. User navigates to Dashboard → "আমার লাইসেন্স দেখুন"
5. User sees their application with "লাইসেন্স তৈরি করুন" button
6. User clicks to generate license
7. System creates license entry with unique license number
8. User can now view the license card (front and back)
9. User can download license as PDF (web only)

### License Generation Logic:
- License number format: `BD-YYYY-XXXXXX` (e.g., BD-2025-123456)
- Year is current year
- Random 6-digit number (ensures uniqueness with retry logic)
- Valid for 5 years from issue date
- Updates application status to 'completed'
- Creates notification for user

### Design Features:
- Professional BRTA green gradient background
- Credit card-sized license (85.6mm × 53.98mm)
- Front card displays: Photo, Name, Father's Name, DOB, Blood Group, License Number
- Back card displays: NID, License Type, Vehicle Type, Dates, Address, QR Code placeholder
- Bengali and English labels
- Print-friendly PDF generation for web

## Installation Steps

1. **Create Database Table**:
   ```bash
   php setup_driving_licenses_table.php
   ```

2. **Verify API Endpoints**:
   - Ensure `api/get_user_applications.php` is accessible
   - Ensure `api/generate_license.php` is accessible

3. **No Package Changes Required**:
   - All features use existing dependencies
   - No new npm packages needed

## Files Modified/Created

### New Files:
- `database/driving_licenses_table.sql` - Database schema
- `setup_driving_licenses_table.php` - Setup script
- `api/get_user_applications.php` - Fetch applications API
- `api/generate_license.php` - Generate license API
- `ViewLicenseScreen.js` - Applications list screen
- `LicenseCardScreen.js` - License card display screen
- `DRIVING_LICENSE_FEATURE.md` - This documentation

### Modified Files:
- `navigation.js` - Added new routes
- `DashboardScreen.js` - Added license view menu item

## Testing Checklist

- [ ] Database table created successfully
- [ ] User can view all their applications
- [ ] Applications show correct payment and verification status
- [ ] "Generate License" button appears only for eligible applications
- [ ] License generation creates unique license number
- [ ] License card displays correctly with all information
- [ ] PDF download works on web platform
- [ ] Mobile users see appropriate screenshot message
- [ ] Dashboard menu navigation works correctly
- [ ] Notifications created after license generation

## Future Enhancements

1. **QR Code Generation**: Implement actual QR code with license verification link
2. **Digital Signature**: Add BRTA digital signature to license
3. **Barcode**: Add barcode for quick scanning
4. **Email Delivery**: Send license PDF to user email
5. **SMS Notification**: Send license number via SMS
6. **License Renewal**: Add renewal functionality before expiry
7. **Mobile PDF**: Implement PDF generation for mobile platforms
8. **Offline Access**: Cache license for offline viewing
9. **Multilingual**: Add more language options
10. **Verification Portal**: Public portal to verify license authenticity

## Security Considerations

- ✅ License number uniqueness validated
- ✅ Payment completion verified before generation
- ✅ Face verification required
- ✅ User authentication required for all endpoints
- ⚠️ Consider adding rate limiting to prevent abuse
- ⚠️ Add CAPTCHA for web PDF downloads
- ⚠️ Implement license watermarking

## API Response Examples

### Get User Applications
```json
{
  "success": true,
  "applications": [
    {
      "application_id": "APP-2025-001",
      "payment_status": "completed",
      "face_verification_status": "completed",
      "license": {
        "license_number": "BD-2025-123456",
        "issue_date": "2025-10-18",
        "expiry_date": "2030-10-18",
        "status": "active"
      },
      "can_generate_license": false
    }
  ]
}
```

### Generate License
```json
{
  "success": true,
  "message": "License generated successfully",
  "license": {
    "license_number": "BD-2025-123456",
    "issue_date": "2025-10-18",
    "expiry_date": "2030-10-18",
    "status": "active"
  }
}
```

## Support

For issues or questions, please check:
1. Database connection in `api/config.php`
2. API endpoint accessibility
3. User authentication status
4. Application payment and verification status

---
**Version**: 1.0.0  
**Last Updated**: October 18, 2025  
**Author**: BRTA Development Team

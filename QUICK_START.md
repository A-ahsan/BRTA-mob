# 🚀 Quick Start Guide - Driving License Feature

## ⚡ Setup (One-time)

```bash
# 1. Create the database table
cd c:\xampp\htdocs\brta_mob
php setup_driving_licenses_table.php

# 2. Verify setup
php test_license_apis.php

# 3. Start your app
npm start
```

## 👤 User Journey

### For Users:
1. **Login** to your account
2. Go to **Dashboard**
3. Click **"🎫 আমার লাইসেন্স দেখুন"** (View My License)
4. See all your applications
5. For completed applications: Click **"লাইসেন্স তৈরি করুন"** (Generate License)
6. After generation: Click **"লাইসেন্স দেখুন"** (View License)
7. Download as PDF (web only)

### Requirements for License Generation:
- ✅ Application submitted
- ✅ Face verification completed
- ✅ Payment completed (via SSL Commerce)

## 🔗 API Endpoints

### Get User Applications
```javascript
GET http://10.15.19.0/brta_mob/api/get_user_applications.php?user_id={user_id}

Response:
{
  "success": true,
  "applications": [
    {
      "application_id": "APP-XXX",
      "payment_status": "completed",
      "face_verification_status": "completed",
      "can_generate_license": true,
      "license": null // or license object if generated
    }
  ]
}
```

### Generate License
```javascript
POST http://10.15.19.0/brta_mob/api/generate_license.php
Body: { "application_id": "APP-XXX" }

Response:
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

## 📱 New Screens

### ViewLicenseScreen
- **Route**: `ViewLicense`
- **Params**: `{ user }`
- **Shows**: All applications, generate/view buttons

### LicenseCardScreen
- **Route**: `LicenseCard`
- **Params**: `{ application, user }`
- **Shows**: Front and back of license, PDF download

## 🎨 Dashboard Menu

```javascript
// New menu item added:
<TouchableOpacity 
  style={[styles.menuItem, styles.highlightedItem]} 
  onPress={() => navigation.navigate('ViewLicense', { user })}
>
  <Text style={styles.menuText}>🎫 আমার লাইসেন্স দেখুন</Text>
</TouchableOpacity>
```

## 🗂️ File Structure

```
brta_mob/
├── api/
│   ├── get_user_applications.php    ← Get all applications
│   └── generate_license.php          ← Generate license
├── database/
│   └── driving_licenses_table.sql    ← Table schema
├── ViewLicenseScreen.js              ← Applications list
├── LicenseCardScreen.js              ← License display
├── setup_driving_licenses_table.php  ← Setup script
├── test_license_apis.php             ← Test script
└── IMPLEMENTATION_SUMMARY.md         ← Full docs
```

## ✅ Verification Checklist

Before using the feature:
- [ ] XAMPP MySQL running
- [ ] XAMPP Apache running
- [ ] Database table created (`php setup_driving_licenses_table.php`)
- [ ] At least one application with payment_status='completed'
- [ ] Face verification completed for that application

## 🔍 Troubleshooting

### "No applications found"
→ Make sure you're logged in with the correct user

### "Can't generate license" button not showing
→ Check payment_status and face_verification_status are both 'completed'

### "License already generated"
→ Each application can only generate one license

### API not responding
→ Check XAMPP Apache is running on port 80

### Database errors
→ Run `php test_license_apis.php` to diagnose

## 🎯 Testing

### Test with existing data:
```bash
php test_license_apis.php
```

### Manual test flow:
1. Complete an application
2. Complete face verification
3. Complete payment
4. Go to Dashboard → "আমার লাইসেন্স দেখুন"
5. Click "লাইসেন্স তৈরি করুন"
6. Click "লাইসেন্স দেখুন"
7. Download PDF (web)

## 📊 License Number Format

- Format: `BD-YYYY-XXXXXX`
- Example: `BD-2025-123456`
- YYYY = Current year
- XXXXXX = Random 6-digit number (unique)

## ⏱️ License Validity

- **Issue Date**: Date of generation
- **Expiry Date**: Issue date + 5 years
- **Status**: Active (can be updated later)

## 🎨 Color Scheme

- Primary: `#006a4e` (BRTA Green)
- Secondary: `#00a86b` (Light Green)
- Accent: `#c69214` (Gold)
- Success: `#4caf50` (Green)
- Warning: `#ff9800` (Orange)
- Error: `#f44336` (Red)

## 📝 Important Notes

1. **No breaking changes** - All existing features still work
2. **No new packages** - Uses existing dependencies
3. **Secure** - Validates payment and verification
4. **Unique licenses** - Retry logic ensures uniqueness
5. **Professional design** - BRTA-branded cards

## 🚀 Go Live Checklist

Before production:
- [ ] Test all user flows
- [ ] Verify PDF generation (web)
- [ ] Test on mobile devices
- [ ] Check database backups
- [ ] Review security settings
- [ ] Test with multiple users
- [ ] Verify notification system
- [ ] Check license number uniqueness

---

**Ready to go! Start the app and test the feature.** 🎉

For detailed documentation, see: `IMPLEMENTATION_SUMMARY.md`

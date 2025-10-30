# 🎯 Driving License Generation - Flow Diagram

## Complete User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

1️⃣ APPLICATION SUBMISSION
   ┌────────────────┐
   │ User applies   │
   │ for license    │
   └───────┬────────┘
           │
           ▼
   ┌────────────────┐
   │ Upload NID     │
   │ OCR scan       │
   └───────┬────────┘
           │
           ▼
   ┌────────────────┐
   │ Upload selfie  │
   │ Select type    │
   └───────┬────────┘
           │
           ▼

2️⃣ FACE VERIFICATION
   ┌────────────────────┐
   │ Face Verification  │
   │ WebFaceVerification│
   └──────────┬─────────┘
              │
              ▼
   ┌─────────────────────┐
   │ Verification Score  │
   │ Status: completed   │
   └──────────┬──────────┘
              │
              ▼

3️⃣ PAYMENT
   ┌──────────────────┐
   │ Calculate fees   │
   │ SSL Commerce     │
   └─────────┬────────┘
             │
             ▼
   ┌──────────────────────┐
   │ Payment successful   │
   │ Status: completed    │
   └─────────┬────────────┘
             │
             ▼

4️⃣ LICENSE GENERATION (NEW FEATURE)
   ┌──────────────────────────┐
   │ Dashboard → View License │
   └────────────┬─────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ ViewLicenseScreen               │
   │ Shows all applications          │
   │                                 │
   │ ┌─────────────────────────────┐ │
   │ │ Application Card            │ │
   │ │ ✓ Payment: completed        │ │
   │ │ ✓ Face Verify: completed    │ │
   │ │                             │ │
   │ │ [Generate License Button]   │ │
   │ └─────────────────────────────┘ │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ API: generate_license.php       │
   │                                 │
   │ 1. Validate payment ✓           │
   │ 2. Validate face verify ✓       │
   │ 3. Generate license number      │
   │    Format: BD-2025-XXXXXX       │
   │ 4. Set validity: 5 years        │
   │ 5. Insert to driving_licenses   │
   │ 6. Update application status    │
   │ 7. Create notification          │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ License Generated! 🎉           │
   │ License: BD-2025-123456         │
   └────────────┬────────────────────┘
                │
                ▼

5️⃣ VIEW LICENSE
   ┌─────────────────────────────────┐
   │ [View License Button]           │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ LicenseCardScreen               │
   │                                 │
   │ ┌─────────────────────────────┐ │
   │ │     FRONT CARD              │ │
   │ │                             │ │
   │ │  [Photo] | Name             │ │
   │ │          | Father's Name    │ │
   │ │          | DOB              │ │
   │ │          | Blood Group      │ │
   │ │                             │ │
   │ │  License: BD-2025-123456    │ │
   │ └─────────────────────────────┘ │
   │                                 │
   │ ┌─────────────────────────────┐ │
   │ │     BACK CARD               │ │
   │ │                             │ │
   │ │  NID | License Type         │ │
   │ │  Vehicle | Issue Date       │ │
   │ │  Expiry | Status            │ │
   │ │                             │ │
   │ │  Address: ...               │ │
   │ │                             │ │
   │ │  [QR Code]                  │ │
   │ └─────────────────────────────┘ │
   │                                 │
   │ [Download PDF Button] 📄        │
   └─────────────────────────────────┘
```

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     FRONTEND (React Native)                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  DashboardScreen.js                                        │
│       │                                                    │
│       ├──► ViewLicenseScreen.js                           │
│       │         │                                          │
│       │         ├──► generate_license.php                 │
│       │         │    (Creates license)                    │
│       │         │                                          │
│       │         └──► LicenseCardScreen.js                 │
│       │                   │                               │
│       │                   └──► PDF Generation (Web)       │
│       │                                                    │
└───────┼────────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────────┐
│                     BACKEND (PHP APIs)                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  get_user_applications.php                                 │
│    ├─► Query: driving_license_applications                │
│    ├─► Join: nid_information                              │
│    ├─► Join: users                                        │
│    ├─► Left Join: driving_licenses                        │
│    └─► Returns: Complete application data                 │
│                                                            │
│  generate_license.php                                      │
│    ├─► Validate: payment_status = 'completed'             │
│    ├─► Validate: face_verification_status = 'completed'   │
│    ├─► Generate: Unique license number                    │
│    ├─► Insert: Into driving_licenses table                │
│    ├─► Update: Application status to 'completed'          │
│    └─► Create: Notification for user                      │
│                                                            │
└───────┼────────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────────┐
│                     DATABASE (MySQL)                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  driving_license_applications                              │
│    ├─ application_id (PK)                                 │
│    ├─ payment_status                                      │
│    ├─ face_verification_status                            │
│    └─ application_status                                  │
│                                                            │
│  driving_licenses (NEW)                                    │
│    ├─ license_number (PK, UNIQUE)                         │
│    ├─ application_id (FK, UNIQUE)                         │
│    ├─ user_id (FK)                                        │
│    ├─ issue_date                                          │
│    ├─ expiry_date                                         │
│    └─ status                                              │
│                                                            │
│  nid_information                                           │
│    ├─ nid_number                                          │
│    ├─ full_name                                           │
│    └─ Other personal details                              │
│                                                            │
│  users                                                     │
│    ├─ id (PK)                                             │
│    └─ User authentication details                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Database Relationships

```
users
  │
  └──┐
     │
driving_license_applications
  │
  ├──► nid_information
  │
  └──► driving_licenses (NEW)
         │
         └──► Contains:
              - license_number
              - issue_date
              - expiry_date
              - status
```

## Component Tree

```
App
 │
 └── NavigationContainer
      │
      └── Stack.Navigator
           │
           ├── HomeScreen
           ├── LoginScreen
           ├── SignupScreen
           │
           ├── DashboardScreen
           │    │
           │    └── Menu Items
           │         │
           │         └── 🎫 আমার লাইসেন্স দেখুন (NEW)
           │              │
           │              ▼
           │         ViewLicenseScreen (NEW)
           │              │
           │              ├── Application Cards
           │              │    │
           │              │    ├── [Generate License] Button
           │              │    └── [View License] Button
           │              │         │
           │              │         ▼
           │              └── LicenseCardScreen (NEW)
           │                   │
           │                   ├── Front Card
           │                   ├── Back Card
           │                   └── [Download PDF] Button
           │
           ├── ApplyLicenseScreen
           └── FAQScreen
```

## State Flow

```
Application States:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

pending
   ↓
under_review
   ↓
approved
   ↓
payment_pending
   ↓
[User pays via SSL Commerce]
   ↓
payment_status: completed
   ↓
[User completes face verification]
   ↓
face_verification_status: completed
   ↓
[User generates license] ★ NEW
   ↓
driving_licenses table entry created
   ↓
application_status: completed
   ↓
License viewable and downloadable
```

## Data Flow

```
User Action           API Call              Database              Response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Click "View License"
     │
     ├──► GET /get_user_applications.php
     │         │
     │         ├──► SELECT applications
     │         │    JOIN nid_information
     │         │    LEFT JOIN driving_licenses
     │         │
     │         └──► {applications: [...]}
     │
     └──► Display applications

Click "Generate License"
     │
     ├──► POST /generate_license.php
     │         │
     │         ├──► Validate payment ✓
     │         ├──► Validate face verify ✓
     │         ├──► Generate license_number
     │         ├──► INSERT INTO driving_licenses
     │         ├──► UPDATE application status
     │         └──► INSERT notification
     │
     └──► {license: {license_number, ...}}

Click "View License"
     │
     └──► Navigate to LicenseCardScreen
              │
              └──► Display license card

Click "Download PDF"
     │
     └──► (Web) Open print dialog
          (Mobile) Show screenshot message
```

## Security Flow

```
┌─────────────────────────────────────┐
│ User requests license generation    │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Validate: User is logged in          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Validate: Application exists         │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Validate: payment_status = completed │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Validate: face_verify = completed    │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Validate: No existing license        │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Generate unique license number       │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Create license record                │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Success! License generated           │
└──────────────────────────────────────┘
```

---

**All flows are working without breaking any existing features!** ✨

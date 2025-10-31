# BRTA Mobile Application(Testing Purpose,not an official)

## 🚗 Project Overview

BRTA 2.0 is a digital service platform for Bangladesh Road Transport Authority (BRTA). This mobile application provides citizens with convenient online access to driving license services, including application submission, face verification, and secure payment processing.

## ✨ Features

### Core Features
- **Bengali Language Support**: Complete localization in Bangla
- **NID Verification**: OCR-based National ID card scanning and verification
- **Face Verification**: Live facial recognition with liveness detection
- **Payment Integration**: SSL Commerce payment gateway integration
- **FAQ System**: Comprehensive help system for users
- **Responsive Design**: Works on mobile devices and web browsers

### User Features
- User registration and authentication
- Driving license application with photo upload
- Real-time face verification with security checks
- Online payment processing (bKash, Nagad, Cards)
- Application status tracking
- FAQ and help documentation

### Administrative Features
- Application review and processing
- User management
- Payment verification
- System monitoring

## 🛠 Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development and build toolchain
- **React Navigation**: Navigation management
- **Face-API.js**: Face detection and recognition
- **Tesseract.js**: OCR text recognition

### Backend
- **PHP**: Server-side processing
- **MySQL**: Database management
- **SSL Commerce**: Payment gateway integration

### Development Tools
- **XAMPP**: Local development environment
- **Git**: Version control
- **VS Code**: Recommended IDE

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **XAMPP** or similar LAMP/WAMP stack
- **Git** for version control
- **Expo CLI** (for React Native development)

```bash
npm install -g expo-cli
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/brta-mobile-app.git
cd brta-mobile-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
1. Start XAMPP and ensure MySQL is running
2. Create a new database named `brta_mob`
3. Import the database schema:
```sql
-- See database/schema.sql for complete structure
```

### 4. Configure Environment
1. Copy `.env.example` to `.env`
2. Update the configuration with your settings:
```env
API_BASE_URL=http://10.15.19.0/brta_mob/api
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=brta_mob
```

### 5. SSL Commerce Setup (Payment Gateway)
1. Register with SSL Commerce for API credentials
2. Update payment configuration in `config.js`
3. Configure webhook URLs for payment callbacks

### 6. Start Development Server
```bash
# For React Native/Expo
expo start

# For web development
npm run web
```

## 📱 Usage

### For Users
1. **Registration**: Create account with email and password
2. **Login**: Access the dashboard with credentials
3. **Apply for License**: 
   - Upload NID card photo
   - Complete face verification
   - Submit application
   - Process payment
4. **Track Application**: Monitor status through dashboard

### For Administrators
1. Access admin panel at `/brta/admin-dashboard.php`
2. Review applications
3. Approve/reject submissions
4. Monitor system activity

## 🔧 Configuration

### API Endpoints
- **Authentication**: `/api/auth.php`
- **NID Verification**: `/api/check_nid.php`
- **License Application**: `/api/apply_license_with_photo.php`
- **Face Verification**: `/api/complete_face_verification.php`

### Database Configuration
Update `api/config.php` with your database settings:
```php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "brta_mob";
```

### Network Configuration
The application is configured for IP `10.15.19.0`. Update the following files if you need to change the network configuration:
- `config.js`
- `api/config.php`
- All API endpoint references

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] NID card upload and OCR
- [ ] Face verification process
- [ ] Payment gateway integration
- [ ] Application submission flow
- [ ] Admin panel functionality

## 📖 API Documentation

### Authentication Endpoints
```
POST /api/auth.php
Body: { "username": "user", "password": "pass", "action": "login" }
Response: { "success": true, "user": {...} }
```

### Application Endpoints
```
POST /api/apply_license_with_photo.php
Body: FormData with license application details
Response: { "success": true, "application_id": "123" }
```

### Face Verification
```
POST /api/complete_face_verification.php
Body: { "application_id": "123", "verification_data": {...} }
Response: { "success": true, "message": "Verification complete" }
```

## 🚀 Deployment

### Development Deployment
1. Ensure XAMPP is running
2. Place project in `htdocs` directory
3. Configure database and API endpoints
4. Test all features locally

### Production Deployment
1. Set up web server (Apache/Nginx)
2. Configure PHP and MySQL
3. Update production environment variables
4. Set up SSL certificates
5. Configure payment gateway for production
6. Deploy mobile app to app stores

### Environment Variables
Create production `.env` file:
```env
NODE_ENV=production
API_BASE_URL=https://your-domain.com/api
SSL_COMMERCE_STORE_ID=your_store_id
SSL_COMMERCE_STORE_PASSWORD=your_store_password
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Guidelines
- Follow Bengali localization standards
- Maintain responsive design principles
- Write clear, documented code
- Test all features thoroughly
- Follow security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: BRTA Digital Services
- **Backend Development**: PHP/MySQL specialists
- **Frontend Development**: React Native developers
- **UI/UX Design**: Bengali interface specialists

## 📞 Support

For support and questions:
- **Email**: support@brta.gov.bd
- **Documentation**: Check the FAQ section in the app
- **Issues**: Use GitHub issues for bug reports

## 🗺 Roadmap

### Version 2.1 (Upcoming)
- [ ] Advanced biometric verification
- [ ] Real-time application tracking
- [ ] Multi-language support
- [ ] Enhanced admin dashboard

### Version 2.2 (Future)
- [ ] Mobile app store deployment
- [ ] Offline functionality
- [ ] Advanced analytics
- [ ] Integration with other government services

## 🙏 Acknowledgments

- Bangladesh Road Transport Authority (BRTA)
- SSL Commerce payment gateway
- Face-API.js community
- React Native community
- All contributors and testers

---


**Note**: This is a government digital service platform. Please ensure compliance with all applicable laws and regulations when using or contributing to this project.

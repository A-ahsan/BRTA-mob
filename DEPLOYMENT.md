# Deployment Guide

## 🚀 BRTA Mobile App Deployment

This document provides step-by-step instructions for deploying the BRTA mobile application in different environments.

## 📋 Prerequisites

### System Requirements
- **Web Server**: Apache 2.4+ or Nginx 1.18+
- **PHP**: Version 7.4 or higher
- **MySQL**: Version 5.7 or higher
- **Node.js**: Version 14+ (for development)
- **SSL Certificate**: Required for production

### Required Extensions
- PHP GD Library (for image processing)
- PHP cURL (for API calls)
- PHP MySQLi (for database)
- PHP OpenSSL (for encryption)

## 🏠 Local Development Setup

### 1. XAMPP Installation
```bash
# Download and install XAMPP
# Start Apache and MySQL services
# Access phpMyAdmin at http://localhost/phpmyadmin
```

### 2. Project Setup
```bash
# Clone repository
git clone https://github.com/your-repo/brta-mobile-app.git
cd brta-mobile-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 3. Database Configuration
```sql
-- Create database
CREATE DATABASE brta_mob;

-- Import schema
mysql -u root -p brta_mob < database/schema.sql
```

### 4. Local Configuration
Update `.env` file:
```env
NODE_ENV=development
API_BASE_URL=http://localhost/brta_mob/api
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=brta_mob
SSL_COMMERCE_MODE=sandbox
```

### 5. Start Development
```bash
# Start React Native development server
expo start

# Access web version at http://localhost:19006
# Access API at http://localhost/brta_mob/api
```

## 🌐 Production Deployment

### Step 1: Server Preparation

#### Ubuntu/Debian Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Apache
sudo apt install apache2 -y

# Install PHP and extensions
sudo apt install php8.1 php8.1-mysql php8.1-gd php8.1-curl php8.1-mbstring -y

# Install MySQL
sudo apt install mysql-server -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y
```

#### Configure Apache
```bash
# Enable required modules
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod headers

# Create virtual host
sudo nano /etc/apache2/sites-available/brta.conf
```

Virtual Host Configuration:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/brta_mob
    
    <Directory /var/www/brta_mob>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/brta_error.log
    CustomLog ${APACHE_LOG_DIR}/brta_access.log combined
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/brta_mob
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    <Directory /var/www/brta_mob>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/brta_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/brta_ssl_access.log combined
</VirtualHost>
```

### Step 2: Database Setup

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE brta_mob;
CREATE USER 'brta_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON brta_mob.* TO 'brta_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import database schema
mysql -u brta_user -p brta_mob < database/schema.sql
```

### Step 3: Application Deployment

```bash
# Clone repository to server
cd /var/www
sudo git clone https://github.com/your-repo/brta-mobile-app.git brta_mob
cd brta_mob

# Set proper permissions
sudo chown -R www-data:www-data /var/www/brta_mob
sudo chmod -R 755 /var/www/brta_mob
sudo chmod -R 777 /var/www/brta_mob/uploads
sudo chmod -R 777 /var/www/brta_mob/brta/uploads
```

### Step 4: Environment Configuration

Create production `.env` file:
```env
NODE_ENV=production
API_BASE_URL=https://your-domain.com/api
DATABASE_HOST=localhost
DATABASE_USER=brta_user
DATABASE_PASSWORD=secure_password
DATABASE_NAME=brta_mob
SSL_COMMERCE_MODE=live
SSL_COMMERCE_STORE_ID=your_live_store_id
SSL_COMMERCE_STORE_PASSWORD=your_live_password
```

Update `api/config.php`:
```php
<?php
$servername = "localhost";
$username = "brta_user";
$password = "secure_password";
$dbname = "brta_mob";

// Enable error reporting for debugging (disable in production)
error_reporting(0);
ini_set('display_errors', 0);
?>
```

### Step 5: SSL Commerce Configuration

Update payment gateway settings:
```php
// In gateway files
$store_id = "your_live_store_id";
$store_passwd = "your_live_password";
$is_sandbox = false; // Set to false for live
```

### Step 6: Security Configuration

Create `.htaccess` in root directory:
```apache
# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Prevent access to sensitive files
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
```

## 📱 Mobile App Deployment

### React Native Build

```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Build for Android
expo build:android

# Build for iOS
expo build:ios

# Or use EAS Build (recommended)
npm install -g @expo/eas-cli
eas build --platform all
```

### App Store Deployment

#### Android (Google Play Store)
1. Build APK/AAB file
2. Create Google Play Console account
3. Upload build and complete store listing
4. Submit for review

#### iOS (Apple App Store)
1. Build IPA file
2. Create Apple Developer account
3. Upload to App Store Connect
4. Complete app metadata and submit for review

## 🔧 Configuration Management

### Environment Variables
```bash
# Development
NODE_ENV=development
API_BASE_URL=http://localhost/brta_mob/api

# Staging
NODE_ENV=staging
API_BASE_URL=https://staging.your-domain.com/api

# Production
NODE_ENV=production
API_BASE_URL=https://your-domain.com/api
```

### Database Migrations
```sql
-- Version control for database changes
-- Create migration files for each update
-- Example: migration_v1.1.sql

ALTER TABLE driving_license_applications 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

## 📊 Monitoring & Maintenance

### Log Files
- **Apache Logs**: `/var/log/apache2/`
- **PHP Logs**: `/var/log/php/`
- **Application Logs**: `/var/www/brta_mob/logs/`

### Backup Strategy
```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u brta_user -p brta_mob > /backup/brta_mob_$DATE.sql

# File backup
tar -czf /backup/brta_files_$DATE.tar.gz /var/www/brta_mob
```

### Performance Optimization
- Enable PHP OPcache
- Use CDN for static assets
- Implement database indexing
- Regular log rotation
- Monitor server resources

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check MySQL service
sudo systemctl status mysql

# Check credentials in config.php
# Verify database exists and user has permissions
```

#### File Upload Issues
```bash
# Check directory permissions
sudo chmod 777 /var/www/brta_mob/uploads

# Check PHP configuration
php -m | grep -i gd
```

#### SSL Commerce Payment Issues
- Verify store credentials
- Check sandbox vs live mode
- Confirm callback URLs are accessible
- Review SSL Commerce logs

#### Face Verification Not Working
- Ensure HTTPS is enabled
- Check camera permissions
- Verify face-api.js models are loaded
- Check browser compatibility

## 📈 Scaling Considerations

### Load Balancing
- Use multiple server instances
- Implement session sharing
- Database read replicas
- CDN for static content

### Performance Monitoring
- Setup application monitoring
- Database performance tracking
- Server resource monitoring
- User experience analytics

## 🔐 Security Checklist

- [ ] SSL certificate installed and configured
- [ ] Database user has minimal required permissions
- [ ] Sensitive files excluded from public access
- [ ] Regular security updates applied
- [ ] File upload restrictions implemented
- [ ] SQL injection protection in place
- [ ] XSS protection headers configured
- [ ] Regular backups scheduled
- [ ] Access logs monitored
- [ ] Error reporting disabled in production

---

**Note**: Always test deployments in a staging environment before applying to production. Keep backups of both database and files before any major updates.
# Contributing to BRTA Mobile Application

## 🤝 Welcome Contributors

Thank you for your interest in contributing to the BRTA Mobile Application! This document provides guidelines and standards for contributing to this government digital service platform.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Guidelines](#development-guidelines)
4. [Coding Standards](#coding-standards)
5. [Submission Process](#submission-process)
6. [Testing Requirements](#testing-requirements)
7. [Documentation Standards](#documentation-standards)

## 🤝 Code of Conduct

### Our Commitment
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, gender, nationality, religion, or other personal characteristics.

### Expected Behavior
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community and users
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing private information without permission
- Any conduct inappropriate in a professional setting

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- Node.js (v14 or higher)
- XAMPP or similar LAMP stack
- Git knowledge
- Basic understanding of React Native and PHP

### Setting Up Development Environment

1. **Fork the Repository**
```bash
git fork https://github.com/brta/brta-mobile-app.git
git clone https://github.com/your-username/brta-mobile-app.git
cd brta-mobile-app
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Database**
```bash
# Import database schema
mysql -u root -p brta_mob < database/schema.sql
```

4. **Configure Environment**
```bash
cp .env.example .env
# Update .env with your local settings
```

5. **Start Development Server**
```bash
expo start
```

## 🛠️ Development Guidelines

### Bengali Language Requirements
- **All user-facing text must be in Bengali (Bangla)**
- Use proper Bengali grammar and spelling
- Maintain consistency in terminology across the application
- Include English comments in code for developer understanding

### Government Compliance
- Follow Bangladesh government digital service standards
- Ensure accessibility compliance
- Maintain data privacy and security standards
- Adhere to BRTA policies and procedures

### Feature Development
- Focus on user experience and accessibility
- Ensure mobile responsiveness
- Test on multiple devices and browsers
- Implement proper error handling

## 💻 Coding Standards

### JavaScript/React Native Standards

#### File Naming
```javascript
// Use PascalCase for components
HomeScreen.js
WebFaceVerification.js

// Use camelCase for utilities
apiHelper.js
dateUtils.js

// Use kebab-case for configuration files
.env.example
package.json
```

#### Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ComponentName({ navigation, prop1, prop2 }) {
  // State declarations
  const [loading, setLoading] = useState(false);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Helper functions
  const handleSubmit = async () => {
    // Function logic
  };
  
  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title in Bengali</Text>
    </View>
  );
}

// Styles at bottom
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006a4e'
  }
});
```

#### API Integration
```javascript
// Use consistent error handling
const API_URL = 'http://10.15.19.0/brta_mob/api';

const apiCall = async (endpoint, data) => {
  try {
    console.log(`API Call: ${endpoint}`, data);
    
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    console.log(`API Response: ${endpoint}`, result);
    
    return result;
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};
```

### PHP Standards

#### File Structure
```php
<?php
// File header with purpose
/**
 * NID Verification API
 * Handles National ID card validation and information retrieval
 */

// Error reporting (adjust for environment)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include dependencies
require_once 'config.php';

// Main logic
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handleRequest();
} else {
    sendError('Method not allowed');
}

function handleRequest() {
    // Function logic
}

function sendResponse($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
}

function sendError($message) {
    http_response_code(400);
    sendResponse(['success' => false, 'message' => $message]);
}
?>
```

#### Database Operations
```php
// Use prepared statements for security
function validateNID($nid_number) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT * FROM nid_information WHERE nid_number = ?");
    $stmt->bind_param("s", $nid_number);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $stmt->close();
    
    return $result->fetch_assoc();
}
```

### CSS/Styling Standards

#### React Native Styles
```javascript
const styles = StyleSheet.create({
  // Use descriptive names
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea', // BRTA light background
    padding: 20
  },
  
  // Follow BRTA color scheme
  primaryButton: {
    backgroundColor: '#006a4e', // BRTA green
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  
  secondaryButton: {
    backgroundColor: '#c69214', // BRTA gold
    padding: 12,
    borderRadius: 8
  },
  
  dangerButton: {
    backgroundColor: '#da291c', // BRTA red
    padding: 12,
    borderRadius: 8
  }
});
```

#### Color Standards
```javascript
// BRTA Brand Colors
const COLORS = {
  primary: '#006a4e',      // BRTA Green
  secondary: '#c69214',    // BRTA Gold
  danger: '#da291c',       // BRTA Red
  background: '#f4f1ea',   // Light cream
  white: '#ffffff',
  text: '#333333',
  border: '#dddddd'
};
```

## 📝 Submission Process

### Branch Naming
```bash
# Feature branches
feature/user-authentication
feature/face-verification-enhancement

# Bug fixes
bugfix/payment-gateway-error
bugfix/nid-validation-issue

# Hotfixes
hotfix/security-patch
hotfix/critical-bug
```

### Commit Messages
```bash
# Format: type(scope): description

feat(auth): add Bengali language support for login
fix(payment): resolve SSL Commerce callback issue
docs(readme): update installation instructions
style(ui): improve button accessibility
refactor(api): optimize database queries
test(face): add unit tests for verification
```

### Pull Request Process

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Follow coding standards
- Add appropriate tests
- Update documentation

3. **Test Thoroughly**
```bash
# Run all tests
npm test

# Test manually on multiple devices
# Verify Bengali text displays correctly
# Check API functionality
```

4. **Submit Pull Request**
- Clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Add reviewer assignments

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested on Android
- [ ] Tested on iOS
- [ ] Tested on web browser
- [ ] API endpoints tested
- [ ] Bengali text verified

## Screenshots
Include screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🧪 Testing Requirements

### Unit Testing
```javascript
// Example test structure
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
  test('renders Bengali login form', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('লগইন')).toBeTruthy();
  });
  
  test('validates user input', () => {
    // Test validation logic
  });
});
```

### Integration Testing
- Test complete user flows
- Verify API integrations
- Check payment gateway functionality
- Validate face verification process

### Manual Testing Checklist
- [ ] User registration and login
- [ ] NID card upload and OCR
- [ ] Face verification functionality
- [ ] Payment processing
- [ ] FAQ system navigation
- [ ] Bengali text display
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## 📚 Documentation Standards

### Code Documentation
```javascript
/**
 * Validates NID card information using OCR
 * @param {string} imageUri - URI of the NID card image
 * @param {function} onSuccess - Callback for successful validation
 * @param {function} onError - Callback for validation errors
 * @returns {Promise} Promise resolving to validation result
 */
const validateNIDCard = async (imageUri, onSuccess, onError) => {
  // Implementation
};
```

### API Documentation
```php
/**
 * POST /api/check_nid.php
 * 
 * Validates National ID card information
 * 
 * Request Body:
 * {
 *   "nid_number": "1234567890123",
 *   "additional_data": "optional"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "name": "User Name",
 *     "date_of_birth": "1990-01-01"
 *   }
 * }
 */
```

### README Updates
- Keep installation instructions current
- Update feature lists
- Maintain troubleshooting guides
- Include new dependencies

## 🚨 Security Guidelines

### Sensitive Information
- Never commit API keys or passwords
- Use environment variables for configuration
- Sanitize all user inputs
- Implement proper authentication

### Data Privacy
- Follow Bangladesh data protection laws
- Implement secure data storage
- Use encryption for sensitive data
- Regular security audits

### Code Security
- Validate all inputs
- Use prepared SQL statements
- Implement proper error handling
- Regular dependency updates

## 🆘 Getting Help

### Resources
- **Documentation**: Check README.md and project wiki
- **Issues**: Search existing GitHub issues
- **API Reference**: Review API documentation
- **Bengali Guidelines**: Consult language standards

### Communication Channels
- **GitHub Issues**: Technical problems and feature requests
- **Email**: security@brta.gov.bd for security issues
- **Documentation**: Update docs with your contributions

## 🎯 Contribution Areas

### High Priority
- Bengali language improvements
- Mobile accessibility enhancements
- Performance optimizations
- Security improvements

### Welcome Contributions
- Bug fixes and improvements
- Documentation updates
- Test coverage expansion
- UI/UX enhancements

### Future Features
- Advanced biometric verification
- Real-time notifications
- Offline functionality
- Additional payment methods

---

Thank you for contributing to the BRTA Mobile Application! Your contributions help improve digital services for citizens of Bangladesh.
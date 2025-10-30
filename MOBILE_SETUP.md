Mobile setup for Expo (Windows PowerShell)

1) Install Expo CLI (if not installed):

   npm install -g expo-cli

2) From project root run:

   # Install native modules used for PDF/Share
   expo install expo-print expo-sharing

   # Install remaining project dependencies
   npm install

   # Start Expo dev server
   npm run start

3) To run on a real device:
   - Install Expo Go from Play Store / App Store
   - Scan the QR code shown by Expo

Notes:
- I updated `LicenseCardScreen.js` to use `expo-print` and `expo-sharing` when running on a mobile device. On web it still opens a printable HTML window.
- If you use a custom dev client or bare workflow, install the modules with the appropriate method (e.g., pod install for iOS).
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Platform, ScrollView, Linking, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import textRecognition from '@react-native-ml-kit/text-recognition';

// (MEDIA_IMAGES defined below once for compatibility)

// Web-only face verification component: require only on web to avoid RN runtime errors
let WebFaceVerification = null;
if (Platform.OS === 'web') {
  try {
    // require at runtime so Metro/RN doesn't attempt to process DOM-based components on native
    WebFaceVerification = require('./WebFaceVerification').default;
  } catch (e) {
    console.warn('[ApplyLicense] WebFaceVerification require failed:', e);
    WebFaceVerification = null;
  }
}

// OCR for Web
let Tesseract = null;
if (typeof window !== 'undefined') {
  Tesseract = require('tesseract.js');
}

const API_URL = 'http://192.168.0.106/brta_mob/api';

// Compatibility helpers
const MEDIA_IMAGES = ImagePicker?.MediaTypeOptions?.Images ?? ImagePicker?.MediaType?.Images ?? ImagePicker?.MediaType;
const IMAGE_PICKER_AVAILABLE = typeof ImagePicker.launchImageLibraryAsync === 'function' || typeof ImagePicker.launchCameraAsync === 'function';

export default function ApplyLicenseScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  console.log('ApplyLicense received user:', user);
  
  const [scanning, setScanning] = useState(false);
  const [nidNumber, setNidNumber] = useState('');
  const [nidInfo, setNidInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [licenseType, setLicenseType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [nidImage, setNidImage] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [useSelfieAsReference, setUseSelfieAsReference] = useState(false);
  const [manualNidEntry, setManualNidEntry] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [faceImageUrl, setFaceImageUrl] = useState('');
  const [applicationId, setApplicationId] = useState(null);
  const [faceVerificationComplete, setFaceVerificationComplete] = useState(false);
  const [redirectingToPayment, setRedirectingToPayment] = useState(false);
  const [showPaymentWebview, setShowPaymentWebview] = useState(false);
  const [paymentWebviewUrl, setPaymentWebviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  // Dynamic WebView loader (optional)
  const getWebViewComponent = () => {
    try {
      // Require at runtime so Metro doesn't fail if dependency isn't installed
      const { WebView } = require('react-native-webview');
      return WebView;
    } catch (e) {
      return null;
    }
  };

  const openPaymentInApp = (appId = applicationId) => {
    if (!appId) {
      Alert.alert('Payment Unavailable', 'No application id available for payment.');
      return;
    }

    const ensureFaceVerificationCompleted = async (appIdToCheck) => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(`${API_URL}/complete_face_verification.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ application_id: appIdToCheck, user_id: user?.id || 1, nid_number: nidNumber }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const json = await res.json();
        if (json.success) return true;
        console.warn('[ApplyLicense] complete_face_verification response:', json);
        Alert.alert('Face verification', json.message || 'Could not complete face verification before payment.');
        return false;
      } catch (err) {
        console.error('[ApplyLicense] ensureFaceVerificationCompleted error:', err);
        Alert.alert('Face verification error', 'Could not reach server to complete face verification. Check network and try again.');
        return false;
      } finally {
        setLoading(false);
      }
    };

    (async () => {
      const ok = await ensureFaceVerificationCompleted(appId);
      if (!ok) return; // stop if face verification not confirmed

      const url = `${API_URL.replace('/api','')}/gateway/license_payment_start.php?application_id=${appId}&user_id=${user?.id || 1}`;
      const WebView = getWebViewComponent();
      if (WebView) {
        setPaymentWebviewUrl(url);
        setShowPaymentWebview(true);
      } else {
        Alert.alert('WebView missing', 'In-app WebView is not installed. Opening in external browser. Install `react-native-webview` for in-app payments.');
        Linking.openURL(url).catch(err => Alert.alert('Could not open browser', String(err)));
      }
    })();
  };

  // ✅ Scan / Upload NID (Mobile or Web)
  const handleScanNid = async () => {
    console.log('[ApplyLicense] handleScanNid invoked');
    if (Platform.OS === 'web') {
      fileInputRef.current && fileInputRef.current.click();
    } else {
      try {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('[ApplyLicense] media library permission:', perm);
        const status = perm?.status || (perm?.granted ? 'granted' : perm?.status);
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access media library is required!');
          return;
        }

        setScanning(true);
        let result;
        try {
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: MEDIA_IMAGES,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
        } catch (launchErr) {
          console.error('[ApplyLicense] ImagePicker.launchImageLibraryAsync error:', launchErr);
          Alert.alert('Error', 'Could not open image library.');
          setScanning(false);
          return;
        }
        setScanning(false);

        if (!result) {
          Alert.alert('Error', 'No result returned from image picker.');
          return;
        }

        if (!result.canceled && result.assets?.length > 0) {
          const imageUri = result.assets[0].uri;
          setNidImage(imageUri);

          setLoading(true);
            try {
              if (!textRecognition || typeof textRecognition.recognize !== 'function') {
                console.warn('[ApplyLicense] textRecognition not available:', textRecognition);
                Alert.alert('OCR Unavailable', 'Mobile OCR engine is not available in this build. Please enter NID number manually or use the web app.');
              } else {
                const ocrResult = await textRecognition.recognize(imageUri);
                let text = ocrResult?.map(block => block.text).join(' ') || '';
                const nidMatch = text.match(/\b\d{10,17}\b/);
                if (nidMatch) {
                  fetchNidDetails(nidMatch[0]);
                } else {
                  Alert.alert('OCR Failed', 'Could not detect NID number.');
                }
              }
            } catch (err) {
              console.error('OCR Error:', err);
              const errMsg = err?.message || '';
              // If the native module isn't linked (common in Expo Go), guide the user and enable manual entry
              if (errMsg.includes("doesn't seem to be linked") || errMsg.toLowerCase().includes('not linked') || errMsg.includes('@react-native-ml-kit')) {
                setManualNidEntry(true);
                Alert.alert(
                  'OCR Unavailable',
                  'Mobile OCR native module is not linked in this build. You can:\n\n1) Enter the NID manually (the field has been enabled).\n2) Use the web app where OCR runs in-browser.\n3) Install the native module and run a dev client or a standalone build.'
                );
              } else {
                Alert.alert('OCR Error', errMsg || 'Failed to process image.');
              }
            } finally {
              setLoading(false);
            }
        } else {
          console.log('[ApplyLicense] image picker canceled or no assets', result);
        }
      } catch (err) {
        console.error('[ApplyLicense] handleScanNid error:', err);
        Alert.alert('Error', 'Failed to open image picker or process image.');
        setScanning(false);
      }
    }
  };

  // ✅ OCR handler for Web
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const imageUrl = URL.createObjectURL(file);
    setNidImage(imageUrl);

    if (Tesseract) {
      const reader = new FileReader();
      reader.onloadend = () => {
        Tesseract.recognize(reader.result, 'ben+eng', { logger: m => console.log(m) })
          .then(async ({ data: { text } }) => {
            const nidMatch = text.match(/\b\d{10,17}\b/);
            if (nidMatch) {
              fetchNidDetails(nidMatch[0]);
            } else {
              Alert.alert('OCR Failed', 'Could not detect NID number.');
            }
          })
          .catch(() => Alert.alert('OCR Error', 'Failed to process image.'))
          .finally(() => setLoading(false));
      };
      reader.readAsDataURL(file);
    } else {
      setLoading(false);
    }
  };

  // ✅ Fetch NID details from backend
  const fetchNidDetails = async (nid) => {
    setNidNumber(nid);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/check_nid.php?nid_number=${nid}`);
      const data = await res.json();
      if (data.success) {
        setNidInfo(data.data);
      } else {
        setNidInfo(null);
        Alert.alert('জাতীয় পরিচয়পত্র পাওয়া যায়নি', 'এই জাতীয় পরিচয়পত্রের কোন রেকর্ড পাওয়া যায়নি।');
      }
    } catch {
      setNidInfo(null);
      Alert.alert('ত্রুটি', 'জাতীয় পরিচয়পত্র যাচাই করতে ব্যর্থ।');
    }
    setLoading(false);
  };

  // ✅ Selfie upload
  const handleUploadSelfie = async () => {
    console.log('[ApplyLicense] handleUploadSelfie invoked');
    if (Platform.OS === 'web') {
      selfieInputRef.current && selfieInputRef.current.click();
    } else {
      try {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('[ApplyLicense] selfie media permission:', perm);
        const status = perm?.status || (perm?.granted ? 'granted' : perm?.status);
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access media library is required!');
          return;
        }

  let result;
  try {
  // If gallery launch isn't available, try camera as a fallback
  if (typeof ImagePicker.launchImageLibraryAsync !== 'function') {
          console.warn('[ApplyLicense] launchImageLibraryAsync not available, trying camera fallback');
          if (typeof ImagePicker.requestCameraPermissionsAsync === 'function' && typeof ImagePicker.launchCameraAsync === 'function') {
            const camPerm = await ImagePicker.requestCameraPermissionsAsync();
            const camStatus = camPerm?.status || (camPerm?.granted ? 'granted' : camPerm?.status);
            if (camStatus !== 'granted') {
              Alert.alert('Permission Denied', 'Camera permission is required to take a selfie.');
              return;
            }
            const cameraRes = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
            result = cameraRes;
          } else {
            Alert.alert('Image Picker Unavailable', 'This build does not expose gallery/camera. Use Expo Go or install expo-image-picker in a custom dev client.');
            return;
          }
        } else {
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: MEDIA_IMAGES,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
        }
        } catch (launchErr) {
          console.error('[ApplyLicense] ImagePicker.launchImageLibraryAsync error (selfie):', launchErr);
          Alert.alert('Error', 'Could not open image library.');
          return;
        }

        if (!result) {
          Alert.alert('Error', 'No result returned from image picker.');
          return;
        }

        if (!result.canceled && result.assets?.length > 0) {
          const pickedUri = result.assets[0].uri;
          setSelfie(pickedUri);
          // Also use the uploaded selfie as the face reference and driving-card image when requested
          setNidImage(pickedUri);
          setUseSelfieAsReference(true);
        } else {
          console.log('[ApplyLicense] selfie picker canceled or no assets', result);
        }
      } catch (err) {
        console.error('[ApplyLicense] handleUploadSelfie error:', err);
        Alert.alert('Error', 'Failed to open image picker or process image.');
      }
    }
  };

  const handleSelfieFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelfie(url);
      // Also use the uploaded selfie as the nidImage for driving-card / face reference on web
      setNidImage(url);
    }
  };

  // ✅ Submit Application
  const handleSubmit = async () => {
    console.log('Submit button clicked!');
    console.log('NID Number:', nidNumber);
    console.log('License Type:', licenseType);
    console.log('Vehicle Type:', vehicleType);
    console.log('NID Image:', nidImage);
    console.log('Selfie:', selfie);
    
    if (!nidNumber || !licenseType || !vehicleType) {
      Alert.alert('তথ্য অনুপস্থিত', 'অনুগ্রহ করে সব ফিল্ড পূরণ করুন।');
      return;
    }
    
    console.log('Validation passed, submitting...');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_id', 1);
      formData.append('nid_number', nidNumber);
      formData.append('license_type', licenseType);
      formData.append('vehicle_type', vehicleType);

      // Prepare face_image: prefer NID image (cropped face), otherwise optionally use selfie as reference
      const prepareFaceImage = async () => {
        let imageUriToRead = null;
        if (nidImage) imageUriToRead = nidImage;
        else if (useSelfieAsReference && selfie) imageUriToRead = selfie;
        else return null;

        if (Platform.OS === 'web') {
          const res = await fetch(imageUriToRead);
          const blob = await res.blob();
          const reader = new FileReader();
          const base64 = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          return base64;
        } else {
          // React Native / Expo: use expo-file-system to read file as base64
          let FileSystem;
          try {
            FileSystem = await import('expo-file-system');
          } catch (e) {
            // Module not installed
            Alert.alert('Dependency Missing', 'Please run `expo install expo-file-system` to enable image uploads from mobile.');
            return null;
          }

          // Resolve encoding option
          const resolvedEncoding = (FileSystem && (
            (FileSystem.EncodingType && (FileSystem.EncodingType.Base64 || FileSystem.EncodingType.base64)) ||
            FileSystem.Base64 ||
            FileSystem.EncodingType
          )) || 'base64';

          try {
            // Primary: try the standard readAsStringAsync
            try {
              const base64Str = await FileSystem.readAsStringAsync(imageUriToRead, { encoding: resolvedEncoding });
              return `data:image/jpeg;base64,${base64Str}`;
            } catch (fsErr) {
              console.warn('[ApplyLicense] readAsStringAsync failed, attempting legacy import or blob fallback:', fsErr?.message || fsErr);
              // Try legacy import path for older/newer expo versions
              try {
                const LegacyFS = await import('expo-file-system/legacy');
                if (LegacyFS && typeof LegacyFS.readAsStringAsync === 'function') {
                  const base64Str2 = await LegacyFS.readAsStringAsync(imageUriToRead, { encoding: resolvedEncoding });
                  return `data:image/jpeg;base64,${base64Str2}`;
                }
              } catch (legacyErr) {
                console.warn('[ApplyLicense] legacy expo-file-system import failed:', legacyErr?.message || legacyErr);
              }

              // Fallback: try fetching the file and converting blob -> dataURL
              try {
                const resp = await fetch(imageUriToRead);
                const blob = await resp.blob();
                const reader = new FileReader();
                const dataUrl = await new Promise((resolve, reject) => {
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
                return dataUrl;
              } catch (blobErr) {
                console.error('[ApplyLicense] blob fallback failed:', blobErr);
                throw fsErr; // rethrow original to be handled below
              }
            }
          } catch (fsErr) {
            console.error('[ApplyLicense] expo-file-system readAsStringAsync failed:', fsErr);
            Alert.alert('Dependency Error', 'Could not read image file as base64. Please ensure `expo-file-system` is installed and linked (expo install expo-file-system) or run the app in a dev client/standalone build that includes it.');
            return null;
          }
        }
      };

      const faceImageData = await prepareFaceImage();
      if (faceImageData) {
        formData.append('face_image', faceImageData);
      } else {
        // No face image available — instruct user
        Alert.alert('Face Image Missing', 'No NID image was provided. Upload the NID image or toggle "Use selfie as reference" to proceed (may reduce verification accuracy).');
        setLoading(false);
        return;
      }

      if (selfie) {
        if (Platform.OS === 'web') {
          const fileInput = selfieInputRef.current;
          if (fileInput?.files?.[0]) {
            formData.append('user_photo_file', fileInput.files[0]);
          }
        } else {
          formData.append('user_photo_file', {
            uri: selfie,
            name: 'selfie.jpg',
            type: 'image/jpeg',
          });
        }
      }

      // Add a fetch timeout so it doesn't hang indefinitely
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s

      const res = await fetch(`${API_URL}/apply_license_with_photo.php`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      console.log('API Response status:', res.status);
      console.log('API Response headers:', res.headers);

      // Get response as text first to see what we're getting
      const responseText = await res.text();
      console.log('Raw API Response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response was not valid JSON:', responseText);
        Alert.alert('ত্রুটি', 'সার্ভার রেসপন্স ত্রুটি। আবার চেষ্টা করুন।');
        setLoading(false);
        return;
      }

      if (data.success) {
        console.log('Success! Starting face verification...');
        setApplicationId(data.debug?.insert_id);
        setFaceImageUrl(data.face_image_url || '');
        setShowFaceVerification(true);
        Alert.alert('সফল', 'আবেদন সফলভাবে জমা হয়েছে! এখন মুখ যাচাইকরণ করুন।');
      } else {
        console.log('API Error:', data.message);
        Alert.alert('ত্রুটি', data.message || 'জমা দিতে ব্যর্থ।');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      if (error.name === 'AbortError') {
        Alert.alert('ত্রুটি', 'সময়সীমা শেষ হয়েছে — অনুগ্রহ করে আবার চেষ্টা করুন।');
      } else {
        Alert.alert('ত্রুটি', 'আবেদন জমা দিতে ব্যর্থ। নেটওয়ার্ক সংযোগ চেক করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.container}>
      {!showFaceVerification ? (
        <>
          <Text style={styles.title}>ড্রাইভিং লাইসেন্সের জন্য আবেদন</Text>
          {Platform.OS === 'web' && (
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          )}
          <TouchableOpacity style={styles.scanBtn} onPress={handleScanNid} disabled={scanning}>
            <Text style={styles.scanBtnText}>{scanning ? 'প্রক্রিয়াকরণ...' : 'জাতীয় পরিচয়পত্র স্ক্যান/আপলোড করুন'}</Text>
          </TouchableOpacity>

          {nidImage && (
            <>
              <Image source={{ uri: nidImage }} style={{ width: 200, height: 120, alignSelf: 'center', marginBottom: 10 }} />
              <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 10 }} onPress={() => setManualNidEntry(v => !v)}>
                <Text style={{ color: '#006a4e' }}>{manualNidEntry ? 'অটো-পূরণ সক্ষম (টিপুন আবার)' : 'হাতে NID লিখুন'}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Autofilled from OCR + DB */}
          <TextInput style={styles.input} placeholder="জাতীয় পরিচয়পত্র নম্বর" value={nidNumber} editable={manualNidEntry} onChangeText={setNidNumber} />
          {manualNidEntry && (
            <TouchableOpacity
              style={[styles.checkBtn, { alignSelf: 'center', paddingHorizontal: 16 }]}
              onPress={() => {
                const nidTrim = (nidNumber || '').toString().trim();
                if (!nidTrim || !/^[0-9]{10,17}$/.test(nidTrim)) {
                  Alert.alert('অবৈধ NID', 'অনুগ্রহ করে একটি বৈধ NID নম্বর লিখুন (10-17 সংখ্যার).');
                  return;
                }
                fetchNidDetails(nidTrim);
              }}
            >
              <Text style={styles.checkBtnText}>NID যাচাই করুন</Text>
            </TouchableOpacity>
          )}
          <TextInput style={styles.input} placeholder="পূর্ণ নাম" value={nidInfo?.name_bn || nidInfo?.name_en || ''} editable={false} />
          <TextInput style={styles.input} placeholder="পিতার নাম" value={nidInfo?.father_name || ''} editable={false} />
          <TextInput style={styles.input} placeholder="মাতার নাম" value={nidInfo?.mother_name || ''} editable={false} />
          <TextInput style={styles.input} placeholder="জন্ম তারিখ" value={nidInfo?.date_of_birth || ''} editable={false} />
          <TextInput style={styles.input} placeholder="লিঙ্গ" value={nidInfo?.gender || ''} editable={false} />

          <Text style={styles.label}>আপনার ছবি আপলোড করুন (মুখ যাচাইকরণের জন্য)</Text>
          {Platform.OS === 'web' && (
            <input
              type="file"
              accept="image/*"
              capture="user"
              ref={selfieInputRef}
              style={{ display: 'none' }}
              onChange={handleSelfieFileChange}
            />
          )}
          <TouchableOpacity style={styles.checkBtn} onPress={handleUploadSelfie}>
            <Text style={styles.checkBtnText}>সেলফি আপলোড করুন</Text>
          </TouchableOpacity>
          {selfie && (
            <>
              <Image source={{ uri: selfie }} style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 10 }} />
              <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 10 }} onPress={() => setUseSelfieAsReference(v => !v)}>
                <Text style={{ color: useSelfieAsReference ? '#c69214' : '#006a4e' }}>{useSelfieAsReference ? 'Selfie will be used as reference' : 'Use selfie as reference (if no NID image)'}</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.label}>লাইসেন্সের ধরন</Text>
          <Picker selectedValue={licenseType} style={styles.picker} onValueChange={setLicenseType}>
            <Picker.Item label="ধরন নির্বাচন করুন" value="" />
            <Picker.Item label="পেশাদার" value="professional" />
            <Picker.Item label="অপেশাদার" value="non professional" />
          </Picker>

          <Text style={styles.label}>যানবাহনের ধরন</Text>
          <Picker selectedValue={vehicleType} style={styles.picker} onValueChange={setVehicleType}>
            <Picker.Item label="যানবাহন নির্বাচন করুন" value="" />
            <Picker.Item label="মোটরসাইকেল" value="bike" />
            <Picker.Item label="গাড়ি" value="car" />
            <Picker.Item label="উভয়" value="both" />
          </Picker>

          {loading && <ActivityIndicator color="#006a4e" />}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitBtnText}>আবেদন জমা দিন</Text>
          </TouchableOpacity>
        </>
      ) : redirectingToPayment ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#006a4e" />
          <Text style={[styles.title, {marginTop: 20}]}>পেমেন্ট পেজে নিয়ে যাওয়া হচ্ছে...</Text>
          <Text style={{textAlign: 'center', marginTop: 10}}>অনুগ্রহ করে অপেক্ষা করুন</Text>
          </View>
        ) : (
        (Platform.OS === 'web' && WebFaceVerification) ? (
        <WebFaceVerification
          referenceImageUrl={faceImageUrl}
          onSuccess={async () => {
            try {
              // Show loading state
              setFaceVerificationComplete(true);
              console.log('Face verification successful, calling API...');
              console.log('Application ID:', applicationId);
              console.log('NID Number:', nidNumber);

              const response = await fetch(`${API_URL}/complete_face_verification.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  application_id: applicationId,
                  user_id: user.id, 
                  nid_number: nidNumber 
                }),
              });

              console.log('API Response status:', response.status);
              const result = await response.json();
              console.log('API Response:', result);

              if (result.success) {
                setFaceVerificationComplete(true);
                setRedirectingToPayment(true);
                alert('মুখ যাচাইকরণ সম্পন্ন! ২ সেকেন্ডে পেমেন্ট পেজে নিয়ে যাওয়া হবে...');
                const paymentUrl = `http://192.168.0.106/brta_mob/gateway/license_payment_start.php?application_id=${applicationId}&user_id=1`;
                setTimeout(() => {
                  // In web we can navigate
                  if (typeof window !== 'undefined' && window.location) window.location.href = paymentUrl;
                }, 2000);
              } else {
                console.error('API Error:', result);
                alert('মুখ যাচাইকরণ ব্যর্থ: ' + (result.message || 'অজানা ত্রুটি'));
              }
            } catch (error) {
              console.error('Face verification error:', error);
              alert('মুখ যাচাইকরণ ব্যর্থ। আবার চেষ্টা করুন।');
            }
          }}
        />
        ) : (
          <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Face verification is only available in the web build.</Text>
            <Text style={{ marginBottom: 12 }}>This device is running the native/mobile build which cannot run the web-based camera & face-api flow. You can:</Text>
            <TouchableOpacity
              style={[styles.checkBtn, { alignSelf: 'center', marginBottom: 10 }]}
              onPress={() => {
                const webRoot = API_URL.replace('/api', '');
                Linking.openURL(webRoot).catch(err => Alert.alert('Could not open browser', err.message || String(err)));
              }}
            >
              <Text style={styles.checkBtnText}>Open web app for face verification</Text>
            </TouchableOpacity>

            {/* New: Open payment inside app (WebView) or fallback to browser */}
            <TouchableOpacity
              style={[styles.checkBtn, { alignSelf: 'center', marginBottom: 10 }]}
              onPress={() => openPaymentInApp()}
            >
              <Text style={styles.checkBtnText}>Open payment in app (WebView)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scanBtn, { alignSelf: 'center' }]}
              onPress={() => setShowFaceVerification(false)}
            >
              <Text style={styles.scanBtnText}>Back to application</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
    </ScrollView>
    <PaymentWebViewModal visible={showPaymentWebview} url={paymentWebviewUrl} onClose={() => setShowPaymentWebview(false)} />
    </>
  );
}

// WebView modal component placed after main component to avoid errors when module missing
function PaymentWebViewModal({ visible, url, onClose }) {
  if (!visible) return null;
  let WebView = null;
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    WebView = null;
  }

  if (!WebView) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ marginBottom: 12 }}>In-app WebView is not installed.</Text>
          <Text style={{ marginBottom: 20 }}>Run `expo install react-native-webview` to enable in-app payments, or open in browser.</Text>
          <TouchableOpacity style={[styles.checkBtn, { paddingHorizontal: 20 }]} onPress={() => { Linking.openURL(url).catch(err => Alert.alert('Could not open browser', String(err))); }}>
            <Text style={styles.checkBtnText}>Open in browser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.scanBtn, { marginTop: 12 }]} onPress={onClose}><Text style={styles.scanBtnText}>Close</Text></TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: url }}
          startInLoadingState
          onNavigationStateChange={(navState) => {
            const u = navState.url || '';
            // Detect SSLCommerz success/fail/cancel pages
            if (u.includes('sslcommerce_success.php')) {
              Alert.alert('Payment Complete', 'আপনার পেমেন্ট সফল হয়েছে।');
              onClose();
            } else if (u.includes('sslcommerce_fail.php') || u.includes('sslcommerce_cancel.php')) {
              Alert.alert('Payment Not Completed', 'Payment was cancelled or failed.');
            }
          }}
        />
        <TouchableOpacity style={{ position: 'absolute', top: 40, right: 12, backgroundColor: '#fff', padding: 8, borderRadius: 6 }} onPress={onClose}>
          <Text style={{ fontWeight: 'bold' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f4f1ea'
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#f4f1ea'
  },
  container: { backgroundColor: '#f4f1ea', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#006a4e', marginBottom: 20, textAlign: 'center' },
  scanBtn: { backgroundColor: '#006a4e', padding: 12, borderRadius: 8, marginBottom: 10 },
  scanBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderColor: '#c69214', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  checkBtn: { backgroundColor: '#c69214', padding: 10, borderRadius: 8, marginBottom: 10 },
  checkBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  label: { color: '#006a4e', fontWeight: 'bold', marginTop: 10 },
  picker: { backgroundColor: '#fff', borderColor: '#c69214', borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  submitBtn: { backgroundColor: '#da291c', padding: 14, borderRadius: 8, marginTop: 20 },
  submitBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});

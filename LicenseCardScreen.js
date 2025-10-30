import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Dimensions,
  Linking
} from 'react-native';

const API_URL = 'http://192.168.0.106/brta_mob';
const { width } = Dimensions.get('window');

export default function LicenseCardScreen({ navigation, route }) {
  const { application, user } = route.params;
  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);

  console.log('=== LicenseCardScreen Data ===');
  console.log('Application:', JSON.stringify(application, null, 2));
  console.log('Full Name:', application.nid_info?.full_name);
  console.log('Email:', application.contact_info?.email);
  console.log('Photo Path:', application.selfie_image_path);

  const downloadAsPDF = async () => {
    if (Platform.OS === 'web') {
      // For web, open a new window with printable version
      const printWindow = window.open('', '_blank');
      const frontCard = document.getElementById('front-card');
      const backCard = document.getElementById('back-card');
      
      if (printWindow && frontCard && backCard) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Driving License - ${application.license.license_number}</title>
              <style>
                @page {
                  size: A4;
                  margin: 20mm;
                }
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  background: #f5f5f5;
                }
                .page-break {
                  page-break-after: always;
                }
                .license-card {
                  width: 85.6mm;
                  height: 53.98mm;
                  background: linear-gradient(135deg, #006a4e 0%, #00a86b 100%);
                  border-radius: 8px;
                  padding: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                  margin: 20px auto;
                  position: relative;
                  overflow: hidden;
                }
                .license-card::before {
                  content: '';
                  position: absolute;
                  top: -50%;
                  right: -50%;
                  width: 200%;
                  height: 200%;
                  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                }
                .card-header {
                  background: rgba(255,255,255,0.95);
                  border-radius: 6px;
                  padding: 8px;
                  margin-bottom: 8px;
                  text-align: center;
                }
                .card-title {
                  font-size: 11px;
                  font-weight: bold;
                  color: #006a4e;
                  margin: 0;
                }
                .card-subtitle {
                  font-size: 8px;
                  color: #666;
                  margin: 2px 0 0 0;
                }
                .card-content {
                  background: rgba(255,255,255,0.95);
                  border-radius: 6px;
                  padding: 10px;
                }
                .license-row {
                  display: flex;
                  gap: 10px;
                  margin-bottom: 8px;
                }
                .photo-section {
                  flex-shrink: 0;
                }
                .photo-box {
                  width: 80px;
                  height: 100px;
                  border: 2px solid #006a4e;
                  border-radius: 4px;
                  background: #f0f0f0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                }
                .photo {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
                .info-section {
                  flex: 1;
                }
                .info-item {
                  margin-bottom: 5px;
                }
                .info-label {
                  font-size: 7px;
                  color: #666;
                  margin: 0;
                }
                .info-value {
                  font-size: 9px;
                  font-weight: bold;
                  color: #000;
                  margin: 0;
                }
                .license-number-box {
                  background: #006a4e;
                  color: white;
                  padding: 6px;
                  border-radius: 4px;
                  text-align: center;
                  margin-top: 8px;
                }
                .license-number {
                  font-size: 12px;
                  font-weight: bold;
                  letter-spacing: 1px;
                  margin: 0;
                }
                .back-info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 8px;
                }
                .qr-section {
                  text-align: center;
                  padding: 10px;
                  background: white;
                  border-radius: 6px;
                  margin-top: 8px;
                }
                .qr-placeholder {
                  width: 80px;
                  height: 80px;
                  background: #f0f0f0;
                  border: 2px dashed #006a4e;
                  margin: 0 auto 5px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  color: #666;
                }
                .footer-text {
                  font-size: 7px;
                  text-align: center;
                  color: #666;
                  margin-top: 8px;
                }
                @media print {
                  body {
                    background: white;
                  }
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              <h2 style="text-align: center; color: #006a4e; margin: 20px 0;">বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ - ড্রাইভিং লাইসেন্স</h2>
              
              <!-- Front Card -->
              <div class="license-card" style="page-break-after: always;">
                <div class="card-header">
                  <h1 class="card-title">🇧🇩 বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ</h1>
                  <p class="card-subtitle">Bangladesh Road Transport Authority</p>
                  <p class="card-subtitle" style="font-weight: bold;">DRIVING LICENSE</p>
                </div>
                <div class="card-content">
                  <div class="license-row">
                    <div class="photo-section">
                      <div class="photo-box">
                        ${application.selfie_image_path ? 
                          `<img src="http://192.168.0.106:8081/public/uploads/license_applications/${application.selfie_image_path}" alt="Photo" class="photo" crossorigin="anonymous" onerror="this.parentElement.innerHTML='<span style=\\'font-size: 10px; color: #999;\\'>Photo</span>'" />` : 
                          '<span style="font-size: 10px; color: #999;">Photo</span>'}
                      </div>
                    </div>
                    <div class="info-section">
                      <div class="info-item">
                        <p class="info-label">নাম / Name</p>
                        <p class="info-value">${application.nid_info?.full_name || application.contact_info?.email?.split('@')[0] || 'User'}</p>
                      </div>
                      <div class="info-item">
                        <p class="info-label">লাইসেন্স নম্বর / License No</p>
                        <p class="info-value">${application.license.license_number}</p>
                      </div>
                      <div class="info-item">
                        <p class="info-label">লাইসেন্সের ধরন / Type</p>
                        <p class="info-value">${application.license_type.toUpperCase()}</p>
                      </div>
                      <div class="info-item">
                        <p class="info-label">যানবাহন / Vehicle</p>
                        <p class="info-value">${application.vehicle_type.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                  <div class="license-number-box">
                    <p class="license-number">${application.license.license_number}</p>
                  </div>
                </div>
              </div>
              
              <!-- Back Card -->
              <div class="license-card">
                <div class="card-header">
                  <h1 class="card-title">লাইসেন্স তথ্য / License Information</h1>
                </div>
                <div class="card-content">
                  <div class="back-info-grid">
                    <div class="info-item">
                      <p class="info-label">লাইসেন্সের ধরন / License Type</p>
                      <p class="info-value">${application.license_type.toUpperCase()}</p>
                    </div>
                    <div class="info-item">
                      <p class="info-label">যানবাহনের ধরন / Vehicle Type</p>
                      <p class="info-value">${application.vehicle_type.toUpperCase()}</p>
                    </div>
                    <div class="info-item">
                      <p class="info-label">ইস্যুর তারিখ / Issue Date</p>
                      <p class="info-value">${application.license.issue_date}</p>
                    </div>
                    <div class="info-item">
                      <p class="info-label">মেয়াদ উত্তীর্ণ / Expiry Date</p>
                      <p class="info-value">${application.license.expiry_date}</p>
                    </div>
                    <div class="info-item">
                      <p class="info-label">স্ট্যাটাস / Status</p>
                      <p class="info-value">${application.license.status.toUpperCase()}</p>
                    </div>
                    <div class="info-item">
                      <p class="info-label">লাইসেন্স নম্বর / License Number</p>
                      <p class="info-value" style="font-family: monospace; font-weight: bold;">${application.license.license_number}</p>
                    </div>
                  </div>
                  
                  <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center;">
                    <p style="font-size: 10px; margin: 0; color: #006a4e; font-weight: bold;">
                      Bangladesh Road Transport Authority<br>
                      বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ
                    </p>
                  </div>
                </div>
                <p class="footer-text">This is a government issued document. Misuse is punishable by law.</p>
              </div>
              
              <div style="text-align: center; margin-top: 20px;" class="no-print">
                <button onclick="window.print()" style="padding: 10px 20px; background: #006a4e; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                  Print / Download PDF
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;">
                  Close
                </button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      // Mobile: dynamically import expo-print and expo-sharing at runtime
      try {
        const Print = await import('expo-print');
        const Sharing = await import('expo-sharing');

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Driving License - ${application.license.license_number}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5; }
                .license-card { width: 100%; max-width: 800px; margin: 0 auto 20px; background: linear-gradient(135deg, #006a4e 0%, #00a86b 100%); border-radius: 8px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .card-header { background: white; border-radius: 6px; padding: 8px; margin-bottom: 8px; text-align: center; }
                .card-title { font-size: 18px; font-weight: bold; color: #006a4e; margin: 0; }
                .card-subtitle { font-size: 12px; color: #666; margin: 2px 0 0 0; }
                .card-content { background: white; border-radius: 6px; padding: 10px; }
                .license-row { display: flex; gap: 16px; align-items: flex-start; }
                .photo-box { width: 120px; height: 150px; border: 2px solid #006a4e; border-radius: 6px; overflow: hidden; display:flex; align-items:center; justify-content:center; background:#f0f0f0 }
                .photo { width: 100%; height: 100%; object-fit: cover; }
                .info-section { flex: 1; }
                .info-label { font-size: 10px; color: #666; margin: 0; }
                .info-value { font-size: 14px; font-weight: bold; margin: 0 0 8px 0; }
                .license-number { background: #006a4e; color: white; padding: 8px; border-radius: 6px; display:inline-block; margin-top:8px; font-weight:bold; }
                .footer { font-size: 10px; color: #666; text-align:center; margin-top:12px; }
              </style>
            </head>
            <body>
              <h2 style="text-align:center; color:#006a4e;">বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ - Driving License</h2>
              <div class="license-card">
                <div class="card-header">
                  <div class="card-title">🇧🇩 বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ</div>
                  <div class="card-subtitle">Bangladesh Road Transport Authority</div>
                  <div class="card-subtitle" style="font-weight:bold;">DRIVING LICENSE</div>
                </div>
                <div class="card-content">
                  <div class="license-row">
                    <div class="photo-box">
                      ${application.selfie_image_path ? `<img class="photo" src="http://192.168.0.106:8081/public/uploads/license_applications/${application.selfie_image_path}" />` : 'No Photo'}
                    </div>
                    <div class="info-section">
                      <p class="info-label">নাম / Name</p>
                      <p class="info-value">${application.nid_info?.full_name || application.contact_info?.email?.split('@')[0] || 'User'}</p>
                      <p class="info-label">লাইসেন্স নম্বর / License No</p>
                      <p class="info-value">${application.license.license_number}</p>
                      <p class="info-label">লাইসেন্সের ধরন / Type</p>
                      <p class="info-value">${application.license_type.toUpperCase()}</p>
                      <p class="info-label">যানবাহন / Vehicle</p>
                      <p class="info-value">${application.vehicle_type.toUpperCase()}</p>
                    </div>
                  </div>
                  <div style="text-align:center; margin-top:12px;">
                    <span class="license-number">${application.license.license_number}</span>
                  </div>
                </div>
              </div>
              <div class="footer">This is a government issued document. Misuse is punishable by law.</div>
            </body>
          </html>
        `;

        const { uri } = await Print.printToFileAsync({ html });
        // On iOS/Android share the generated file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, { dialogTitle: 'Share Driving License PDF' });
        } else {
          Alert.alert('PDF Ready', 'PDF generated at: ' + uri);
        }
      } catch (err) {
        console.error('PDF generation error:', err);
        Alert.alert('Error', 'Unable to generate PDF. Make sure expo-print and expo-sharing are installed in your project.');
      }
    }
  };

  const getLicenseTypeBangla = (type) => {
    const typeMap = {
      'motorcycle': 'মোটরসাইকেল',
      'car': 'গাড়ি',
      'commercial': 'বাণিজ্যিক',
      'professional': 'পেশাদার'
    };
    return typeMap[type] || type;
  };

  const getVehicleTypeBangla = (type) => {
    const typeMap = {
      'motorcycle': 'মোটরসাইকেল',
      'car': 'গাড়ি',
      'bus': 'বাস',
      'truck': 'ট্রাক',
      'microbus': 'মাইক্রোবাস',
      'cng': 'সিএনজি',
      'other': 'অন্যান্য'
    };
    return typeMap[type] || type;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ড্রাইভিং লাইসেন্স</Text>
        <Text style={styles.headerSubtitle}>License Number: {application.license.license_number}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadAsPDF}>
          <Text style={styles.downloadButtonText}>📄 PDF ডাউনলোড করুন</Text>
        </TouchableOpacity>
      </View>

      {/* Front Card */}
      <View style={styles.cardContainer} nativeID="front-card">
        <Text style={styles.cardLabel}>সামনের অংশ (Front)</Text>
        <View style={styles.licenseCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🇧🇩 বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ</Text>
            <Text style={styles.cardSubtitle}>Bangladesh Road Transport Authority</Text>
            <Text style={[styles.cardSubtitle, styles.bold]}>DRIVING LICENSE</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.licenseRow}>
              <View style={styles.photoSection}>
                <View style={styles.photoBox}>
                  {application.selfie_image_path ? (
                    <Image
                      source={{ uri: `${API_URL}/public/uploads/license_applications/${application.selfie_image_path}` }}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.noPhotoText}>No Photo</Text>
                  )}
                </View>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>নাম / Name</Text>
                  <Text style={styles.infoValue}>
                    {application.nid_info?.full_name || application.contact_info?.email?.split('@')[0] || 'User'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>লাইসেন্স নম্বর / License No</Text>
                  <Text style={styles.infoValue}>{application.license.license_number}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>লাইসেন্সের ধরন / Type</Text>
                  <Text style={styles.infoValue}>{application.license_type.toUpperCase()}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>যানবাহন / Vehicle</Text>
                  <Text style={styles.infoValue}>{application.vehicle_type.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            <View style={styles.licenseNumberBox}>
              <Text style={styles.licenseNumber}>{application.license.license_number}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Back Card */}
      <View style={styles.cardContainer} nativeID="back-card">
        <Text style={styles.cardLabel}>পেছনের অংশ (Back)</Text>
        <View style={styles.licenseCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>লাইসেন্স তথ্য / License Information</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.backInfoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>লাইসেন্সের ধরন / License Type</Text>
                <Text style={styles.infoValue}>{getLicenseTypeBangla(application.license_type)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>যানবাহনের ধরন / Vehicle Type</Text>
                <Text style={styles.infoValue}>{getVehicleTypeBangla(application.vehicle_type)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>ইস্যুর তারিখ / Issue Date</Text>
                <Text style={styles.infoValue}>{application.license.issue_date}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>মেয়াদ উত্তীর্ণ / Expiry Date</Text>
                <Text style={styles.infoValue}>{application.license.expiry_date}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>স্ট্যাটাস / Status</Text>
                <Text style={styles.infoValue}>{application.license.status.toUpperCase()}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>লাইসেন্স নম্বর / License Number</Text>
                <Text style={[styles.infoValue, { fontFamily: 'monospace', fontWeight: 'bold' }]}>
                  {application.license.license_number}
                </Text>
              </View>
            </View>

            <View style={styles.brtaSection}>
              <Text style={styles.brtaText}>
                Bangladesh Road Transport Authority{'\n'}
                বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ
              </Text>
            </View>
          </View>

          <Text style={styles.footerText}>
            This is a government issued document. Misuse is punishable by law.
          </Text>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea',
  },
  header: {
    backgroundColor: '#006a4e',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#c69214',
    fontSize: 14,
  },
  actionButtons: {
    padding: 16,
  },
  downloadButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
    padding: 16,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006a4e',
    marginBottom: 12,
    textAlign: 'center',
  },
  licenseCard: {
    backgroundColor: 'linear-gradient(135deg, #006a4e 0%, #00a86b 100%)',
    backgroundColor: '#006a4e',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006a4e',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  cardContent: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    padding: 12,
  },
  licenseRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  photoSection: {
    flexShrink: 0,
  },
  photoBox: {
    width: 100,
    height: 120,
    borderWidth: 2,
    borderColor: '#006a4e',
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  noPhotoText: {
    fontSize: 12,
    color: '#999',
  },
  infoSection: {
    flex: 1,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 9,
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  licenseNumberBox: {
    backgroundColor: '#006a4e',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  licenseNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  backInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  brtaSection: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  brtaText: {
    fontSize: 10,
    color: '#006a4e',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#fff',
    marginTop: 12,
  },
  bottomPadding: {
    height: 40,
  },
});

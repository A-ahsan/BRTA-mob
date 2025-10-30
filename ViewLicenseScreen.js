import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Image
} from 'react-native';

const API_URL = 'http://192.168.0.106/brta_mob/api';

export default function ViewLicenseScreen({ navigation, route }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingLicense, setGeneratingLicense] = useState(null);
  const user = route?.params?.user || {};
  
  // Debug: Log the user object
  console.log('ViewLicense received user:', user);
  console.log('User ID:', user.id);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('Fetching applications for user ID:', user.id);
      const url = `${API_URL}/get_user_applications.php?user_id=${user.id}`;
      console.log('API URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        setApplications(data.applications);
        console.log('Applications loaded:', data.applications.length);
      } else {
        console.error('API Error:', data.message);
        Alert.alert('ত্রুটি', data.message || 'আবেদন লোড করতে ব্যর্থ');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      Alert.alert('ত্রুটি', 'আবেদন লোড করতে ব্যর্থ হয়েছে: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateLicense = async (applicationId) => {
    try {
      setGeneratingLicense(applicationId);

      const response = await fetch(`${API_URL}/generate_license.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_id: applicationId }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('সফল', 'আপনার ড্রাইভিং লাইসেন্স সফলভাবে তৈরি হয়েছে!');
        fetchApplications(); // Refresh the list
      } else {
        Alert.alert('ত্রুটি', data.message || 'লাইসেন্স তৈরি করতে ব্যর্থ');
      }
    } catch (error) {
      console.error('Error generating license:', error);
      Alert.alert('ত্রুটি', 'লাইসেন্স তৈরি করতে ব্যর্থ হয়েছে');
    } finally {
      setGeneratingLicense(null);
    }
  };

  const viewLicense = (application) => {
    navigation.navigate('LicenseCard', { 
      application: application,
      user: user 
    });
  };

  const getStatusBangla = (status) => {
    const statusMap = {
      'pending': 'মুলতুবি',
      'under_review': 'পর্যালোচনাধীন',
      'approved': 'অনুমোদিত',
      'rejected': 'প্রত্যাখ্যাত',
      'payment_pending': 'পেমেন্ট বাকি',
      'completed': 'সম্পন্ন'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusBangla = (status) => {
    const statusMap = {
      'pending': 'বাকি',
      'processing': 'প্রক্রিয়াধীন',
      'completed': 'সম্পন্ন',
      'failed': 'ব্যর্থ',
      'refunded': 'ফেরত'
    };
    return statusMap[status] || status;
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#006a4e" />
        <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>আমার আবেদন সমূহ</Text>
        <Text style={styles.headerSubtitle}>
          মোট আবেদন: {applications.length}
        </Text>
        <Text style={styles.headerSubtitle}>
          User ID: {user.id || 'Not set'}
        </Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchApplications}
        >
          <Text style={styles.refreshButtonText}>🔄 রিফ্রেশ করুন</Text>
        </TouchableOpacity>
      </View>

      {applications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>কোন আবেদন পাওয়া যায়নি</Text>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => navigation.navigate('DrivingLicense')}
          >
            <Text style={styles.applyButtonText}>নতুন আবেদন করুন</Text>
          </TouchableOpacity>
        </View>
      ) : (
        applications.map((app) => (
          <View key={app.application_id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.applicationId}>{app.application_id}</Text>
              <View style={[
                styles.statusBadge,
                app.application_status === 'completed' && styles.statusCompleted,
                app.application_status === 'pending' && styles.statusPending,
                app.application_status === 'rejected' && styles.statusRejected
              ]}>
                <Text style={styles.statusText}>
                  {getStatusBangla(app.application_status)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>নাম:</Text>
              <Text style={styles.value}>{app.nid_info.full_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>লাইসেন্স ধরন:</Text>
              <Text style={styles.value}>{getLicenseTypeBangla(app.license_type)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>পেমেন্ট স্ট্যাটাস:</Text>
              <Text style={[
                styles.value,
                app.payment_status === 'completed' ? styles.paymentCompleted : styles.paymentPending
              ]}>
                {getPaymentStatusBangla(app.payment_status)}
              </Text>
            </View>

            {app.payment_amount && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>পেমেন্ট:</Text>
                <Text style={styles.value}>৳{app.payment_amount}</Text>
              </View>
            )}

            {app.license && (
              <View style={styles.licenseInfo}>
                <Text style={styles.licenseTitle}>🎫 লাইসেন্স তথ্য</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>লাইসেন্স নম্বর:</Text>
                  <Text style={styles.licenseNumber}>{app.license.license_number}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>ইস্যু তারিখ:</Text>
                  <Text style={styles.value}>{app.license.issue_date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>মেয়াদ উত্তীর্ণ:</Text>
                  <Text style={styles.value}>{app.license.expiry_date}</Text>
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              {app.can_generate_license && (
                <TouchableOpacity
                  style={[styles.button, styles.generateButton]}
                  onPress={() => generateLicense(app.application_id)}
                  disabled={generatingLicense === app.application_id}
                >
                  {generatingLicense === app.application_id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>লাইসেন্স তৈরি করুন</Text>
                  )}
                </TouchableOpacity>
              )}

              {app.license && (
                <TouchableOpacity
                  style={[styles.button, styles.viewButton]}
                  onPress={() => viewLicense(app)}
                >
                  <Text style={styles.buttonText}>লাইসেন্স দেখুন</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f1ea',
  },
  loadingText: {
    marginTop: 10,
    color: '#006a4e',
    fontSize: 16,
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
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: '#00a86b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#006a4e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  applicationId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006a4e',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#ccc',
  },
  statusCompleted: {
    backgroundColor: '#4caf50',
  },
  statusPending: {
    backgroundColor: '#ff9800',
  },
  statusRejected: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  paymentCompleted: {
    color: '#4caf50',
  },
  paymentPending: {
    color: '#ff9800',
  },
  licenseInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  licenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006a4e',
    marginBottom: 8,
  },
  licenseNumber: {
    fontSize: 14,
    color: '#006a4e',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  buttonContainer: {
    marginTop: 12,
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  generateButton: {
    backgroundColor: '#4caf50',
  },
  viewButton: {
    backgroundColor: '#006a4e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

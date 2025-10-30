import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
// import logo from assets if using expo or require if using react-native-cli
import { AuthContext } from './navigation'; // adjust if you use a different context

export default function DashboardScreen({ navigation, route }) {
  const user = route?.params?.user || { full_name: 'User', user_type: 'general' };
  const logout = () => navigation.navigate('Login');
  
  // Add debug log
  console.log('Dashboard user object:', user);

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>BRTA সেবা পোর্টাল</Text>
          <Text style={styles.welcome}>স্বাগতম, {user.full_name || user.username || 'User'}!</Text>
          <Text style={styles.type}>ধরন: {user.user_type || 'general'}</Text>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}><Text style={styles.menuText}>হোম</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DrivingLicense', { user })}>
            <Text style={styles.menuText}>ড্রাইভিং লাইসেন্স আবেদন</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.highlightedItem]} onPress={() => navigation.navigate('ViewLicense', { user })}><Text style={styles.menuText}>🎫 আমার লাইসেন্স দেখুন</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('VehicleRegistration')}><Text style={styles.menuText}>যানবাহন নিবন্ধন</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('RoutePermit')}><Text style={styles.menuText}>রুট পারমিট</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FitnessCertificate')}><Text style={styles.menuText}>ফিটনেস সার্টিফিকেট</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TaxToken')}><Text style={styles.menuText}>ট্যাক্স টোকেন</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('LearnerLicense')}><Text style={styles.menuText}>লার্নার লাইসেন্স</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('OnlinePayment')}><Text style={styles.menuText}>অনলাইন পেমেন্ট</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FAQ')}><Text style={styles.menuText}>❓ সাহায্য ও FAQ</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={logout}><Text style={styles.menuText}>লগআউট</Text></TouchableOpacity>
        </View>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>BRTA ডিজিটাল সেবায় স্বাগতম</Text>
          <Text style={styles.heroDesc}>আপনার সকল সড়ক পরিবহন প্রয়োজনের জন্য দ্রুত, নিরাপদ এবং সুবিধাজনক অনলাইন সেবা</Text>
        </View>
      </View>
    </ScrollView>
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
  container: {
    backgroundColor: '#f4f1ea'
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#006a4e',
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcome: {
    color: '#fff',
    fontSize: 16,
  },
  type: {
    color: '#c69214',
    fontSize: 14,
    marginBottom: 8,
  },
  menu: {
    marginVertical: 16,
    marginHorizontal: 24,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#006a4e',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightedItem: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  menuText: {
    color: '#006a4e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logout: {
    backgroundColor: '#da291c',
  },
  hero: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 24,
    shadowColor: '#006a4e',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  heroTitle: {
    color: '#006a4e',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroDesc: {
    color: '#1e1e1e',
    fontSize: 14,
    textAlign: 'center',
  },
});

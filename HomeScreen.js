function StatItem({ number, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
function ServiceCard({ icon, title, desc }) {
  return (
    <View style={styles.serviceCard}>
      <Text style={styles.serviceIcon}>{icon}</Text>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDesc}>{desc}</Text>
      <TouchableOpacity style={styles.serviceBtn}>
        <Text style={styles.serviceBtnText}>শুরু করুন</Text>
      </TouchableOpacity>
    </View>
  );
}

function Feature({ icon, text }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.title}>BRTA সেবা পোর্টাল</Text>
            <Text style={styles.subtitle}>বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ</Text>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>লগইন / সাইন আপ</Text>
          </TouchableOpacity>
        </View>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>ডিজিটাল বাংলাদেশে স্বাগতম</Text>
          <Text style={styles.heroSubtitle}>দ্রুত, নিরাপদ এবং সুবিধাজনক সড়ক পরিবহন সেবা অনলাইনে অভিজ্ঞতা নিন</Text>
          <View style={styles.features}>
            <Feature icon="🚗" text="ডিজিটাল লাইসেন্স সেবা" />
            <Feature icon="📱" text="অনলাইন যানবাহন নিবন্ধন" />
            <Feature icon="⚡" text="দ্রুত ও নিরাপদ প্রক্রিয়াকরণ" />
          </View>
          <TouchableOpacity style={styles.calculatorBtn} onPress={() => navigation.navigate('Calculator')}>
            <Text style={styles.calculatorText}>🧮 BRTA ২.০ ক্যালকুলেটর - সঠিক ফি গণনা করুন</Text>
          </TouchableOpacity>
        </View>
        {/* Quick Services */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>দ্রুত সেবা</Text>
          <View style={styles.servicesGrid}>
            <ServiceCard icon="🅔" title="ড্রাইভিং লাইসেন্স" desc="নতুন লাইসেন্সের জন্য আবেদন বা বিদ্যমান নবায়ন" />
            <ServiceCard icon="🚗" title="যানবাহন নিবন্ধন" desc="দ্রুত অনলাইনে আপনার যানবাহন নিবন্ধন করুন" />
            <ServiceCard icon="💳" title="কর ও ফি" desc="যানবাহন কর এবং অন্যান্য ফি অনলাইনে পরিশোধ করুন" />
            <ServiceCard icon="📋" title="আবেদনের অবস্থা" desc="অনলাইনে আপনার আবেদনের অবস্থা ট্র্যাক করুন" />
            <ServiceCard icon="🧮" title="BRTA 2.0 ক্যালকুলেটর" desc="সকল BRTA সেবার সঠিক ফি গণনা করুন" />
            <ServiceCard icon="📊" title="রিপোর্ট ও বিশ্লেষণ" desc="বিশ্তৃত রিপোর্ট এবং বিশ্লেষণ দেখুন" />
          </View>
        </View>
        {/* Statistics */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatItem number="2.5M+" label="লাইসেন্সপ্রাপ্ত চালক" />
            <StatItem number="1.8M+" label="নিবন্ধিত যানবাহন" />
            <StatItem number="95%" label="ডিজিটাল সেবা" />
            <StatItem number="24/7" label="অনলাইন সহায়তা" />
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© ২০২৫ বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ। সকল অধিকার সংরক্ষিত।</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  logo: { width: 48, height: 48, marginRight: 12, borderRadius: 24, borderWidth: 2, borderColor: '#006a4e' }, // Green border
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#006a4e' }, // Website green
  subtitle: { fontSize: 14, color: '#6b6b6b' }, // Website cool gray
  loginBtn: { backgroundColor: '#006a4e', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 }, // Website green
  loginText: { color: '#fff', fontWeight: 'bold' },
  hero: { padding: 20, backgroundColor: 'linear-gradient(135deg, #006a4e 0%, #004d3a 100%)', alignItems: 'center' }, // Website hero gradient
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#006a4e', marginBottom: 8 }, // Green text
  heroSubtitle: { fontSize: 14, color: '#006a4e', marginBottom: 16, textAlign: 'center', opacity: 0.9 }, // Green text
  features: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  featureItem: { alignItems: 'center', marginHorizontal: 10, backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12 },
  featureIcon: { fontSize: 28, color: '#da291c' }, // Website red accent
  featureText: { fontSize: 12, color: '#fff' }, // White text
  calculatorBtn: { backgroundColor: '#da291c', padding: 10, borderRadius: 20, marginTop: 8 }, // Website red accent
  calculatorText: { color: '#fff', fontWeight: 'bold' },
  servicesSection: { padding: 20, backgroundColor: '#f4f1ea' }, // Warm beige
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#006a4e', marginBottom: 12 }, // Website green
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: { width: '48%', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, elevation: 2, borderColor: '#006a4e', borderWidth: 1 }, // Green border
  serviceIcon: { fontSize: 28, marginBottom: 6, color: '#006a4e' }, // Green
  serviceTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e1e1e' }, // Charcoal
  serviceDesc: { fontSize: 12, color: '#6b6b6b', marginBottom: 8 }, // Cool gray
  serviceBtn: { backgroundColor: '#006a4e', padding: 6, borderRadius: 16, alignItems: 'center' }, // Green
  serviceBtnText: { color: '#fff', fontSize: 12 },
  statsSection: { padding: 20, backgroundColor: '#006a4e' }, // Green
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', width: '24%' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#c69214' }, // Gold
  statLabel: { fontSize: 12, color: '#fff' }, // White
  footer: { padding: 16, backgroundColor: '#1e1e1e', alignItems: 'center', borderTopWidth: 1, borderColor: '#444' }, // Charcoal
  footerText: { fontSize: 12, color: '#c69214' }, // Gold
});

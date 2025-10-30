import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { API_BASE_URL } from './config';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=signup&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&full_name=${encodeURIComponent(fullName)}&password=${encodeURIComponent(password)}`,
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('সফল', 'অ্যাকাউন্ট তৈরি হয়েছে');
        navigation.navigate('Login');
      } else {
        Alert.alert('ত্রুটি', data.message || 'সাইন আপ ব্যর্থ হয়েছে');
      }
    } catch (e) {
      Alert.alert('ত্রুটি', 'নেটওয়ার্ক সমস্যা');
    }
    setLoading(false);
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>সাইন আপ</Text>
      <TextInput
        style={styles.input}
        placeholder="ব্যবহারকারীর নাম"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="ইমেইল"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="ফোন নম্বর"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="পূর্ণ নাম"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="পাসওয়ার্ড"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'অপেক্ষা করুন...' : 'সাইন আপ করুন'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>লগইন করুন</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f4f1ea'
  },
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f4f1ea', 
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#006a4e', marginBottom: 24 },
  input: { width: '80%', padding: 12, borderWidth: 1, borderColor: '#006a4e', borderRadius: 8, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#006a4e', padding: 12, borderRadius: 8, width: '80%', alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#da291c', marginTop: 8, fontWeight: 'bold' },
});
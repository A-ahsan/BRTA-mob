import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { API_BASE_URL } from './config';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Add a timeout to the fetch to avoid hanging
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s

      const res = await fetch(`${API_BASE_URL}auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&user_type=user`,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        // Non-2xx HTTP status
        const text = await res.text();
        console.log('Login API non-ok response:', res.status, text);
        Alert.alert('ত্রুটি', `সার্ভার ভুল: ${res.status}`);
        return;
      }

      const data = await res.json();
      console.log('Login API response:', data);
      if (data.success) {
        // Ensure user has an id field
        if (!data.id && !data.user_id) {
          Alert.alert('ত্রুটি', 'লগইন প্রতিক্রিয়ায় ব্যবহারকারী আইডি পাওয়া যায়নি');
          return;
        }
        const userWithId = { ...data, id: data.id || data.user_id };
        console.log('User object with ID:', userWithId);
        Alert.alert('সফল', 'লগইন সফল হয়েছে');
        navigation.navigate('Dashboard', { user: userWithId });
      } else {
        Alert.alert('লগইন ব্যর্থ', data.message || 'লগইন ব্যর্থ হয়েছে');
      }
    } catch (e) {
      console.error('Login error:', e);
      if (e.name === 'AbortError') {
        Alert.alert('ত্রুটি', 'সময়সীমা শেষ হয়েছে — অনুগ্রহ করে আবার চেষ্টা করুন');
      } else {
        Alert.alert('ত্রুটি', 'নেটওয়ার্ক সমস্যা বা সার্ভার অপ্রাপ্য');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.container}>
        <Text style={styles.title}>লগইন</Text>
        <TextInput
          style={styles.input}
          placeholder="ব্যবহারকারীর নাম"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="পাসওয়ার্ড"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'অপেক্ষা করুন...' : 'লগইন করুন'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>নতুন অ্যাকাউন্ট তৈরি করুন</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#f4f1ea'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f4f1ea',
    paddingHorizontal: 20
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#006a4e', marginBottom: 24 },
  input: { width: '80%', padding: 12, borderWidth: 1, borderColor: '#006a4e', borderRadius: 8, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#006a4e', padding: 12, borderRadius: 8, width: '80%', alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#da291c', marginTop: 8, fontWeight: 'bold' },
});
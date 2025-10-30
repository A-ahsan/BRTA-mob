import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function FAQScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqData = [
    {
      category: "আবেদন প্রক্রিয়া সম্পর্কে",
      questions: [
        {
          question: "ড্রাইভিং লাইসেন্সের জন্য আবেদন করতে কী কী কাগজপত্র বা ডকুমেন্ট প্রয়োজন?",
          answer: "আবেদন করার জন্য আপনাকে অবশ্যই আপনার জাতীয় পরিচয়পত্র (NID) এর স্পষ্ট এবং সঠিক ফরম্যাটের ছবি আপলোড করতে হবে।"
        },
        {
          question: "NID কার্ডের ছবি আপলোড করার সময় কী কী বিষয় খেয়াল রাখতে হবে?",
          answer: "• NID কার্ডের ছবিটি অবশ্যই সম্পূর্ণ স্পষ্ট এবং পড়ার যোগ্য হতে হবে।\n• ছবির ফরম্যাট JPG বা PNG হতে হবে।\n• কোনো ধরনের জাল বা নকল NID কার্ডের ছবি ব্যবহার করা যাবে না। শুধুমাত্র আপনার আসল এবং বৈধ NID কার্ডের ছবিই ব্যবহার করুন।\n• NID কার্ডে উল্লিখিত সমস্ত তথ্য (নাম, ঠিকানা, জন্ম তারিখ ইত্যাদি) সঠিকভাবে এবং সম্পূর্ণরূপে আবেদন ফর্মে পূরণ করুন।"
        }
      ]
    },
    {
      category: "মুখমণ্ডল যাচাই (Face Verification) সম্পর্কে",
      questions: [
        {
          question: "মুখমণ্ডল যাচাই করার সময় আমাকে কী করতে হবে?",
          answer: "মুখমণ্ডল যাচাই প্রক্রিয়া সফলভাবে সম্পন্ন করতে অনুগ্রহ করে নিচের নির্দেশাবলী খুব সাবধানে অনুসরণ করুন:\n\n• মাথা ঘোরানো: সিস্টেম যখন নির্দেশ দিবে, তখন আপনার মাথা বাম দিকে ঘোরান। এরপর, সিস্টেম যখন নির্দেশ দিবে, আপনার মাথা ডান দিকে ঘোরান।\n\n• চোখের পলক: আপনার সজীবতা (Liveness) পরীক্ষা করার জন্য, সিস্টেম আপনাকে দুই বার চোখের পলক ফেলতে নির্দেশ দিবে। অনুগ্রহ করে স্পষ্টভাবে দুই বার চোখের পলক ফেলুন।"
        },
        {
          question: "মুখমণ্ডল যাচাই বারবার ব্যর্থ হলে কী করব?",
          answer: "নির্দেশাবলী ঠিকভাবে অনুসরণ করুন, পর্যাপ্ত আলো আছে এমন একটি স্থানে বসুন এবং নিশ্চিত করুন যে আপনার মুখের সামনে কোনো কিছু (চশমা, মাস্ক ইত্যাদি) আড়াল করছে না।"
        }
      ]
    },
    {
      category: "পেমেন্ট সম্পর্কে",
      questions: [
        {
          question: "ড্রাইভিং লাইসেন্সের ফি কীভাবে পরিশোধ করব?",
          answer: "BRTA 2.0 প্ল্যাটফর্মে SSLCOMMERZ পেমেন্ট গেটওয়ে সংযুক্ত রয়েছে। এর মাধ্যমে আপনি যেকোনো ধরনের পেমেন্ট পদ্ধতি ব্যবহার করতে পারবেন, যেমন:\n\n• ডেবিট/ক্রেডিট কার্ড (Visa, MasterCard)\n• মোবাইল ফাইন্যান্স (bKash, Nagad, Rocket ইত্যাদি)\n• ইন্টারনেট ব্যাংকিং"
        },
        {
          question: "পেমেন্টের সময় বিশেষ কোন নির্দেশনা আছে কি?",
          answer: "হ্যাঁ, অনুগ্রহ করে মনে রাখবেন: পেমেন্টের জন্য কোনো অবৈধ অর্থ, জাল টাকা বা কোনো অসৎ উৎস থেকে প্রাপ্ত অর্থ ব্যবহার করা সম্পূর্ণ নিষিদ্ধ। শুধুমাত্র আপনার নিজের বৈধ এবং আইনসম্মত অর্থ দিয়েই পেমেন্ট সম্পন্ন করুন।"
        }
      ]
    },
    {
      category: "লাইসেন্স নবায়ন সম্পর্কে",
      questions: [
        {
          question: "আমার ড্রাইভিং লাইসেন্স নবায়ন করতে চাই। আমাকে কী তথ্য দিতে হবে?",
          answer: "লাইসেন্স নবায়নের আবেদন করার সময়, আপনাকে নির্দিষ্ট করে বলতে হবে যে আপনি কত বছরের জন্য লাইসেন্স নবায়ন করতে চান। যেমন: আপনি ২ বছর-এর জন্য নবায়ন করতে পারেন অথবা ১০ বছর-এর জন্য নবায়ন করতে পারেন। আপনার প্রয়োজন অনুযায়ী সময়সীমা নির্বাচন করুন।"
        }
      ]
    }
  ];

  const FAQItem = ({ question, answer, isExpanded, onToggle }) => (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.questionContainer} onPress={onToggle}>
        <Text style={styles.questionText}>{question}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );

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
          <Text style={styles.title}>BRTA সেবা পোর্টাল</Text>
          <Text style={styles.subtitle}>প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← ড্যাশবোর্ডে ফিরে যান</Text>
          </TouchableOpacity>
        </View>

        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>প্রকল্প পরিচিতি</Text>
          <Text style={styles.introText}>
            BRTA 2.0 হল বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA) এর একটি ডিজিটাল সেবা প্ল্যাটফর্ম। 
            এই প্ল্যাটফর্মের মাধ্যমে ব্যবহারকারীরা সহজেই তাদের ড্রাইভিং লাইসেন্সের জন্য আবেদন, 
            নবায়ন এবং সংশ্লিষ্ট সেবাসমূহ নিতে পারবেন।
          </Text>
        </View>

        {/* FAQ Categories */}
        {faqData.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{`${categoryIndex + 1}। ${category.category}`}</Text>
            {category.questions.map((faq, questionIndex) => {
              const globalIndex = `${categoryIndex}-${questionIndex}`;
              return (
                <FAQItem
                  key={globalIndex}
                  question={`প্রশ্ন: ${faq.question}`}
                  answer={`উত্তর: ${faq.answer}`}
                  isExpanded={expandedIndex === globalIndex}
                  onToggle={() => toggleFAQ(globalIndex)}
                />
              );
            })}
          </View>
        ))}

        {/* Warning Section */}
        <View style={styles.warningSection}>
          <Text style={styles.warningTitle}>⚠️ সতর্কতা</Text>
          <Text style={styles.warningText}>
            BRTA 2.0 প্ল্যাটফর্ম একটি সরকারি ডিজিটাল সেবা। এখানে কোনো ধরনের ভুল বা গেজে তথ্য প্রদান, 
            জাল ডকুমেন্ট ব্যবহার বা অবৈধ পেমেন্ট করার চেষ্টা করা দণ্ডনীয় অপরাধ। 
            সকল নির্দেশিকা সঠিকভাবে অনুসরণ করে সেবা নিন।
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© ২০২৫ বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA)</Text>
          <Text style={styles.footerSubText}>সকল অধিকার সংরক্ষিত</Text>
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
    backgroundColor: '#f4f1ea',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#006a4e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 15
  },
  backBtn: {
    backgroundColor: '#c69214',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
  },
  backBtnText: {
    color: 'white',
    fontWeight: 'bold'
  },
  introSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#006a4e'
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006a4e',
    marginBottom: 10
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify'
  },
  categorySection: {
    marginBottom: 20
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006a4e',
    marginBottom: 15,
    paddingLeft: 10
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    paddingRight: 10
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006a4e',
    width: 30,
    textAlign: 'center'
  },
  answerContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9'
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    textAlign: 'justify'
  },
  warningSection: {
    backgroundColor: '#fff3cd',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7'
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10
  },
  warningText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#856404',
    textAlign: 'justify'
  },
  footer: {
    backgroundColor: '#006a4e',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  footerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  footerSubText: {
    color: '#f0f0f0',
    fontSize: 12
  }
});
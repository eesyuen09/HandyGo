import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { getDocs, collection, query, orderBy, limit, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import IncomeChart from '../components/IncomeChart';
import PieChart from '../components/IncomePieChart';
import ChartPager from '../components/ChartPager';
import EarningCard from '../components/EarningCard';
import { db } from '../firebaseConfig';
import { getSummaryForUser } from './openaiService';
import { style } from '../components/style_bizfinance';
import { colours } from '../components/IncomeChart';
import { increment } from "firebase/firestore";

export default function FinanceScreen() {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Sora: require('../assets/fonts/Sora-VariableFont_wght.ttf'),
    Inter: require('../assets/fonts/Inter-regular.ttf'),
  });
  if (!fontsLoaded) return null;

  // Tab state
  const [tab, setTab] = useState('Month');

  // AI summary state
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  //record earnings
  async function recordEarning(workerId, amount, dateString) {
    const monthKey = dateString.slice(0, 7);     // e.g. "2025-07"
    const workerRef = doc(db, "workers", workerId);

    await updateDoc(workerRef, {
      totalEarnings:       increment(amount),
      [`monthlyEarnings.${monthKey}`]: increment(amount)
    });
  }

  // Fetch & summarize on mount
  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      try {
        // 1) Query Firestore for latest schedules
        const q = query(
          collection(db, 'users', userId, 'schedules'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const snap = await getDocs(q);
        const bookings = snap.docs.map(d => d.data());

        // 2) Summarize via ChatGPT
        const rawData = JSON.stringify(bookings);
        const prompt = `Please summarize the following booking data and provide insights: ${rawData}`;
        const aiSummary = await getSummaryForUser(prompt);
        setSummary(aiSummary);
      } catch (error) {
        console.error('Error during summarization:', error);
        setSummary('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [userId]);

  // Dummy earnings data
  const rating = 4.5;
  const topEarnings = [
    { id: '1', title: 'Cleaning', icon: <FontAwesome5 name="broom" size={20} />, date: 'Jan 12, 2025', amount: 150 },
    { id: '2', title: 'Home Organising', icon: <MaterialIcons name="home-repair-service" size={20} />, date: 'Yesterday', amount: 85 },
    { id: '3', title: 'Youtube', icon: <Ionicons name="logo-youtube" size={20} />, date: 'Jan 16, 2025', amount: 50 },
  ];

  return (
    <View style={style.container}>
      {/* Header */}
      <View style={style.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={style.backButton}>
          <Ionicons name="chevron-back" size={24} color={colours.black} />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Statistics</Text>
        <View style={style.backButton} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Total Income */}
        <Text style={style.totalIncomeLabel}>Total Income</Text>
        <Text style={style.totalIncome}>$600.00</Text>

        {/* Tab Switcher */}
        <View style={style.tabContainer}>
          {['Week', 'Month'].map(label => (
            <TouchableOpacity key={label} onPress={() => setTab(label)}>
              <Text style={[style.tab, tab === label && style.tabActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Charts */}
        <Text style={style.subtitle}>Monthly Earnings</Text>
        <View style={{ height: 300 }}><ChartPager /></View>
        <View style={style.line} />
        <Text style={style.subtitle}>Earning Distribution by Service Type</Text>
        <PieChart />
        <View style={style.line} />

        {/* Ratings & Reviews */}
        <Text style={style.subtitle}>Ratings and Reviews</Text>
        <Text style={style.subtitle}>Current Ratings: {rating}</Text>

        {/* Top Earnings */}
        <View style={style.earningHeader}>
          <Text style={style.subtitle}>Top Earning</Text>
        </View>
        {topEarnings.map(item => <EarningCard key={item.id} {...item} />)}
        <View style={style.line} />

        {/* AI Suggestion */}
        {loading && <ActivityIndicator size="large" style={{ marginVertical: 16 }} />}
        {!loading && summary.length > 0 && (
          <View style={{ padding: 10, backgroundColor: '#fff', marginTop: 10 }}>
            <Text style={style.subtitle}>AI Suggestion</Text>
            <Text style={style.aiText}>{summary}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

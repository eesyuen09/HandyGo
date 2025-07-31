import React, { useEffect, useState } from "react";
import Markdown from "react-native-markdown-display";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import IncomeChart from "../components/IncomeChart";
import PieChart from "../components/IncomePieChart";
import ChartPager from "../components/ChartPager";
import EarningCard from "../components/EarningCard";
import { db } from "../firebaseConfig";
import { getSummaryForUser } from "./openaiService";
import { style } from "../components/style_bizfinance";
import { colours } from "../components/IncomeChart";
import { increment } from "firebase/firestore";
import ReviewsList from "../components/reviewList";

export default function FinanceScreen() {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [aveRating, setAveRating] = useState(0);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // Tab state
  const [tab, setTab] = useState("Month");

  // AI summary state
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  //get total earnings
  useEffect(() => {
    async function fetchEarningsAndRating() {
      try {
        const auth = getAuth();
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setTotalEarnings(userSnap.data().totalEarnings || 0);
          setAveRating(userSnap.data().averageRating || 0);
        }
      } catch (error) {
        console.warn("Error fetching data", error);
      }
    }
    fetchEarningsAndRating();
  }, []);

  // Fetch & summarize on mount
  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      try {
        // 1) Query Firestore for latest schedules
        const q = query(
          collection(db, "users", userId, "schedules"),
          orderBy("availability", "desc"),
          limit(5)
        );
        const snap = await getDocs(q);
        const bookings = snap.docs.map((d) => d.data());

        if (bookings.length === 0) {
          setSummary("No recent bookings to summarize.");
          setLoading(false);
          return;
        }

        // 2) Summarize via ChatGPT
        const rawData = JSON.stringify(bookings);
        const prompt = `You are a clever and engaging assistant helping a home service provider make sense of their recent bookings. Given a list of booking data, return a well-formatted, visually engaging report in Markdown.

Keep it short, punchy, and genuinely helpful — no fluff.

Structure your output like this:

🎯 **Snapshot Summary**
- Total bookings: X
- Total hours worked: Y hrs
- Top service type: Z
- Most active day: Xday

📋 **Booking Glance**
- 🧼 Cleaning — Tue, 3h @ 2PM
- 🔧 Plumbing — Thu, 2h @ 10AM

🔍 **Patterns & Highlights**
- Back-to-back bookings on Friday
- 2 urgent jobs completed successfully
- Long gaps between bookings — room to earn more?

💡 **Smart Suggestions**
- Open up Wednesday slots — they’re always empty
- Promote high-rated services (e.g., Deep Cleaning)
- Try bundling services to boost hourly earnings
                        Here is the data: ${rawData}`;
        const aiSummary = await getSummaryForUser(userId);
        setSummary(aiSummary);
      } catch (error) {
        console.error("Error during summarization:", error);
        setSummary("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [userId]);

  // Dummy earnings data
  // const rating = 4.5;
  // const topEarnings = [
  //   { id: '1', title: 'Cleaning', icon: <FontAwesome5 name="broom" size={20} />, date: 'Jan 12, 2025', amount: 150 },
  //   { id: '2', title: 'Home Organising', icon: <MaterialIcons name="home-repair-service" size={20} />, date: 'Yesterday', amount: 85 },
  //   { id: '3', title: 'Youtube', icon: <Ionicons name="logo-youtube" size={20} />, date: 'Jan 16, 2025', amount: 50 },
  // ];

  return (
    <View style={style.container}>
      {/* Header */}
      <View style={style.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={style.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colours.black} />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Statistics</Text>
        <View style={style.backButton} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Total Income */}
        <Text style={style.totalIncomeLabel}>Total Income</Text>
        <Text style={style.totalIncome}>${totalEarnings}</Text>

        {/* Tab Switcher */}
        <View style={style.tabContainer}>
          {["Week", "Month"].map((label) => (
            <TouchableOpacity key={label} onPress={() => setTab(label)}>
              <Text style={[style.tab, tab === label && style.tabActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Charts */}
        <Text style={style.subtitle}>Monthly Earnings</Text>
        <View style={{ height: 300 }}>
          <ChartPager />
        </View>
        <View style={style.line} />
        <Text style={style.subtitle}>Earning Distribution by Service Type</Text>
        <PieChart />
        <View style={style.line} />

        {/* Ratings & Reviews */}
        <Text style={style.subtitle}>Ratings and Reviews</Text>
        <Text style={style.subtitle}>Current Ratings: {aveRating}/5</Text>
        <ReviewsList workerId={userId} />

        {/* Top Earnings */}
        {/* <View style={style.earningHeader}>
          <Text style={style.subtitle}>Top Earning</Text>
        </View>
        {topEarnings.map(item => <EarningCard key={item.id} {...item} />)}
        <View style={style.line} /> */}

        {/* AI Suggestion */}
        {loading && (
          <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
        )}
        {!loading && summary.length > 0 && (
          <View style={{ padding: 10, backgroundColor: "#fff", marginTop: 10 }}>
            <Text style={style.subtitle}>AI Suggestion</Text>
            <Markdown
              style={{
                body: {
                  color: colours.darkest_coco,
                  fontFamily: "Sora",
                },
                heading1: {
                  fontSize: 22,
                  fontWeight: "bold",
                  color: colours.darkest_coco,
                  marginBottom: 8,
                },
                heading2: {
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colours.main_coco,
                  marginBottom: 6,
                },
                heading3: {
                  fontSize: 16,
                  fontWeight: "600",
                  color: colours.darkest_coco,
                  marginTop: 10,
                  marginBottom: 4,
                },
                paragraph: {
                  fontSize: 15,
                  color: colours.darket_coco,
                  fontFamily: "Sora",
                  fontWeight: "400",
                  marginBottom: 4,
                },
                listItemBullet: {
                  color: colours.darkest_coco,
                  fontSize: 15,
                },
                listItemText: {
                  fontSize: 15,
                  color: colours.main_coco,
                  fontFamily: "Sora",
                  marginBottom: 2,
                },
                strong: {
                  color: colours.darkest_coco,
                  fontWeight: "bold",
                },
                bullet_list: {
                  marginBottom: 6,
                },
                ordered_list: {
                  marginBottom: 6,
                },
                list_item: {
                  flexDirection: "row",
                  alignItems: "flex-start",
                },
              }}
            >
              {summary}
            </Markdown>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import React, { use, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { colours, style } from "../components/style_bizactivitypage";
import BgImage from "../assets/images/biz_activitypageBG.png";
import { db, auth } from "../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useFonts } from "expo-font";
import { ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const {
  darkest_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black,
  purple,
} = colours;

export default function Biz_activitypage({ navigation }) {
  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(null);

  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  const [markedDates, setMarkedDates] = useState([]);

  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  const serviceGroups = {
    Cleaning: [
      "General House Cleaning",
      "Home Organizing",
      "Deep Cleaning",
      "Aircond Cleaning",
      "Carpet Cleaning",
      "Sofa or Mattress Cleaning",
      "Post-Renovation Cleaning",
    ],
    Repair: [
      "Air Conditioner Repair",
      "Electrical Repair",
      "Plumbing Services",
      "Refrigerator Repair",
      "Washing Machine Repair",
      "Door & Lock Repair",
      "Ceiling Repair",
    ],
    Maintenance: [
      "Furniture Assembly",
      "Mounting",
      "Painting & Touch-up Work",
      "Curtain or Blind Installation",
      "Minor Welding Jobs",
      "Kitchen Remodeling",
      "Tiling & Flooring",
      "Electrical Safety Check",
      "Gas Leak Detection",
      "Fire Extinguisher Servicing",
    ],
    Moving: [
      "House Moving",
      "Large Item Delivery",
      "Small Item Delivery",
      "Outdoor Services",
      "Lawn Mowing",
      "Gardening",
      "Tree Cutting",
      "Roof or Gutter Cleaning",
    ],
  };

  const groupColorMap = {
    Cleaning: "#fcd6c5",
    Maintenance: "#d1a03f",
    Moving: "#a6d1e6",
    Outdoor: "#b0e0a8",
    Repair: "#f5c16c",
  };

  function getColorForType(type) {
    for (const group in serviceGroups) {
      if (serviceGroups[group].includes(type)) {
        return groupColorMap[group];
      }
    }
    return colours.darkest_coco;
  }

  const renderUpcomingTask = ({ item }) => {
    const date = new Date(item.time);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const dotColor = getColorForType(item.type) || colours.darkest_coco;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Order Summary", {
            orderID: item.orderID,
            userID: auth.currentUser.uid,
          })
        }
        style={[{ backgroundColor: colours.grey }, style.card]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: dotColor,
              marginRight: 10,
            }}
          />
          <View>
            <Text style={style.cardTitle}>{item.type}</Text>
            <Text style={style.date}>{formattedDate}</Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colours.darkest_coco}
        />
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchSelectedTasks = async () => {
        const user = auth.currentUser;
        if (!user) {
          return;
        }

        const recentsTasksRef = query(
          collection(db, "users", user.uid, "schedules"),
          where("status", "==", "completed"),
        );
        const recentTasksSnap = await getDocs(recentsTasksRef);
        const snapshot = await getDocs(recentsTasksRef);
        console.log("snapshot size:", snapshot.size);

        snapshot.forEach((doc) => {
          console.log("Doc:", doc.id, doc.data());
        });

        const upcomingTasksRef = query(
          collection(db, "users", user.uid, "schedules"),
          where("status", "==", "scheduled"),
        );
        const upcomingTasksSnap = await getDocs(upcomingTasksRef);

        const recentTasksList = [];

        recentTasksSnap.forEach((docSnap) => {
          const data = docSnap.data();
          // console.log('data',data);
          //add object into tasksList array
          recentTasksList.push({
            orderID: data.orderID,
            type: data.type,
            time: data.availability,
          });
        });
        recentTasksList.sort((a, b) => new Date(a.time) - new Date(b.time));
        setRecentTasks(recentTasksList);

        //upcoming
        const upcomingTasksList = [];

        upcomingTasksSnap.forEach((docSnap) => {
          const data = docSnap.data();
          // console.log('data',data);
          //add object into tasksList array
          upcomingTasksList.push({
            orderID: data.orderID,
            type: data.type,
            time: data.availability,
          });
        });
        upcomingTasksList.sort((a, b) => new Date(a.time) - new Date(b.time));

        setUpcomingTasks(upcomingTasksList);

        const marked = {};
        [...recentTasksList, ...upcomingTasksList].forEach((task) => {
          const dotColor = getColorForType(task.type) || colours.darkest_coco;
          const [dateOnly] = task.time.split(" ");
          marked[dateOnly] = {
            customStyles: {
              container: {
                backgroundColor: dotColor,
                borderRadius: 20,
              },
              text: {
                color: colours.white,
              },
            },
          };
        });
        setMarkedDates(marked);
        console.log("markedDates state updated", marked);
      };
      fetchSelectedTasks();
    }, []),
  );

  return (
    <ImageBackground style={style.background} source={BgImage}>
      <View style={style.container}>
        {/* Calendar Title */}
        <View style={style.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={style.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={black} />
          </TouchableOpacity>

          <Text style={style.headerTitle}>Calendar</Text>
          <View style={style.backButton} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Calendar Component */}
          <View style={style.calendarContainer}>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  ...(markedDates[selectedDate] || {}),
                  selected: true,
                  selectedColor: colours.yellow_brown,
                  selectedTextColor: colours.darkest_coco,
                },
                [today]: {
                  ...(markedDates[today] || {}),
                  customStyles: {
                    container: {
                      backgroundColor: "#456882",
                    },
                    text: {
                      color: colours.white,
                    },
                  },
                },
              }}
              markingType={"custom"}
              theme={{
                backgroundColor: "transparent",
                calendarBackground: "transparent",
                textSectionTitleColor: colours.darkest_coco,
                selectedDayBackgroundColor: colours.yellow_brown,
                selectedDayTextColor: colours.darkest_coco,
                dayTextColor: colours.darkest_coco,
                textDayFontFamily: "Sora",
                textDayFontSize: 17,
                textDayFontWeight: "600",
                textMonthFontColor: colours.darkest_coco,
                textMonthFontSize: 18,
                textMonthFontWeight: "bold",
                textMonthFontFamily: "Sora",
                textYearFontFamily: "Sora",
                arrowColor: colours.darkest_coco,
              }}
              renderArrow={(direction) =>
                direction === "left" ? (
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color={colours.darkest_coco}
                  />
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colours.darkest_coco}
                  />
                )
              }
              style={{ width: 360 }}
            />
            {/* Scrollable area */}
          </View>
          {/* Recent Section */}
          <Text style={style.subHeader}>Recent</Text>

          <FlatList
            data={recentTasks}
            keyExtractor={(item) => item.orderID}
            renderItem={renderUpcomingTask}
            scrollEnabled={false}
          />

          {/* Upcoming Section */}
          <Text style={style.subHeader}>Upcoming</Text>

          <FlatList
            data={upcomingTasks}
            keyExtractor={(item) => item.orderID}
            renderItem={renderUpcomingTask}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

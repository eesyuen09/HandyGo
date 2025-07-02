import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";

import { colours, style } from "../components/style_u_activity.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";


//fetch data from firebase
import {getAuth} from 'firebase/auth';
import {
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FlatList } from "react-native";


export default function UserActivity({ navigation }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompletedTasks, setIncompleteTasks] = useState([]);
    const getIcon = (serviceType) => {
      switch (serviceType) {
        case "Cleaning":
          return { name: "cleaning-services", family: "MaterialIcons" };
        case "Repair":
          return { name: "tool", family: "Feather" };
        case "Maintenance":
          return { name: "hands-holding", family: "FontAwesome6" };
        case "Moving":
          return { name: "truck-moving", family: "FontAwesome5" };
        case "Outdoor Services":
          return { name: "tree", family: "FontAwesome5" };
        default:
          return { name: "wrench", family: "MaterialCommunityIcons" };
      }
    };
    const renderIcon = (iconName, iconFamily, color, size) => {
      switch (iconFamily) {
        case "MaterialCommunityIcons":
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        case "MaterialIcons":
          return <MaterialIcons name={iconName} size={size} color={color} />;
        case "FontAwesome5":
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        case "FontAwesome6":
          return <FontAwesome6 name={iconName} size={size} color={color} />;
        case "Feather":
          return <Feather name={iconName} size={size} color={color} />;
        case "Ionicons":
          return <Ionicons name={iconName} size={size} color={color} />;
        default:
          return <Feather name="alert-circle" size={size} color={color} />;
      }
    };

const fetchTasks = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;
  try{
    const q = query(
      collection(db, "booking"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);

    const completedTasks = [];
    const incompletedTasks = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Split "YYYY-MM-DD HH:mm" format
      let date = "N/A", time = "N/A";
      if (typeof data.availability === "string" && data.availability.includes(" ")) {
        [date, time] = data.availability.split(" ");
      }

      const task = {
        id: data.orderID || docSnap.id,
        category: data.type || "Unknown",
        time: `${date} | ${time}`,
        location: `${data.state || ""}, ${data.postcode || ""}`,
        price: data.price || "35.99",
        icon: getIcon(data.serviceType).name,
        iconFamily: getIcon(data.serviceType).family,
        isCompleted: data.isCompleted || false,
        status: data.status || "pending",
      };

      if (task.isCompleted) {
        completedTasks.push(task);
        console.log(completedTasks);
      } else {
        incompletedTasks.push(task);
      }
    });

    setCompletedTasks(completedTasks);
    setIncompleteTasks(incompletedTasks);
    console.log('completedtask',completedTasks);
  }catch (err){
    console.error("Failed to fetch Firestore data:", err.message);
    Alert.alert("Error", "Failed to load your bookings.");
  }
};
  useEffect(() => {
      fetchTasks();
    }, []);



  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  const showTask = ({ item }) => (
  <TouchableOpacity 
    style={style.card}
    onPress={() => navigation.navigate('Order Summary', {orderID: item.id})}>

    <View style={style.taskRow}>
      <View style = {style.taskIconWrap}>

        {renderIcon(item.icon, item.iconFamily,colours.main_coco,24)}
      
      </View>
      <View style = {style.taskInfo}>
          <Text style = {style.cardTitle}>{item.category}</Text>
          <Text style = {style.taskDetailsText}>{item.time}</Text>
          <Text style = {style.taskDetailsText}>{item.location}</Text>
      </View>

    {/* CONDITIONAL BUTTONS placed inside showTask */}
    {/* Price */}
      <View style={style.taskMeta}>
        <Text style={style.cardPrice}>${item.price}</Text>
      </View>
    </View>

     {/* Status Row */}
    {!item.isCompleted && (
      <View style={style.statusRow}>
        <View
          style={[
            style.statusBadge,
            item.status === "pending"
              ? style.statusPending
              : item.status === "confirmed"
              ? style.statusScheduled
              : style.statusFailed,
          ]}
        >
          <Text
            style={[
              style.statusText,
              item.status === "pending"
                ? style.textPending
                : item.status === "confirmed" || item.status === "scheduled"
                ? style.textScheduled
                :item.status === 'cancelled'
                ? style.textCancelled
                : style.textFailed,
            ]}
          >
            {item.status === "pending"
              ? "Pending"
              : item.status === "confirmed" || item.status === "scheduled"
              ? "Confirmed"
              :item.status === 'cancelled'
              ? 'Cancelled'
              : "Failed"}
          </Text>
        </View>

        {item.status === "failed" && (
          <TouchableOpacity onPress={() => navigation.navigate("UserBooking")}>
            <Text style={style.viewText}>Retry Booking</Text>
          </TouchableOpacity>
        )}
      </View>
    )}

    {/* Completed Task Actions */}
    {item.isCompleted && (
      <View style={style.buttonRow}>
        <TouchableOpacity
          onPress={() => Alert.alert("Review Task", "Please leave a review")}
        >
          <Text style={style.actionText}>👍 Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserBooking", { prefillData: item })
          }
        >
          <Text style={style.actionText}>🔁 Rebook</Text>
        </TouchableOpacity>
      </View>
    )}
  </TouchableOpacity>
);

  return ( 
    <SafeAreaView style={style.frame}>
      <ScrollView contentContainerStyle ={style.container}>
        {/* In Progress Section */}
        <View style={style.section}>
          <Text style={style.bigTitle}>Activity</Text>
        </View>
        <View style={style.section}>
          <Text style={style.sectionTitle}>In Progress</Text>
          {incompletedTasks.length === 0 ? (
            <Text style={style.emptyText}>No ongoing bookings</Text>
          ) : (
            <FlatList
              data = {incompletedTasks}
              renderItem={showTask}
              keyExtractor={(task) =>task.id}
              contentContainerStyle = {{paddingBottom: 100}}
              scrollEnabled = {false}
              
              />
          )}
        </View>

        {/* Completed Section */}
        <View style={style.section}>
          <View style={style.sectionHeader}>
            <Text style={style.sectionTitle}>Recent</Text>
            <TouchableOpacity
              // onPress={() => navigation.navigate("AllReviewsPage")}
              onPress={() =>
                Alert.alert(
                  "All booking history",
                  "This feature is not available yet."
                )
              }
            >
              <Text style={style.seeAllText}>See All ➝</Text>
            </TouchableOpacity>
          </View>

          {completedTasks.length === 0 ? (
            <Text style={style.emptyText}>No Completed Bookings yet</Text>
          ) : (
            <FlatList
              data = {completedTasks}
              renderItem={showTask}
              keyExtractor={(task) =>task.id}
              contentContainerStyle = {{paddingBottom: 100}}
              scrollEnabled={false}
              />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import PropTypes from 'prop-types';

UserHome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
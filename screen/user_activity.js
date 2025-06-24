import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

// //extract data from firebase
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { auth, getAuth } from "../firebaseConfig";
// import { getDoc, doc, updateDoc } from "firebase/firestore";

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

  // const fetchTasks = async () => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   const userRef = doc(db, "users", user.uid);
  //   const userSnap = await getDoc(userRef);
  //   if (!userSnap.exists()) return;

  //   const userData = userSnap.data();

  //   const q = query(
  //     collection(db, "booking"),
  //     where("isCompleted", "==", "false"),
  //     where("userID", "==", user.uid)
  //   );
  //   const querySnapshot = await getDocs(q);

  //   const completedTasks = [];
  //   const incompletedTasks = [];

  //   querySnapshot.forEach((docSnap) => {
  //     const data = docSnap.data();
  //     const task = {
  //       id: data.orderID || docSnap.id,
  //       category: data.type || "Unknown",
  //       time: `${data.availability?.[0]?.date || "N/A"} | ${
  //         data.availability?.[0]?.time || "N/A"
  //       }`,
  //       location: `${data.state || ""}, ${data.postcode || ""}`,
  //       price: data.price || "35.99",
  //       icon: getIcon(data.type),
  //       isCompleted: data.isCompleted || false,
  //       status: data.status || "Pending",
  //     };

  //     if (task.isCompleted) {
  //       completedTasks.push(task);
  //     } else {
  //       incompletedTasks.push(task);
  //     }
  //   });

  //   setCompletedTasks(completedTasks);
  //   setIncompleteTasks(incompletedTasks);
  // };

  useEffect(() => {
    // Mock data
    const mockData = [
      {
        id: "1",
        category: "Cleaning",
        time: "19 May 2025 | 5.00pm",
        location: "Penang GeorgeTown",
        price: "35.99",
        icon: getIcon("Cleaning"),
        isCompleted: false,
        status: "pending",
      },
      {
        id: "2",
        category: "Home Organizing",
        time: "19 May 2025 | 5.00pm",
        location: "Penang GeorgeTown",
        price: "45.99",
        icon: getIcon("Home Organizing"),
        isCompleted: false,
        status: "scheduled",
      },
      {
        id: "3",
        category: "Home Organizing",
        time: "19 May 2025 | 5.00pm",
        location: "Penang GeorgeTown",
        price: "45.99",
        icon: getIcon("Home Organizing"),
        isCompleted: false,
        status: "failed",
      },
      {
        id: "4",
        category: "Aircond Servicing",
        time: "11 May 2025 | 5.00pm",
        location: "Penang GeorgeTown",
        price: "25.99",
        icon: getIcon("Aircond Servicing"),
        isCompleted: false,
        status: "cancelled",
      },
      {
        id: "5",
        category: "Aircond Servicing",
        time: "11 May 2025 | 5.00pm",
        location: "Penang GeorgeTown",
        price: "25.99",
        icon: getIcon("Aircond Servicing"),
        isCompleted: true,
        status: "completed",
      },
    ];

    const completed = [];
    const incomplete = [];

    mockData.forEach((task) => {
      if (task.isCompleted) {
        completed.push(task);
      } else {
        incomplete.push(task);
      }
    });

    setCompletedTasks(completed);
    setIncompleteTasks(incomplete);
  }, []);

  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  const showTask = ({ item }) => (
    <View style={style.card}>
      <View style={style.taskRow}>
        <View style={style.taskIconWrap}>
          {renderIcon(item.icon.name, item.icon.family, colours.main_coco, 28)}
        </View>

        <View style={style.taskContent}>
          <View style={style.taskInfo}>
            <Text style={style.cardTitle}>{item.category}</Text>
            <View style={style.taskDetails}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colours.light_coco}
              />
              <Text style={style.taskDetailsText}>{item.time}</Text>
            </View>
            <View style={style.taskDetails}>
              <FontAwesome6
                name="location-dot"
                size={16}
                color={colours.light_coco}
              />
              <Text style={style.taskDetailsText}>{item.location}</Text>
            </View>
          </View>

          <View style={style.taskMeta}>
            <Text style={style.cardPrice}>${item.price}</Text>
            <View
              style={[
                style.statusBadge,
                item.status === "scheduled"
                  ? style.statusScheduled
                  : item.status === "failed"
                  ? style.statusFailed
                  : item.status === "cancelled"
                  ? style.statusCancelled
                  : item.status === "pending"
                  ? style.statusPending
                  : style.statusCompleted,
              ]}
            >
              <Text
                style={[
                  style.statusText,
                  item.status === "scheduled"
                    ? style.textScheduled
                    : item.status === "failed"
                    ? style.textFailed
                    : item.status === "cancelled"
                    ? style.textCancelled
                    : item.status === "pending"
                    ? style.textPending
                    : style.textCompleted,
                ]}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Conditional Buttons */}
      {item.isCompleted ? (
        <View style={style.buttonRow}>
          <TouchableOpacity
            onPress={
              () => Alert.alert("Review Task", "please leave a review")
              // navigation.navigate("ReviewPage", { orderID: item.id })
            }
          >
            <Text style={style.actionText}>Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UserBooking", { prefillData: item })
            }
          >
            <Text style={style.actionText}>Rebook</Text>
          </TouchableOpacity>
        </View>
      ) : item.status === "failed" || item.status === "cancelled" ? (
        <TouchableOpacity onPress={() => navigation.navigate("UserBooking")}>
          <Text style={style.actionText}>Retry Booking</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={style.frame}>
      <ScrollView contentContainerStyle={style.container}>
        {/* In Progress Section */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>In Progress</Text>
          {incompletedTasks.length === 0 ? (
            <Text style={style.emptyText}>No ongoing bookings</Text>
          ) : (
            incompletedTasks.map((task) => (
              <View key={task.id}>{showTask({ item: task })}</View>
            ))
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
            completedTasks.map((task) => (
              <View key={task.id}>{showTask({ item: task })}</View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

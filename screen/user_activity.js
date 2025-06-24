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

import { colours, styles } from "../components/style_u_activity.js";
import { SafeAreaView } from "react-native-safe-area-context";

//extract data from firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { auth, getAuth } from "../firebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";

export default function UserActivity({ navigation }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompletedTasks, setIncompleteTasks] = useState([]);

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
        isCompleted: true,
        status: "completed",
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

  const showTask = ({ item }) => (
    <View style={style.card}>
      <View style={style.taskIconWrap}>
        <MaterialCommunityIcons
          name={item.icon}
          size={30}
          color={colours.main_coco}
        />
      </View>

      <View style={style.taskInfo}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Business Order Summary", { orderID: item.id })
          }
        >
          <Text style={style.cardTitle}>{item.category}</Text>
          <View style={style.taskDetails}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colours.darkest_coco}
            />
            <Text style={style.taskDetailsText}>{item.time}</Text>
          </View>

          <View style={style.taskDetails}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colours.darkest_coco}
            />
            <Text style={style.taskDetailsText}>{item.location}</Text>
          </View>

          <View style={style.taskDetails}>
            <Feather
              name="dollar-sign"
              size={16}
              color={colours.darkest_coco}
            />
            <Text style={style.taskDetailsText}>{item.price}</Text>
          </View>

          <View
            style={[
              style.statusBadge,
              item.status === "scheduled"
                ? style.statusScheduled
                : item.status === "failed"
                ? style.statusFailed
                : item.status === "completed"
                ? style.statusCompleted
                : style.statusPending, // default
            ]}
          >
            <Text
              style={[
                style.statusText,
                item.status === "scheduled"
                  ? style.textScheduled
                  : item.status === "failed"
                  ? style.textFailed
                  : item.status === "completed"
                  ? style.textCompleted
                  : style.textPending,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </TouchableOpacity>
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
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("UserBooking")}>
          <Text style={style.actionText}>Retry Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.frame}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* In Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          {incompletedTasks.length === 0 ? (
            <Text style={styles.emptyText}>No ongoing bookings</Text>
          ) : (
            incompletedTasks.map((task) => (
              <View key={task.id}>{showTask({ item: task })}</View>
            ))
          )}
        </View>

        {/* Completed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <TouchableOpacity
              // onPress={() => navigation.navigate("AllReviewsPage")}
              onPress={() =>
                Alert.alert(
                  "All booking history",
                  "This feature is not available yet."
                )
              }
            >
              <Text style={styles.seeAllText}>See All ➝</Text>
            </TouchableOpacity>
          </View>

          {completedTasks.length === 0 ? (
            <Text style={styles.emptyText}>No Completed Bookings yet</Text>
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

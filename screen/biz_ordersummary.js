import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesome5, Feather, Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { services_categories } from "../constants/category_constant";
import {
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  setDoc,
  Timestamp, 
  increment
} from "firebase/firestore";
import { db, app, auth } from "../firebaseConfig";

import BgImage from "../assets/bg_UrgentTask.png";
import { style, colours } from "../components/style_b_ordersummary.js";
import { FlatList } from "react-native";

export default function OrderSummary({ navigation }) {
  const [booking, setBooking] = useState([]);
  const [openDate, setOpenDate] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [role, setRole] = useState(null);

  const route = useRoute();
  const { orderID, userID } = route.params || {};

  const [bookingData, setBookingData] = useState(null); // reused booking snapshot

  //find category with data array

  const categoryItem = booking.find((item) => item.type === "category");
  const bookingDetails = booking.filter((item) => item.type !== "category");


  //add schedule as subcollection in workers' firestore
  const addScheduleForWorker = async (workerID, orderID) => {
    // const scheduleRef = collection(db, 'users', workerId, 'schedules');
    const docRef = doc(db, "booking", orderID);
    //creates reference to the document you want to retrieve
    const docSnap = await getDoc(docRef);
    //getDoc is the function to retrieve data from the document reference

    if (!docSnap.exists()) {
      console.log("No such booking!");
      return;
    }
    const data = docSnap.data();
    const scheduleDocRef = doc(db, "users", workerID, "schedules", orderID);

    await setDoc(scheduleDocRef, {
      address: data.address,
      availability: selectedTime,
      duration: data.duration,
      gender: data.gender,
      notes: data.notes,
      orderID: data.orderID,
      postcode: data.postcode,
      rating: data.rating,
      serviceType: data.serviceType,
      state: data.state,
      status: data.status,
      type: data.type,
      userId: data.userId,
      workerId: data.workerId,
    });
  };

  const renderCard = (
    item,
    index,
    openDate,
    setOpenDate,
    selectedTime,
    setSelectedTime
  ) => {
    const isAvailabilityCard = item.type === "availability";
    //convert availability array to dropdown items
    const availabilityOptions =
      isAvailabilityCard && Array.isArray(item.content)
        ? item.content.map((slot, index) => ({
            label: `${slot.date} | ${slot.time}`,
            value: `${slot.date} ${slot.time}`,
            key: index.toString(),
          }))
        : [];

    return (
      <View style={style.cardContainer}>
        <View style={style.taskIconWrap}>
          <FontAwesome5 name={item.icon} size={18} color={colours.main_coco} />
        </View>
        <View style={style.taskInfo}>
          <Text style={style.cardTitle}>{item.title}</Text>
  
          {isAvailabilityCard && Array.isArray(item.content) ? (
            role === "user" && bookingData?.status !== "accepted" ? (
              // Show all available slots as plain text for users
              <View>
                {item.content.map((slot, index) => (
                  <Text key={index} style={style.cardContent}>
                    {slot.date} | {slot.time}
                  </Text>
                ))}
              </View>
            ) : bookingData?.status !== "accepted" ? (
              // Show dropdown for businesses
              <DropDownPicker
                open={openDate}
                value={selectedTime}
                items={availabilityOptions}
                setOpen={setOpenDate}
                setValue={setSelectedTime}
                setItems={() => {}}
                placeholder="Select a time slot"
                zIndex={1000}
                style={style.dropdownContainer}
                textStyle={style.cardContent}
              />
            ) : (
              // Show selected time string once accepted
              <Text style={style.cardContent}>
                {typeof bookingData?.availability === "object"
                  ? `${bookingData.availability.date} | ${bookingData.availability.time}`
                  : bookingData?.availability || "No time selected"}
              </Text>
            )
          ) : (
            // Non-availability items
            <Text style={style.cardContent}>{item.content}</Text>
          )}
        </View>
      </View>
    );
  };


const handleCompleteTask = async () => {
  if (!bookingData) {
    return Alert.alert("Data not ready yet.");
  }
  if (bookingData.isCompleted) {
    return Alert.alert("Error! Already completed.");
  }

  const bookingRef = doc(db, "booking", orderID);
  const workerId   = auth.currentUser.uid;

  try {
    //  Read the latest booking
    const snap = await getDoc(bookingRef);
    if (!snap.exists()) throw new Error("Booking not found");

    const data = snap.data();

    // Write the earning
    const earningsRef = doc(db, "users", workerId, "earnings", bookingRef.id);
    await setDoc(earningsRef, {
      date: data.availability?.[0]?.date || data.createdAt?.toDate()?.toISOString().slice(0,10),
      price: data.price,
      serviceType: data.type,
      bookingId: bookingRef.id,
      timestamp: Timestamp.now(),
    });

    // Mark booking completed
    await updateDoc(bookingRef, {
      isCompleted: true,
      completedAt: new Date(),
      status: "completed",
    });

    // Update the schedule sub-doc
    const scheduleRef = doc(db, "users", workerId, "schedules", bookingRef.id);
    await updateDoc(scheduleRef, { status: "completed" });

    //update parent user document, increment total earnings, increment this month bucket
    userRef = doc(db, "users", workerId);
    const completedAt = new Date();  
    const monthKey = completedAt.toISOString().slice(0,7); // "YYYY-MM"

    await updateDoc(userRef, {
      totalEarnings: increment(data.price || 0),
      [`monthlyEarnings.${monthKey}`]: increment(data.price || 0)
    });


    // Finally, go back
    Alert.alert("Success", "Booking completed and earnings recorded!");
    navigation.goBack();

  } catch (err) {
    console.error("Complete task failed:", err);
    Alert.alert("Error", err.message || "Something went wrong");
  }
};

  const acceptBooking = async (bookingId, currentWorkerId) => {
    try {
      if (!selectedTime) {
        Alert.alert("Please select a time slot before accepting the booking.");
        return;
      }

      const bookingRef = doc(db, "booking", bookingId);

      //check if current booking data exist
      const bookingSnap = await getDoc(bookingRef);
      if (!bookingSnap.exists()) {
        Alert.alert("Error, Booking does not exist.");
        return;
      }

      if (bookingData.status === "accepted") {
        Alert.alert("Error! This booking has already been accepted.");
        return;
      }

      await updateDoc(bookingRef, {
        status: "scheduled",
        workerId: currentWorkerId,
        acceptedAt: new Date(),
        availability: selectedTime,
      });

      Alert.alert("Booking accepted!");
      addScheduleForWorker(currentWorkerId, orderID);
      navigation.goBack();
    } catch (err) {
      console.error("Failed to accept booking:", err);
      Alert.alert("Error", "Failed to accept booking.");
    }
  };

  const cancelBooking = async (bookingId, role) => {
    try {
      const bookingRef = doc(db, "booking", bookingId);

      // Update booking status
      await updateDoc(bookingRef, {
        status: "cancelled",
        cancelledBy: role, // "user" or "business"
        cancelledAt: new Date(),
      });

      Alert.alert("Booking Cancelled");
      navigation.goBack();
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      Alert.alert("Error", "Failed to cancel booking.");
    }
  };

  useEffect(() => {
    const bookingRef = doc(db, "booking", orderID);

    const unsubscribe = onSnapshot(bookingRef, async (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();

      setBookingData(data);
      setIsCompleted(data.isCompleted || false);

      //set role
      const uid = userID || auth.currentUser?.uid;
      if (uid) {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        }
      }

      const matched_cat = services_categories.find(
        (cat) => cat.title === data.serviceType
      );
      const image = matched_cat?.bannerImage;

      const formatted = [
        { type: "category", title: data.type, image },
        {
          type: "availability",
          icon: "clock",
          title: `${data.duration} hours`,
          content: data.availability || [],
        },
        {
          type: "location",
          title: data.state,
          icon: "map-marker-alt",
          content: `${data.address}, ${data.postcode}, ${data.state}`,
        },
        {
          type: "note",
          title: data.notes || "No notes",
          icon: "file-alt",
          content: "To be uploaded picture",
        },
        {
          type: "price",
          title: "Price",
          icon: "dollar-sign",
          content: `$${data.price || "35.99"}`,
        },
      ];
      setBooking(formatted);
    });

    return () => unsubscribe();
  }, [orderID, userID]);

  return (
    <ImageBackground source={BgImage} style={style.background}>
      <View style={style.container}>
        <View style={style.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={style.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={colours.black} />
          </TouchableOpacity>

          <Text style={style.headerTitle}>Order Summary</Text>
          {/* place holder to balance the space*/}
          <View style={style.backButton} />
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* category container */}
          {categoryItem && (
            <View style={style.categoryContainer}>
              <ImageBackground
                style={style.image}
                source={categoryItem.image}
                imageStyle={{ borderRadius: 15 }}
              >
                <View style={style.overlay}>
                  <Text style={style.overlayTitle}>{categoryItem.title}</Text>
                </View>
              </ImageBackground>
            </View>
          )}

          {/* order details */}
          <Text style={style.titleBelow}>Order Details</Text>

          <FlatList
            data={bookingDetails}
            renderItem={({ item, index }) =>
              renderCard(
                item,
                index,
                openDate,
                setOpenDate,
                selectedTime,
                setSelectedTime
              )
            }
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            scrollEnabled={false}
          />

          {/* Divider */}
          <View style={style.line} />

          {!userID &&
            bookingData?.status !== "accepted" &&
            role === "business" && (
              <TouchableOpacity
                style={style.button}
                onPress={() => acceptBooking(orderID, auth.currentUser.uid)}
              >
                <Text style={style.buttonText}>Accept Booking</Text>
              </TouchableOpacity>
            )}

          {userID && !isCompleted && role === "business" && (
            <TouchableOpacity
              style={style.button}
              onPress={() => {
                handleCompleteTask(orderID, userID)
              }}
            >
              <Text style={style.buttonText}>Complete Task</Text>
            </TouchableOpacity>
          )}

          {bookingData?.status === "scheduled" && role === "user" && (
            <TouchableOpacity
              style={style.button}
              onPress={() => cancelBooking(orderID, role)}
            >
              <Text style={style.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={style.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={style.buttonText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import { colours, styles } from "../components/style_u_booking.js";
//for date time dropdown picker
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
  setDoc,
  getDocs,
  query,
  where,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db, app, auth } from "../firebaseConfig";

import BgImage from "../assets/bg_UrgentTask.png";
import { style } from "../components/style_b_ordersummary.js";
import { FlatList } from "react-native";

//colours

const { darkest_coco, main_coco, beige, grey, white, yellow_brown, black } =
  colours;

export default function OrderSummary({ navigation }) {
  const [booking, setBooking] = useState([]);
  const [openDate, setOpenDate] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTemp, setIsTemp] = useState(false);

  const route = useRoute();
  const params = route?.params ?? {};
  const { orderID, userID, tempBookingInfo } = route.params || {};

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
    setSelectedTime,
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
          <FontAwesome5 name={item.icon} size={18} color={main_coco} />
        </View>
        <View style={style.taskInfo}>
          <Text style={style.cardTitle}>{item.title}</Text>
          {isAvailabilityCard &&
          Array.isArray(item.content) &&
          bookingData?.status !== "accepted" &&
          !isTemp ? (
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
          ) : isAvailabilityCard ? (
            // Show selected time string when accepted
            <View>
              {Array.isArray(bookingData?.availability) ? (
                bookingData.availability.map((slot, index) => (
                  <Text key={index} style={style.cardContent}>
                    {slot.date} | {slot.time}
                  </Text>
                ))
              ) : typeof bookingData?.availability === "object" ? (
                <Text style={style.cardContent}>
                  {bookingData.availability.date} |{" "}
                  {bookingData.availability.time}
                </Text>
              ) : (
                <Text style={style.cardContent}>
                  {bookingData?.availability || "No time selected"}
                </Text>
              )}
            </View>
          ) : (
            // For non-availability items
            <Text style={style.cardContent}>{item.content}</Text>
          )}
        </View>
      </View>
    );
  };
  const changeIsComplete = async (bookingId) => {
    if (!bookingData) {
      Alert.alert("Data not ready yet.");
      return;
    }
    if (bookingData.isCompleted) {
      Alert.alert("Error! This booking has already been completed.");
      return;
    }
    try {
      const bookingRef = doc(db, "booking", bookingId);
      await updateDoc(bookingRef, {
        isCompleted: true,
        completedAt: new Date(),
      });

      Alert.alert("Booking Completed!");
      navigation.goBack();
    } catch (err) {
      console.error("Failed to complete booking:", err);
      Alert.alert("Error", "Failed to complete booking.");
    }
  };

  async function confirmBooking() {
    try {
      if (!tempBookingInfo) {
        console.error("tempBookingInfo is undefined or null");
        Alert.alert("Error", "Booking info is missing.");
        return;
      }

      console.log("tempBookingInfo:", tempBookingInfo);

      const bookingRef = await addDoc(collection(db, "booking"), {
        ...tempBookingInfo,
      });

      console.log("Booking created:", bookingRef.id);

      await setDoc(
        bookingRef,
        { orderID: bookingRef.id },
        { merge: true },
      ).catch((err) => {
        console.error("Failed to merge orderID:", err);
      });

      Alert.alert("Booking confirmed!", "Your booking has been created.");
      navigation.navigate("UserHome");
    } catch (err) {
      console.error("Failed to confirm booking:", err);
      Alert.alert("Error", "Failed to confirm booking.");
    }
  }

  const acceptBooking = async (bookingId, currentWorkerId) => {
    try {
      if (!selectedTime) {
        Alert.alert("Please select a time slot before accepting the booking.");
        return;
      }

      //Prevent double booking
      //1. abstract new slots start and end date as date obj
      const [datePart, timePart] = selectedTime.split(" ");
      const startOfDay = `${datePart} 00:00`;
      const endOfDay = `${datePart} 23:59`;
      const newStart = new Date(`${datePart}T${timePart}:00`);
      const durationHours = bookingData.duration; // e.g. 2
      const newEnd = new Date(newStart.getTime() + durationHours * 3600e3);
      console.log("start, end", newStart, newEnd);

      //2. query this workers schedules for the same day
      const schedRef = collection(db, "users", currentWorkerId, "schedules");
      const dayQuery = query(
        schedRef,
        where("availability", ">=", startOfDay),
        where("availability", "<=", endOfDay),
      );
      const snap = await getDocs(dayQuery);

      //3. check each existing schedule overlap
      for (let doc of snap.docs) {
        const rec = doc.data();
        const availStr = rec.availability;
        const [exDate, exTime] = availStr.split(" ");
        const existingStart = new Date(`${exDate}T${exTime}:00`);
        const existingEnd = new Date(
          existingStart.getTime() + rec.duration * 3600e3,
        );

        console.log("existing:", existingStart, "->", existingEnd);

        if (newStart < existingEnd && existingStart < newEnd) {
          Alert.alert(
            "Time Conflict",
            "You already have a booking at that time. Please choose another slot.",
          );
          navigation.goBack();
          return;
        }
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
        status: "accepted",
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

  useEffect(() => {
    if (tempBookingInfo) {
      setBookingData(tempBookingInfo);
      setIsTemp(true);
      console.log("istemp", isTemp);

      const formatted = [
        {
          type: "category",
          title: tempBookingInfo.type,
          image: services_categories.find(
            (cat) => cat.title === tempBookingInfo.serviceType,
          )?.bannerImage,
        },
        {
          type: "availability",
          icon: "clock",
          title: `${tempBookingInfo.duration} hours`,
          content: Array.isArray(tempBookingInfo.availability)
            ? tempBookingInfo.availability
            : [tempBookingInfo.availability],
        },
        {
          type: "location",
          title: tempBookingInfo.postcode,
          icon: "map-marker-alt",
          content: `${tempBookingInfo.address}, ${tempBookingInfo.postcode}`,
        },
        {
          type: "note",
          title: tempBookingInfo.notes || "No notes",
          icon: "file-alt",
          content: tempBookingInfo.notes || "No notes",
        },
        {
          type: "price",
          title: "Price",
          icon: "dollar-sign",
          content: `$${tempBookingInfo.price || "35.99"}`,
        },
        {
          type: "Urgency",
          title: tempBookingInfo.urgency ? "Urgent" : "Scheduled",
          icon: tempBookingInfo.urgency ? "exclamation-triangle" : "clock",
          content: tempBookingInfo.urgency
            ? "This is an urgent task."
            : "This is a scheduled task.",
        },
        {
          type: "Notification",
          title: "Notification",
          icon: "bell",
          content: tempBookingInfo.notif
            ? "You will be notified when a worker accepts your booking."
            : "You will not be notified when a worker accepts your booking.",
        },

        {
          type: "Rating",
          title: "Rating",
          icon: "star",
          content: tempBookingInfo.rating
            ? `Your worker will has at least${tempBookingInfo.rating} stars.`
            : " No rating required",
        },

        {
          type: "Payment Method",
          title: "Cash On Delivery",
          icon: "money-bill-wave",
          content: "Pay in cash to the worker upon completion of the task.",
        },
      ];
      setBooking(formatted);
      return;
    }
    const bookingRef = doc(db, "booking", orderID);

    const unsubscribe = onSnapshot(bookingRef, (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();

      setBookingData(data);
      setIsCompleted(data.isCompleted || false);

      const matched_cat = services_categories.find(
        (cat) => cat.title === data.serviceType,
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
          title: data.postcode,
          icon: "map-marker-alt",
          content: `${data.address}, ${data.postcode}`,
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
        {
          type: "Payment Method",
          title: "Cash On Delivery",
          icon: "money-bill-wave",
          content: "Pay in cash to the worker upon completion of the task.",
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
            <Ionicons name="chevron-back" size={24} color={black} />
          </TouchableOpacity>

          <Text style={style.headerTitle}>Order Summary</Text>
          {/* place holder to balance the space*/}
          <View style={styles.backButton} />
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
                setSelectedTime,
              )
            }
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            scrollEnabled={false}
          />

          {/* Divider */}
          <View style={style.line} />

          {!userID && !isTemp && (
            <TouchableOpacity
              style={style.button}
              onPress={() => acceptBooking(orderID, auth.currentUser.uid)}
            >
              <Text style={style.buttonText}>Accept Booking</Text>
            </TouchableOpacity>
          )}

          {tempBookingInfo && (
            <TouchableOpacity
              style={style.button}
              onPress={() => confirmBooking()}
            >
              <Text style={style.buttonText}>Confirm Booking</Text>
            </TouchableOpacity>
          )}

          {userID && !isCompleted && (
            <TouchableOpacity
              style={style.button}
              onPress={() => changeIsComplete(orderID)}
            >
              <Text style={style.buttonText}>Completed Task</Text>
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";

import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import bg from "../assets/bg_UrgentTask.png";
import { style, colours } from "../components/style_bizUrgentTask";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

//extract data from firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function UrgentTask() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  useEffect(() => {

    const fetchUrgentTasks = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

      //get worker category
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const workerCategories = userData.subcategory || [];
        console.log(workerCategories);
        const q = query(collection(db, "booking"));//, where("urgency", "==", true)
        const querySnapshot = await getDocs(q);
        const formatted = [];

      
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // const avail = data.availability?.[0] || {};
        if (workerCategories.includes(data.type)) {
          formatted.push({
          id: data.orderID || doc.id,
          category: data.type || "Unknown",
          time: `${data.date || "N/A"} | ${data.time || "N/A"}`,
          location: `${data.state || ""}, ${data.postcode || ""}`,
          price: "$39.99",
          icon: getIcon(data.type),
        });
      };
      }) ;


        setTasks(formatted);
      } catch (err) {
        console.error("Error fetching urgent tasks:", err);
      }
    };

    fetchUrgentTasks();
  }, []);

  if (!fontsLoaded) return null;

  const getIcon = (type) => {
    switch (type) {
      case "General House Cleaning":
        return "broom";
      case "Home Organising":
        return "tshirt-crew";
      case "Air Conditioner Repair":
        return "air-conditioner";
      default:
        return "wrench";
    }
  };


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
          <Feather name="dollar-sign" size={16} color={colours.darkest_coco} />
          <Text style={style.taskDetailsText}>{item.price}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Text style={style.viewText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  //example structure of order summary
  // const dummytasks = [
  //   {
  //     id: "1",
  //     category: "Cleaning",
  //     time: "19 May 2025 | 5.00pm",
  //     location: "Penang GeorgeTown",
  //     price: "$35.99",
  //     icon: "broom",
  //   },
  //   {
  //     id: "2",
  //     category: "Home Organising",
  //     time: "19 May 2025 | 5.00pm",
  //     location: "Penang GeorgeTown",
  //     price: "$35.99",
  //     icon: "tshirt-crew",
  //   },
  // ];
  return (
    <ImageBackground source={bg} style={style.background}>
      <View style={style.container}>
        <View style={style.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={style.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colours.darkest_coco}
            />
          </TouchableOpacity>
          <Text style={style.headerTitle}>Urgent Task</Text>
          {/* <View style = {style.backButton}/> */}
        </View>

        <View style={style.searchContainer}>
          <Ionicons name="search" size={20} color={colours.darkest_coco} />
          <TextInput
            placeholder="Searching for any services?"
            placeholderTextColor={colours.darkest_coco}
            style={style.searchInput}
          />
          <Feather name="filter" size={20} color={colours.darkest_coco} />
        </View>

        {/* to be amend!!!!!!!!*/}
        <FlatList
          data={tasks}
          renderItem={showTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <View style={style.paginationContainer}>
          <TouchableOpacity>
            <Ionicons
              name="play-back-outline"
              size={24}
              color={colours.darkest_coco}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="play-forward-outline"
              size={24}
              color={colours.darkest_coco}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

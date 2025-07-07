import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
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
import bg from "../assets/bg_UrgentTask.png";
import { style, colours } from "../components/style_bizUrgentTask";
import { useFonts } from "expo-font";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, getAuth } from "../firebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { services_categories } from "../constants/category_constant";

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

  //search logic function
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUrgentTasks();
    }, []),
  );

  const fetchUrgentTasks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const workerCategories = userData.subcategory || [];

    const q = query(
      collection(db, "booking"),
      where("status", "==", "pending"),
      where("urgency", "==", false),
    );
    const querySnapshot = await getDocs(q);

    const formatted = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (workerCategories.includes(data.type)) {
        const iconData = getIcon(data.serviceType);
        formatted.push({
          id: data.orderID || docSnap.id,
          category: data.type || "Unknown",
          time: `${data.availability?.[0]?.date || "N/A"} | ${
            data.availability?.[0]?.time || "N/A"
          }`,
          location: `${data.state || ""}, ${data.postcode || ""}`,
          price: data.price || "35.99",
          icon: iconData.name,
          iconFamily: iconData.family,
        });
      }
    });

    setTasks(formatted);
    setFilteredTasks(formatted);
  };

  function handleSearch(text) {
    if (text.trim() === "") {
      setFilteredTasks(tasks);
      return;
    }

    const filtered = tasks.filter(
      (item) =>
        item.category.toLowerCase().includes(text.toLowerCase()) ||
        item.location.toLowerCase().includes(text.toLowerCase()) ||
        item.time.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredTasks(filtered);
  }

  if (!fontsLoaded) return null;

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

  const showTask = ({ item }) => (
    <View style={style.card}>
      <View style={style.taskIconWrap}>
        {renderIcon(item.icon, item.iconFamily, colours.main_coco, 30)}
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
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Order Summary", { orderID: item.id })
        }
      >
        <Text style={style.viewText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

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
          <Text style={style.headerTitle}>Scheduled Task</Text>
          {/* <View style = {style.backButton}/> */}
        </View>

        <View style={style.searchContainer}>
          <Ionicons name="search" size={20} color={colours.darkest_coco} />
          <TextInput
            placeholder="Searching for any services?"
            placeholderTextColor={colours.darkest_coco}
            style={style.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
          />
          <Feather name="filter" size={20} color={colours.darkest_coco} />
        </View>

        {/* to be amend!!!!!!!!*/}
        <FlatList
          data={filteredTasks}
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

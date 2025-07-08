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
import { auth } from "../firebaseConfig";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";

//extract data from firebase

import { db } from "../firebaseConfig";
import { debounce } from 'lodash';




export default function UrgentTask() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);

  const debouncedFetch = React.useCallback(debounce((params) => {
    fetchFilteredBookings(params).then(setResults);
  }, 500), // Wait 500ms between calls

  useFocusEffect(
    React.useCallback(() => {
      if (Object.keys(filter).length) {
        debouncedFetch({ minDuration, maxDuration });
      }
    }, [minDuration, maxDuration])
  ),
)


useFocusEffect(
  React.useCallback(() => {
    if (Object.keys(filter).length) {
      debouncedFetch({ minDuration, maxDuration });
    }
  }, [minDuration, maxDuration])
);
  //filter
  const route = useRoute();
  const filter = route.params?.filter || {};

  const {
    subcategory = [],
    priceRange = [0, Infinity],
    durationRange = [0, Infinity],

  } = filter;
  const [minPrice, maxPrice] = priceRange;
  const { minDuration, maxDuration } = React.useMemo(() => ({
    minDuration: durationRange[0], 
    maxDuration: durationRange[1]
  }), [durationRange[0], durationRange[1]]);

  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  // add search logic
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const setResults = results => {
    setTasks(results);
    setFilteredTasks(results);
  };
  useFocusEffect(
    React.useCallback(() => {
    if (Object.keys(filter).length) {
      // use the local min/max vars, not the raw priceRange array
      fetchFilteredBookings({
        minPrice,   maxPrice,
        subcategory,
        minDuration, maxDuration,

      }).then(setResults);
      } else {
        fetchUrgentTasks().then(setResults);
      }
    }, [])  // stringify so React re-runs whenever filters change
  );


  async function fetchFilteredBookings({
    minPrice, maxPrice,
    subcategory, 
    minDuration, maxDuration,

  }) {
    
    const bookingsRef = collection(db, "booking");
    console.log(maxDuration);
    console.log(minDuration);
    const constraint = [
      where("status", "==", "pending"),
      where("urgency", "==", true),
  
  ];
      if (subcategory.length > 0) {
          constraint.push(where("type", "in", subcategory));
        }


      // PRICE filter & sort (index: price DESC)
      // if (minPrice > 0) constraint.push(where("price", ">=", minPrice))
      // if (isFinite(maxPrice)) constraint.push(where("price", "<=", maxPrice))


      // LOCATION filter & sort (index: location ASC)
      // where("location", "==", location),
      // orderBy("location", "asc"),

      // SUBCATEGORY filter & sort (index: subcategory DESC)
if (minDuration > 0) constraint.push(where("duration", ">=", minDuration))
  if (isFinite(maxDuration)) constraint.push(where("duration", "<=", maxDuration))


    const q = query(
      bookingsRef,
      ...constraint
    );

    // 3) Execute and return results
    try{
    const snapshot = await getDocs(q);
    const formatted = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const iconData = getIcon(data.serviceType);
      return {
        id: data.orderID || docSnap.id,
        category: data.type || "Unknown",
        time: `${data.availability?.[0]?.date || "N/A"} | ${data.availability?.[0]?.time || "N/A"}`,
        location: `${data.state || ""}, ${data.postcode || ""}`,
        price: data.price || '35.99',
        icon: iconData.name,
        iconFamily: iconData.family,
      };
    });
    return formatted;
  }catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Error", "Failed to load tasks");
      return [];
  }
}

  const fetchUrgentTasks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return [];

    const userData = userSnap.data();
    const workerCategories = userData.subcategory || [];

    const q = query(
      collection(db, "booking"),
      where("status", "==", "pending"),
      where("urgency", "==", true),
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
    return formatted;
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
          <Text style={style.headerTitle}>Urgent Task</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate("FilterScreen")}>
            <Feather name="filter" size={20} color={colours.darkest_coco} />
          </TouchableOpacity>
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

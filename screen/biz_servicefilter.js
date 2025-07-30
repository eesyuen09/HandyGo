import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { style, colours } from "../components/style_bizfilter";
import { useFonts } from "expo-font";
import { FlatList } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { max } from "moment";
import { useRoute } from "@react-navigation/native";

export default function FilterScreen({ navigation }) {
  const route = useRoute();
  const { urgency } = route.params;
  console.log(urgency);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minDuration, setMinDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const [subcategory, setSubcategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  // const [orderByDate, setOrderByDate] = useState(false);
  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  useFocusEffect(
    useCallback(() => {
      const fetchSubcategory = async () => {
        try {
          const uid = auth.currentUser.uid;
          const docRef = doc(db, "users", uid);
          const userSnap = await getDoc(docRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const filtered = (data.subcategory || []).filter(
              (item) => item !== "",
            );
            setSubcategory(filtered);
          }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubcategory();
    }, []),
  );

  const toggleSubcategory = (item) => {
    if (selectedSubcategory.includes(item)) {
      setSelectedSubcategory((prev) => prev.filter((i) => i !== item));
    } else {
      setSelectedSubcategory((prev) => [...prev, item]);
    }
  };

  const renderSubcategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleSubcategory(item)}
      style={style.checkboxItem}
    >
      <Ionicons
        name={
          selectedSubcategory.includes(item) ? "checkbox" : "square-outline"
        }
        size={24}
        color="#704F38"
      />
      <Text style={style.checkboxLabel}>{item}</Text>
    </TouchableOpacity>
  );

  const applyFilters = () => {
    const filter = {};
    if (selectedSubcategory.length > 0) {
      filter.subcategory = selectedSubcategory;
    }

    if (minPrice != 0 || maxPrice != 0) {
      filter.priceRange = [minPrice, maxPrice];
    }

    if (minDuration != 0 || maxDuration != 0) {
      filter.durationRange = [minDuration, maxDuration];
    }

    // if (orderByDate) {
    //     filter.orderByDate = orderByDate;
    // }
    if (urgency) {
      navigation.navigate("Business Urgent Task", { filter });
    } else {
      navigation.navigate("Business Scheduled Task", { filter });
    }
    console.log(filter);
  };

  return (
    <View style={style.container}>
      {/* Title */}
      <View style={style.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={style.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colours.black} />
        </TouchableOpacity>

        <Text
          style={[
            style.headerTitle,
            { fontSize: 30, color: "red", backgroundColor: "yellow" },
          ]}
        >
          Filter
        </Text>

        <View style={style.backButton} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* filter by servicetype */}
        <FlatList
          data={subcategory}
          renderItem={renderSubcategory}
          keyExtractor={(item) => item}
          scrollEnabled={false}
        />

        {/* filter by price range */}
        <View>
          <Text style={style.sectionTitle}>Min Price: ${minPrice}</Text>
          <Text style={style.sectionTitle}>Max Price: ${maxPrice}</Text>
          <MultiSlider
            values={[minPrice, maxPrice]}
            sliderLength={250}
            onValuesChange={([min, max]) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            min={20}
            max={200}
            step={10}
            selectedStyle={{ backgroundColor: colours.main_coco }}
            unselectedStyle={{ backgroundColor: colours.grey }}
            markerStyle={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: colours.main_coco,
            }}
            style={{ marginLeft: 20 }}
          />
        </View>

        {/* filter by duration */}
        <View style={{ width: "100%", paddingVertical: 20 }}>
          <Text style={style.sectionTitle}>
            Min Duration: {minDuration} hours
          </Text>
          <Text style={style.sectionTitle}>
            Max Duration: {maxDuration} hours
          </Text>

          <MultiSlider
            values={[minDuration, maxDuration]}
            min={1}
            max={12}
            step={1}
            sliderLength={250}
            onValuesChange={([min, max]) => {
              setMinDuration(min);
              setMaxDuration(max);
            }}
            selectedStyle={{ backgroundColor: colours.main_coco }}
            unselectedStyle={{ backgroundColor: colours.grey }}
            markerStyle={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: colours.main_coco,
            }}
            style={{ marginLeft: 20 }}
          />
        </View>

        {/* <TouchableOpacity
            onPress={() => setOrderByDate(!orderByDate)}
            style={style.checkboxItem}
        >
            <Ionicons
            name={orderByDate ? 'checkbox' : 'square-outline'}
            size={24}
            color="#704F38"
            />
            <Text style={style.checkboxLabel}>Order By Date</Text>
        </TouchableOpacity> */}

        {/*Apply filter */}
        <TouchableOpacity onPress={applyFilters} style={style.button}>
          <Text style={style.buttonText}>Apply Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

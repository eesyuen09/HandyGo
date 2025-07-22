import React, { useState, useRef, useEffect } from "react";
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

import { colours, styles } from "../components/style_u_home";
import { SafeAreaView } from "react-native-safe-area-context";

//fonts
import { useFonts } from "expo-font";

//firebase storage
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

//category import
import { services_categories } from "../constants/category_constant";

//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import {
  Feather,
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function UserHome({ navigation }) {
  const services = [
    {
      icon: (
        <MaterialIcons
          name="cleaning-services"
          size={30}
          color={colours.darkest_coco}
        />
      ),
      label: "Cleaning",
    },
    {
      icon: (
        <FontAwesome5
          name="truck-moving"
          size={30}
          color={colours.darkest_coco}
        />
      ),
      label: "Moving",
    },
    {
      icon: <Feather name="tool" size={35} color={colours.darkest_coco} />,
      label: "Repair",
    },
    {
      icon: <FontAwesome5 name="tree" size={30} color={colours.darkest_coco} />,
      label: "Outdoor Services",
    },
    // { icon: <MaterialCommunityIcons name="file-cabinet" size={30} color = {colours.darkest_coco} />, label: 'Home\nOrganization'},
    {
      icon: (
        <FontAwesome6
          name="hands-holding"
          size={30}
          color={colours.darkest_coco}
        />
      ),
      label: "Maintenance",
    },
    // { icon: <FontAwesome6 name="border-all" size={30} color = {colours.darkest_coco}/>, label: 'All' },
  ];

  // const iconMap = {
  //     'cleaning.png': require('../assets/icons/cleaning.png'),
  //     'organizing.png': require('../assets/icons/organizing.png'),
  //     'repair_icon.png': require('../assets/icons/repair_icon.png'),
  //     'all.png': require('../assets/icons/all.png'),
  // };

  // const serviceBanners = [
  //   { image: "cleaning_banner.png", label: "Deep Cleaning" },
  //   { image: "home_organization.png", label: "Home Organizing" },
  //   { image: "aircond_repair.png", label: "Air Conditioner Repair" },
  //   { image: "Moving.png", label: "House Moving" },
  //   { image: "gasleak.png", label: "Gas Leak Detection" },
  //   { image: "outdoor_banner.png", label: "Gardening" },
  // ];

  const serviceBanners = services_categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      label: sub.label,
      bannerImage: sub.bannerImage,
      serviceType: cat.title,
    }))
  );

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // const bannerImageMap = {
  //   "Moving.png": require("../assets/images/Moving.png"),
  //   "home_organization.png": require("../assets/images/home_organization.png"),
  //   "aircond_repair.png": require("../assets/images/aircond_repair.png"),
  //   "cleaning_banner.png": require("../assets/images/cleaning_banner.png"),
  //   "gasleak.png": require("../assets/images/gasleak.png"),
  //   "outdoor_banner.png": require("../assets/images/outdoor_banner.png"),
  // };

  // category press
  const handleCategoryPress = (serviceType) => {
    const serviceData = services_categories.find(
      (c) => c.title === serviceType
    );
    console.log(serviceData);
    navigation.navigate("UserBooking", {
      serviceType: serviceData.title,
      subcategory: serviceData.subcategories[0],
      description: serviceData.description,
      price: serviceData.price,
      questions: serviceData.questions,
      // bannerImage: serviceData.bannerImage,
      // icon: serviceData.icon,
    });
  };

  // subcategory press
  const handleSubcategoryPress = (subcategory) => {
    const serviceData = services_categories.find((category) =>
      category.subcategories.some((s) => s.label === subcategory)
    );

    if (!serviceData) {
      console.error("Service type not found", subcategory);
      return;
    }

    navigation.navigate("UserBooking", {
      serviceType: serviceData.title,
      subcategory: subcategory,
      description: serviceData.description,
      price: serviceData.price,
      questions: serviceData.questions,
      // bannerImage: serviceData.bannerImage,
      // icon: serviceData.icon,
    });
  };
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [randomBanners, setRandomBanners] = useState([]);

  useEffect(() => {
    setRandomBanners(shuffleArray(serviceBanners));
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSuggestions([]);
      return;
    }

    const matches = [];

    for (const category of services_categories) {
      if (category.title.toLowerCase().includes(query)) {
        matches.push({
          type: "category",
          title: category.title,
          description: category.description,
          price: category.price,
          subcategory: category.subcategories[0].label,
        });
      }

      for (const sub of category.subcategories) {
        const subLabel = sub.label;
        if (subLabel.toLowerCase().includes(query)) {
          matches.push({
            type: "subcategory",
            title: category.title,
            subcategory: subLabel,
            description: category.description,
            price: category.price,
          });
        }
      }
    }

    setSuggestions(matches);
  }, [searchQuery]);

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    for (const category of services_categories) {
      if (category.title.toLowerCase().includes(query)) {
        navigation.navigate("UserBooking", {
          serviceType: category.title,
          subcategory: category.subcategories[0].label,
          description: category.description,
          price: category.price,
        });
        return;
      }

      for (const sub of category.subcategories) {
        if (sub.label.toLowerCase().includes(query)) {
          navigation.navigate("UserBooking", {
            serviceType: category.title,
            subcategory: sub.label,
            description: category.description,
            price: category.price,
          });
          return;
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.frame}>
      {/* Top Search Bar */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback
          onPress={() => searchInputRef.current?.focus()}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
              <AntDesign
                name="search1"
                size={24}
                color="white"
                style={styles.searchIcon}
              />
              <TextInput
                ref={searchInputRef}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Looking for any service?"
                editable={true}
                placeholderTextColor="white"
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
            </View>

            {/* Suggestions List */}
            {suggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      navigation.navigate("UserBooking", {
                        serviceType: item.title,
                        subcategory: item.label,
                        description: item.description,
                        price: item.price,
                      });
                      setSuggestions([]);
                      setSearchQuery("");
                    }}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionText}>
                      {item.label} ({item.title})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </SafeAreaView>
        </TouchableWithoutFeedback>

        {/* Shortcut Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shortcut</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.iconRow}
          >
            {services.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.icon}
                onPress={() => handleCategoryPress(item.label)}
              >
                <View style={styles.circle}>{item.icon}</View>
                <Text style={styles.iconLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Services You May Like Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Service You May Like </Text>
          {/* {serviceBanners.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceBanner}
              onPress={() => handleSubcategoryPress(item.label)}
            >
              <View>
                <Text style={styles.bannerLabel}>{item.label}</Text>
                <Image
                  source={bannerImageMap[item.image]}
                  style={styles.serviceBanner}
                />
              </View>
            </TouchableOpacity>
          ))} */}
          {randomBanners.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.serviceBanner}
              onPress={() => handleSubcategoryPress(item.label)}
            >
              <Image source={item.bannerImage} style={styles.serviceBanner} />
              <Text style={styles.bannerLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
import {doc, getDoc} from 'firebase/firestore';
import { auth, db} from '../firebase';
import { style } from "../components/style_adddetails";
import { useFonts } from "expo-font";


export default function FilterScreen({navigation}){
    const [minPrice, setMinPrice] = useState(10);
    const [maxPrice, setMaxPrice] = useState(100);
    const [minDuration, setMinDuration] = useState(null);
    const [maxDuration, setMaxDuration] = useState(null);
    const [subcategory, setSubcategory] = useState([]);
    const [orderByDate, setOrderByDate] = useState(false);
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
                const docRef = doc(db, 'users', uid);
                const userSnap = await getDoc(docRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    const filtered = (data.subcategory || []).filter(item => item !== "");
                    setSubcategory(filtered);
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
            };
            fetchSubcategory();
        }, [])
        );

    const toggleSubcategory = (item) => {
        if (selectedSubcategories.includes(item)) {
            setSelectedSubcategories(prev => prev.filter(i => i !== item));
        } else {
            setSelectedSubcategories(prev => [...prev, item]);
        }
        };

    const renderSubcategory = ({ item }) => (
        <TouchableOpacity
            onPress={() => toggleSubcategory(item)}
            style={style.checkboxItem}
        >
            <Ionicons
            name={selectedSubcategories.includes(item) ? 'checkbox' : 'square-outline'}
            size={24}
            color="#704F38"
            />
            <Text style={style.checkboxLabel}>{item}</Text>
        </TouchableOpacity>
        );

    function onApplyFilters(filters){
        navigation.navigate("Business Urgent Task", {filters});

    };
    


    return (
        <View style = {style.container}>
            <ScrollView style = {style.inner}>
            <View style={style.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style = {style.backButton}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
                <Text style={styls.headerText}>Filter</Text>
            </View>

            {/* filter by servicetype */}
            <FlatList
                data={subcategory}
                renderItem={renderItem}
                keyExtractor={(item) => item}
            />

            {/* filter by price range */}
            <View>
                <Text>Min Price: ${minPrice}</Text>
                <Slider
                    minimumValue={20}
                    maximumValue={200}
                    step={10}
                    value={minPrice}
                    onValueChange={(value) => setMinPrice(value)}
                />

                <Text>Max Price: ${maxPrice}</Text>
                <Slider
                    minimumValue={20}
                    maximumValue={200}
                    step={10}
                    value={maxPrice}
                    onValueChange={(value) => setMaxPrice(value)}
                />
            </View>

            <View>
                <Text>Duration</Text>
            
            {/* filter by duration */}
                <Slider
                    minimumValue={1}
                    maximumValue={12}
                    step={1}
                    value={minDuration}
                    onValueChange={(value) => setMinDuration(value)}
                />

                <Text>Max Price: ${maxPrice}</Text>
                <Slider
                    minimumValue={1}
                    maximumValue={12}
                    step={1}
                    value={maxDuration}
                    onValueChange={(value) => setMaxDuration(value)}
                />
            </View>

            {/* order by date? */}
            <TouchableOpacity
                onPress={() => setOrderByDate(true)}
                style={[
                    style.button,
                    orderByDate? style.buttonSelected : style.buttonUnselected,
                ]}
                >
                <Text style={style.buttonText}>Order By Date</Text>
            </TouchableOpacity>
        </ScrollView>
        </View>
    )
}
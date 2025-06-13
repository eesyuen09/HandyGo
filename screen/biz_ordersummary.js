import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { colours, styles } from "../components/style_u_booking.js";


//Keyboard Avoiding Wrapper
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper.js";
import {
  FontAwesome5,
  AntDesign,
  MaterialIcons,
  Entypo,
  FontAwesome,
  Feather,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { services_categories } from "../constants/category_constant";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDoc, doc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, app } from "../firebaseConfig";

import BgImage from '../assets/bg_UrgentTask.png';
import {style} from '../components/style_b_ordersummary.js'

//colours


const {
  darkest_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black
} = colours;




export default function OrderSummary({navigation}){

     const serviceBanners = [
        { image: "cleaning_banner.png", label: "Cleaning" },
        { image: "home_organization.png", label: "Cleaning" },
        { image: "aircond_repair.png", label: "Repair" },
        { image: "Moving.png", label: "Moving" },
        { image: "gasleak.png", label: "Maintenance" },
        { image: "outdoor_banner.png", label: "Outdoor Services" },
    ];

    const bannerImageMap = {
        "Moving.png": require("../assets/images/Moving.png"),
        "home_organization.png": require("../assets/images/home_organization.png"),
        "aircond_repair.png": require("../assets/images/aircond_repair.png"),
        "cleaning_banner.png": require("../assets/images/cleaning_banner.png"),
        "gasleak.png": require("../assets/images/gasleak.png"),
        "outdoor_banner.png": require("../assets/images/outdoor_banner.png"),
    };

    async function fetchBooking(orderID) {
        const docRef = doc(db,'booking',orderID);
        //creates reference to the document you want to retrieve
        const docSnap = await getDoc(docRef);
        //getDoc is the function to retrieve data from the document reference

        if (docSnap.exists()){
            // console.log('Booking Info',docSnap.data());
            const data = docSnap.data();
            return data;
        }else{
            console.log("No such booking!");
            return;
        }
        };
    const route = useRoute();
    const { orderID } = route.params;
    

    const [booking, setBooking] = useState([]);

    //find category with data array
    console.log(booking);
    const categoryItem = booking.find(item => item.type === 'category');
    console.log('categoryItem:',categoryItem); // { type: 'category', title: 'Plumbing Services', image: '...' }

    const bookingDetails = booking.filter(item => item.type !== 'category');
    // console.log(bookingDetails); // array of availability, location, etc.

    const renderCard = ({ item }) => (
    <View style={style.cardContainer}>
        <View style={style.taskIconWrap}>
            <FontAwesome5 name={item.icon} size={18} color={main_coco} />
        </View>
        <View style={style.taskInfo}>
            <Text style={style.cardTitle}>{item.title}</Text>
            {Array.isArray(item.content) ? (
                item.content.map((text, index) => (
                    <Text key={index} style={style.cardContent}>{text}</Text>
                ))
            ) : (
                <Text style={style.cardContent}>{item.content}</Text>
            )}
        </View>
    </View>
);

    useEffect(() => {

        async function loadData(){
            const data = await fetchBooking(orderID);

            if (data) {
                console.log('hi');
                console.log(data.serviceType);

                const matched_cat = services_categories.find(cat => cat.title === data.serviceType);
                const image = matched_cat.bannerImage;
                if (!image) {
                    console.warn(`No banner image found for type: ${data.type}`);
                }

                const formatted = [
                    {
                    type: 'category',
                    title: data.type,
                    image: image,
                    },
                    {
                    type : 'availability',
                    icon: 'clock',
                    title: `${data.duration} hours`,
                    content: data.availability || [],
                    },
                    {
                    type : 'location',
                    title: data.state,
                    icon: 'location-pin',
                    content: `${data.address || ''}, ${data.postcode || ''}, ${data.state || ''}`,
                    },
                    {
                    type: 'note',
                    title: data.notes || "No notes",
                    icon: 'file-text',
                    content: 'To be uploaded picture',
                    },
                    {
                    type: 'price',
                    title: "Price",
                    icon: 'yen',
                    content: `$${data.price || '35.99'}`,
                    },
                ];

                console.log('format', formatted);
                setBooking(formatted);
                }
        }
        loadData();
        },[orderID]);
    if (!booking) return null;
    return (
        <ImageBackground source ={BgImage} style = {style.background}>
            <View style = {style.container}>
                <View style = {style.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style = {style.backButton}>
                        <Ionicons name = 'chevron-back' size = {24} color= {black} />
                    </TouchableOpacity>

                    <Text style = {style.headerTitle}>Order Summary</Text>

                    {/* place holder to balance the space*/}
                    <View style = {styles.backButton} /> 
                </View>


                <ScrollView style = {{flex: 1, padding:20}}>
                {/* category container */}
                {categoryItem && (
                <View style = {style.categoryContainer}>
                    <ImageBackground
                        style = {style.image} 
                        source= {categoryItem.image}
                        imageStyle = {{ borderRadius: 15}}>
                    
                    {categoryItem && (
                        <View style = {style.overlay}>
                            <Text style = {style.overlayTitle}>{categoryItem.title}</Text>
                        </View>
                    )}
                    </ImageBackground>
                </View>
                )}

                {/* order details */}
                <Text style = {style.titleBelow}>Order Details</Text>

                {/* <View style = {style.cardContainer}>
                    <View style = {style.taskIconWrap}>
                        <FontAwesome5 name = {getActionFromState(.icon)}
                    </View> */}
                
                </ScrollView>
                </View>
            </ImageBackground>


            
        );

    };
    

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

import {BgImage} from '../assets/bg_UrgentTask.png';
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
        { image: "cleaning_banner.png", label: "Deep Cleaning" },
        { image: "home_organization.png", label: "Home Organizing" },
        { image: "aircond_repair.png", label: "Air Conditioner Repair" },
        { image: "Moving.png", label: "House Moving" },
        { image: "gasleak.png", label: "Gas Leak Detection" },
        { image: "outdoor_banner.png", label: "Gardening" },
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
            console.log('Booking Info',docSnap.data());
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
    const categoryItem = booking.find(item => item.type === 'category')



    useEffect(() => {
        async function loadData(){
            const data = await fetchBooking(orderID);
            if (data){
                const matched = serviceBanners.find((b) => b.label === data.type);
                const image = matched.image;
                //collect the data and transform into an array
                const formatted = [
                    {
                        type: 'category',
                        title: data.type,
                        image : image,
                    },
                    {
                        type : 'availability',
                        icon: 'clock',
                        title: `${data.duration} hours`,
                        content: data.availability || [],
                    },
                    // {
                    //     type = 'gender preference',
                    //     title : data.gender || '',
                    // },
                    {
                        type : 'location',
                        title: data.state,
                        icon: 'location-pin',
                        content: `${data.address || ''}, ${data.postcode}|| '', ${data.state}`,

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
                        content: `$${data.price}`

                    },


                ];

                setBooking(formatted);
            }
        }
        loadData();
        },[orderID]);
    if (!booking) return null;
    return (
        <View style = {{flex: 1}}>
        <ImageBackground source ={BgImage} style = {{position: 'absolute', width: "100%", height: '100%'}} />

        <View style = {style.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style = {style.backButton}>
                <Ionicons name = 'chevron-back' size = {24} color= {black} />
            </TouchableOpacity>

            <Text style = {style.title}>Order Summary</Text>

            {/* place holder to balance the space*/}
            <View style = {styles.backButton} /> 
        </View>

        <ScrollView style = {{flex: 1, padding:20}}>

            {/* category container */}
            <View style = {style.categoryContainer}>
                <Image 
                    style = {style.image} 
                    source= {bannerImageMap[booking.find(item => item.type === 'category')?.image]} />
                
                {categoryItem && (
                    <View style = {style.overlay}>
                        <Text style = {style.overlayTitle}>{categoryItem.title}</Text>
                    </View>
                )}
            </View>

            {/* order details */}
            <Text style = {style.titleBelow}>Order Details</Text>

            {/* <View style = {style.cardContainer}>
                <View style = {style.taskIconWrap}>
                    <FontAwesome5 name = {getActionFromState(.icon)}
                </View> */}
            
            </ScrollView>
        </View>


        
    );

};
 

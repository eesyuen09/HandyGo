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
//for date time dropdown picker
import DropDownPicker from "react-native-dropdown-picker";

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
import { getDoc, doc, updateDoc, onSnapshot, collection, addDoc} from "firebase/firestore";
import { db, app, auth } from "../firebaseConfig";

import BgImage from '../assets/bg_UrgentTask.png';
import {style} from '../components/style_b_ordersummary.js'
import { FlatList } from "react-native";

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
    const [booking, setBooking] = useState([]);
    const [openDate, setOpenDate] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);



    //new
    const [isCompleted, setIsCompleted] = useState(false);

    const route = useRoute();
    const { orderID, userID} = route.params;
    

    

    //find category with data array
    
    const categoryItem = booking.find(item => item.type === 'category');
    // console.log('categoryItem:',categoryItem); // { type: 'category', title: 'Plumbing Services', image: '...' }

    const bookingDetails = booking.filter(item => item.type !== 'category');
    console.log(bookingDetails); // array of availability, location, etc.




    const renderCard = (item , index, openDate,setOpenDate,selectedTime, setSelectedTime) => {
        

        const isAvailabilityCard = item.type === 'availability';
        //convert availability array to dropdown items
        const availabilityOptions = isAvailabilityCard ?
            item.content.map((slot, index) => ({
                label: `${slot.date} | ${slot.time}`,
                value: `${slot.date} ${slot.time}`,
                key: index.toString(),
            }))
            :[];

        return (
        <View style={style.cardContainer}>
            <View style={style.taskIconWrap}>
                <FontAwesome5 name={item.icon} size={18} color={main_coco} />
            </View>
            <View style={style.taskInfo}>
                <Text style={style.cardTitle}>{item.title}</Text>
                    {Array.isArray(item.content) ? (
                        item.content.map((entry, index) => (
                            typeof entry === 'object' ? (
                            <Text key={index} style={style.cardContent}>
                                {entry.date} | {entry.time}
                            </Text>
                            ) : (
                            <Text key={index} style={style.cardContent}>{entry}</Text>
                            )
                        ))
                        ) : (
                        <Text style={style.cardContent}>{item.content}</Text>
                        )
                    }
            </View>
        </View>
        );
    };


    const changeIsComplete = async (bookingId) => {
    try {

        const bookingRef = doc(db, "booking", bookingId);

        //check if current booking data exist
        const bookingSnap = await getDoc(bookingRef);
        if(!bookingSnap.exists()) {
            Alert.alert('Error, Booking does not exist.');
            return;
        }

        const bookingData = bookingSnap.data();

        if(bookingData.isCompleted){
            Alert.alert("Error! This booking has already been completed.");
            return;
        }
        
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

    

    useEffect(() => {  
        const scheduleRef = doc(db, 'users', userID, 'schedules', orderID);

        //fetch is completed status
        const bookingRef = doc(db,'booking',orderID);
        

        const unsubscribe = onSnapshot(scheduleRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                const matched_cat = services_categories.find(cat => cat.title === data.serviceType);
                const image = matched_cat?.bannerImage;

                const formatted = [
                    {
                        type: 'category',
                        title: data.type,
                        image: image,
                    },
                    {
                        type: 'availability',
                        icon: 'clock',
                        title: `${data.duration} hours`,
                        content: [data.availability], // wrapped in array for consistency
                    },
                    {
                        type: 'location',
                        title: data.state,
                        icon: 'map-marker-alt',
                        content: `${data.address || ''}, ${data.postcode || ''}, ${data.state || ''}`,
                    },
                    {
                        type: 'note',
                        title: data.notes || "No notes",
                        icon: 'file-alt',
                        content: 'To be uploaded picture',
                    },
                    {
                        type: 'price',
                        title: "Price",
                        icon: 'dollar-sign',
                        content: `$${data.price || '35.99'}`,
                    },
                ];

                setBooking(formatted);
            } else {
                console.log("Schedule document does not exist");
            }
        });
        const fetchBookingStatus = async () => {
            const bookingSnap = await getDoc(bookingRef);
            if (bookingSnap.exists()) {
                const bookingData = bookingSnap.data();
                setIsCompleted(bookingData.isCompleted); // ✅ set state
            }
        };
        fetchBookingStatus();

        return () => unsubscribe();
    }, [orderID, userID]);
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

                <FlatList
                    data = {bookingDetails}
                    renderItem = {({item, index})=>renderCard(item, index, openDate, setOpenDate, selectedTime, setSelectedTime)}
                    keyExtractor={(item,index) => index.toString()}
                    contentContainerStyle = {{paddingBottom: 100}}
                    scrollEnabled = {false}
                    />

                {/* Divider */}
                <View style={style.line} />

                {!isCompleted && (
                    <TouchableOpacity
                    style = {style.button}
                    onPress={() => changeIsComplete(orderID)}
                >
                    <Text style = {style.buttonText}>Completed Task</Text>
                    </TouchableOpacity>
                )}



               
                <TouchableOpacity 
                    style = {style.button}
                    onPress={() => navigation.goBack()}>
                    <Text style = {style.buttonText}>Back</Text>
                </TouchableOpacity>
               

                </ScrollView>
                </View>
            </ImageBackground>

        );

    };
    


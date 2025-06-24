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
import { getDoc, doc, updateDoc, onSnapshot, collection, setDoc} from "firebase/firestore";
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
    const [open,setOpen] = useState(false);
    const [value,setValue] = useState(null);

    const route = useRoute();
    const { orderID } = route.params;
    

    

    //find category with data array
    
    const categoryItem = booking.find(item => item.type === 'category');
    // console.log('categoryItem:',categoryItem); // { type: 'category', title: 'Plumbing Services', image: '...' }

    const bookingDetails = booking.filter(item => item.type !== 'category');
    console.log(bookingDetails); // array of availability, location, etc.

    //add schedule as subcollection in workers' firestore
    const addScheduleForWorker = async (workerID, orderID) =>{
        // const scheduleRef = collection(db, 'users', workerId, 'schedules');
        const docRef = doc(db,'booking',orderID);
        //creates reference to the document you want to retrieve
        const docSnap = await getDoc(docRef);
        //getDoc is the function to retrieve data from the document reference

        if (!docSnap.exists()) {
            console.log("No such booking!");
           return;
        }
        const data = docSnap.data();
        const scheduleDocRef = doc(db, 'users', workerID,'schedules',orderID);


        
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
                {isAvailabilityCard ? (
                    <DropDownPicker
                        open = {openDate}
                        value = {selectedTime}
                        items = {availabilityOptions}
                        setOpen={setOpenDate}
                        setValue={setSelectedTime}
                        setItems ={() =>{}}
                        placeholder="Select a time slot"
                        zIndex={1000}
                        style = {style.dropdownContainer}
                        textStyle = {style.cardContent}
                    />
                ):(
                    Array.isArray(item.content) ? (
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
                    )}

            </View>
        </View>
        );
    };

    const acceptBooking = async (bookingId, currentWorkerId) => {
    try {
        const bookingRef = doc(db, "booking", bookingId);

        //check if current booking data exist
        const bookingSnap = await getDoc(bookingRef);
        if(!bookingSnap.exists()) {
            Alert.alert('Error, Booking does not exist.');
            return;
        }

        const bookingData = bookingSnap.data();

        if(bookingData.status === 'accepted'){
            Alert.alert("Error! This booking has already been accepted.");
            return;
        }
        
        await updateDoc(bookingRef, {
            status: "accepted",
            workerId: currentWorkerId,
            acceptedAt: new Date(),
            });

            Alert.alert("Booking accepted!");
            addScheduleForWorker(currentWorkerId,orderID);
            navigation.goBack();

        // Optional: re-fetch the tasks to refresh the UI
        // setTasks((prevTasks) =>
        // prevTasks.filter((task) => task.id !== bookingId)
        // );
        } catch (err) {
            console.error("Failed to accept booking:", err);
            Alert.alert("Error", "Failed to accept booking.");
        }
        };

    

    useEffect(() => {
        const docRef = doc(db, "booking", orderID);

        function handleDocUpdate(docSnap) {
            if(docSnap.exists()) {
                const data = docSnap.data();

                const matched_cat = services_categories.find(cat => cat.title === data.serviceType);
                console.log('matched_cat',matched_cat);
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
                    content: data.availability || [],
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
                console.log("Document does not exist");
            }
        }
        const unsubscribe = onSnapshot(docRef,handleDocUpdate);

        return() => unsubscribe();
    },[orderID]);
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

                <TouchableOpacity 
                    style = {style.button}
                    onPress={() => acceptBooking(orderID,auth.currentUser.uid)}>
                    <Text style = {style.buttonText}>Accept Booking</Text>
                </TouchableOpacity>

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
    

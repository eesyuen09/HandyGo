import React, { use, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList,ImageBackground } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Ionicons } from '@expo/vector-icons';
import {colours,style} from '../components/style_bizactivitypage';
import BgImage from '../assets/images/biz_activitypageBG.png';
import {getDoc, doc, onSnapshot} from 'firebase/firestore';
import {db, auth} from '../firebaseConfig';
import { getDocs,collection } from 'firebase/firestore';
import { useEffect } from 'react';
import { useFonts } from "expo-font";

  

const {
  darkest_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black,
  purple
} = colours;

export default function Biz_activitypage({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedTasks, setSelectedTasks] = useState([]);

  const [markedDates, setMarkedDates] = useState([]);

  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  const typeColorMap = {
        'Cleaning': '#fcd6c5',
        'Home Organising': '#d1a03f',
        'Air Conditioner Repair': '#a6d1e6',
        'Plumbing Services': '#b0e0a8',
        'Moving Services': '#f5c16c',
    };

    console.log('grey', colours.grey);

  const renderUpcomingTask = ({item}) => {
    const date = new Date(item.time);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const dotColor = typeColorMap[item.type] || colours.darkest_coco;

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('Business Order Summary', {orderID: item.orderID})}
            
            style = {[{backgroundColor: colours.grey},style.card]}>
        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: dotColor,
                marginRight: 10,
            }} />
            <View>
                <Text style = {style.cardTitle}>{item.type}</Text>
                <Text style = {style.date}>{formattedDate}</Text>
            </View>  
        </View>
        <Ionicons name = 'chevron-forward' size ={20} color={colours.darkest_coco}/>
    </TouchableOpacity>
    );
  };

  



  useEffect(() => {
    
    const fetchSelectedTasks = async () => {
        const user = auth.currentUser;
        if (!user){return;}
        
        const selectedTasksRef = collection(db,'users',user.uid,'schedules');
        const selectedTasksSnap = await getDocs(selectedTasksRef);
    
        const tasksList = [];

        selectedTasksSnap.forEach((docSnap) => {
            const data = docSnap.data();
            // console.log('data',data);
            //add object into tasksList array
            tasksList.push({
                orderID: data.orderID,
                type : data.type,
                time : data.availability,
            
            });
        });     
        setSelectedTasks(tasksList);
        
        const marked = [];
        tasksList.forEach(task => {
            const dotColor = typeColorMap[task.type] || colours.darkest_coco;
            const [dateOnly] = task.time.split(" ");
            marked.push({
                date: dateOnly,
                style:{
                    backgroundColor: dotColor,
                    borderRadius: 20,
                },
                textStyle: {
                    color: colours.white,
                },
            });
        });
        setMarkedDates(marked);
        console.log('markedDates state updated',marked);
        };
        fetchSelectedTasks();
    },[]);

    useEffect(() => {
        console.log("State changed - selectedTasks:", selectedTasks);
        }, [selectedTasks]);

        useEffect(() => {
        console.log("State changed - markedDates:", markedDates);
        }, [markedDates]);
    

  return (
    <ImageBackground 
        style = {style.background}
        source = {BgImage}
    >
        <View style = {style.container}>
    

        {/* Calendar Title */}
        <View style = {style.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style = {style.backButton}>
                <Ionicons name = 'chevron-back' size ={24} color ={black}/>
            </TouchableOpacity>

            <Text style = {style.headerTitle}>Calendar</Text>
            <View style = {style.backButton}/>
        </View>

        {/* Calendar Component */}
        <View style = {style.calendarContainer}>
            <CalendarPicker
                onDateChange={setSelectedDate}
                selectedDayColor= {colours.yellow_brown}
                todayBackgroundColor= {colours.main_coco}
                selectedDayTextColor={colours.darkest_coco}
                textStyle={{ color: colours.darkest_coco, fontFamily: 'Sora', fontSize :17}}

                monthTitleStyle={{ color: colours.darkest_coco, fontWeight: 'bold', fontSize: 18 }}
                yearTitleStyle={{ color: colours.darkest_coco }}
                previousComponent ={<Ionicons name = 'chevron-back' size = {20} color= {colours.darkest_coco}/>}
                nextComponent = {<Ionicons name = 'chevron-forward' size = {20} color= {colours.darkest_coco}/>}
                customDatesStyles = {markedDates}
                width={360}
            />
        </View>

        {/* Upcoming Section */}
        <Text style = {style.subHeader}>Upcoming</Text>

        <FlatList
            data= {selectedTasks}
            keyExtractor={(item) => item.orderID}
            renderItem={renderUpcomingTask}
        />
        </View>
    </ImageBackground>
    );
    }
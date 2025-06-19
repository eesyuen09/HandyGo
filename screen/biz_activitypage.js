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
                orderId: data.orderID,
                type : data.type,
                time : data.availability,
            
            });
        });     
        setSelectedTasks(tasksList);
        

        const marked = [];
        tasksList.forEach(task => {
            task.time.forEach(slot => {
                const [dateOnly] = slot.split(" ");
                marked.push({
                    date: dateOnly,
                    style:{
                        backgroundColor: colours.purple,
                        borderRadius: 20,
                    },
                    textStyle: {
                        color: colours.purple,
                    },
                });
            });
        });
        console.log('marked',marked);
        setMarkedDates(marked);
      
        };
        fetchSelectedTasks();
    },[]);
    

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
                textStyle={{ color: colours.darkest_coco }}

                monthTitleStyle={{ color: colours.darkest_coco, fontWeight: 'bold', fontSize: 18 }}
                yearTitleStyle={{ color: colours.darkest_coco }}
                previousComponent ={<Ionicons name = 'chevron-back' size = {20} color= {colours.darkest_coco}/>}
                nextComponent = {<Ionicons name = 'chevron-forward' size = {20} color= {colours.darkest_coco}/>}
                customDatesStyles = {markedDates}
                width={350}
            />
        </View>

        {/* Upcoming Section */}
        <Text style = {style.subHeader}>Upcoming</Text>

        {/* <FlatList
            data={upcomingTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => navigation.navigate('Business Order Summary', { taskId: item.id })}
                className="bg-[#f4f0ec] flex-row items-center justify-between px-4 py-3 rounded-2xl mb-3"
            >
                <View className="flex-row items-center">
                <View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: item.color,
                    marginRight: 10,
                }} />
                <View>
                    <Text className="text-base font-semibold text-[#5e3c2c]">{item.title}</Text>
                    <Text className="text-sm text-[#5e3c2c]">{item.date}</Text>
                </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#5e3c2c" />
            </TouchableOpacity>
            )}
        /> */}
        </View>
    </ImageBackground>
    );
    }
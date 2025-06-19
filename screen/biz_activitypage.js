import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList,ImageBackground } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Ionicons } from '@expo/vector-icons';
import {colours,style} from '../components/style_bizactivitypage';
import BgImage from '../assets/images/biz_activitypageBG.png';

const {
  darkest_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black
} = colours;

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const upcomingTasks = [
    { id: '1', title: 'Cleaning', date: 'July 1, 2025', color: '#fcd6c5' },
    { id: '2', title: 'Home Organising', date: 'July 26, 2025', color: '#d1a03f' },
  ];

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
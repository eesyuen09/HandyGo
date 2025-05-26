import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ImageBackground
  } from 'react-native';

import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import bg from '../assets/bg_UrgentTask.png';
import { style, colours} from '../components/style_bizUrgentTask'
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';


  export default function UrgentTask(){
    const navigation = useNavigation();
    const [fontsLoaded] = useFonts({
        'Sora': require('../assets/fonts/Sora-VariableFont_wght.ttf'),
        'Inter': require('../assets/fonts/Inter-regular.ttf'),
    
      });
    
    if (!fontsLoaded) return null;

    const showTask = ({item}) =>(
        <View style = {style.card}>
            <View style = {style.taskIconWrap}>
                <MaterialCommunityIcons 
                name={item.icon} 
                size={30} 
                color={colours.main_coco}/>
            </View>

            <View style = {style.taskInfo}>
                <Text style = {style.cardTitle}>{item.category}</Text>
                <View style = {style.taskDetails}>
                    <Ionicons 
                    name = 'time-outline' 
                    size = {16}
                    color = {colours.darkest_coco}/>
                    <Text style = {style.taskDetailsText}>{item.time}</Text>
                </View>

                <View style ={style.taskDetails}>
                    <Ionicons
                    name = 'location-outline'
                    size ={16}
                    color ={colours.darkest_coco}
                    />
                    <Text style = {style.taskDetailsText}>{item.location}</Text>
                </View>

                <View style ={style.taskDetails}>
                    <Feather
                    name = 'dollar-sign'
                    size ={16}
                    color ={colours.darkest_coco}
                    />
                    <Text style = {style.taskDetailsText}>{item.price}</Text>
                </View>
            </View>
            <TouchableOpacity>
                <Text style = {style.viewText}>View</Text>
            </TouchableOpacity>
            </View>
    );


    //example structure of order summary
    const dummytasks = [
        {
          id: '1',
          category: 'Cleaning',
          time: '19 May 2025 | 5.00pm',
          location: 'Penang GeorgeTown',
          price: '$35.99',
          icon: 'broom',
        },
        {
          id: '2',
          category: 'Home Organising',
          time: '19 May 2025 | 5.00pm',
          location: 'Penang GeorgeTown',
          price: '$35.99',
          icon: 'tshirt-crew',
        },
      ];
    return(
      <ImageBackground source={bg} style={style.background}>
        <View style = {style.container}>

        <View style = {style.header}>
            <Ionicons name ='arrow-back' size = {24} color = {colours.darkest_coco}/>
            <Text style = {style.headerTitle}>Urgent Task</Text>

        </View>

        <View style={style.searchContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name = "search" size ={20} color = {colours.darkest_coco} />
            </TouchableOpacity>
            <TextInput
                placeholder = "Searching for any services?"
                placeholderTextColor={colours.darkest_coco}
                style = {style.searchInput}
            />
            <Feather name = 'filter' size ={20} color ={colours.darkest_coco} />

        </View>

        {/* to be amend!!!!!!!!*/}
        <FlatList
        data={dummytasks}
        renderItem={showTask}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

        <View style={style.paginationContainer}>
        <TouchableOpacity>
          <Ionicons name="play-back-outline" size={24} color={colours.darkest_coco} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-forward-outline" size={24} color={colours.darkest_coco} />
        </TouchableOpacity>
      </View>



    </View>



    </ImageBackground>

  

);
}
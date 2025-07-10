import React, {useState} from 'react';
import {
    View, 
    Text, 
    StyleSheet,
    ScrollView, 
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import { Feather, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import IncomeChart from '../components/IncomeChart';
import EarningCard from '../components/EarningCard';
import PieChart from '../components/IncomePieChart';
import {colours} from '../components/IncomeChart';
import { style } from '../components/style_bizfinance';
import { useNavigation , useFocusEffect} from "@react-navigation/native";
import { useFonts } from 'expo-font';



export default function FinanceScreen(){
      const [fontsLoaded] = useFonts({
        Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
        Inter: require("../assets/fonts/Inter-regular.ttf"),
      });
    
      if (!fontsLoaded) return null;
    const { width } = Dimensions.get('window');
    const navigation = useNavigation();
    //only support week and month
    const [tab, setTab] = useState('Month');

    //dummy data for now
    const topEarnings = [
        { id: '1', title: 'Cleaning', icon: <FontAwesome5 name="broom" size={20} />, date: 'Jan 12, 2025', amount: 150 },
        { id: '2', title: 'Home Organising', icon: <MaterialIcons name="home-repair-service" size={20} />, date: 'Yesterday', amount: 85 },
        { id: '3', title: 'Youtube', icon: <Ionicons name="logo-youtube" size={20} />, date: 'Jan 16, 2025', amount: 50 },

    ];

    return (
        <View style={style.container}>
            {/* header */}
            <View style={style.headerContainer}>
                <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={style.backButton}
                >
                <Ionicons name="chevron-back" size={24} color={colours.black} />
                </TouchableOpacity>
    
                <Text style={style.headerTitle}>Statistics</Text>
                <View style={style.backButton} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

            {/* Total Income */}
            <Text style ={style.totalIncomeLabel}>Total Income</Text>
            {/* dummy data */}
            <Text style = {style.totalIncome}>$600.00</Text>

            {/* Tab Switcher */}
            <View style={style.tabContainer}>
                {['Week', 'Month'].map((label) => (
                <TouchableOpacity key={label} onPress={() => setTab(label)}>
                    <Text style={[style.tab, tab === label && style.tabActive]}>{label}</Text>
                </TouchableOpacity>
                ))}
            
            </View>

            {/* Chart */}
            <IncomeChart selectedTab={tab} />

            <View style = {style.line}/>

            {/* PieChart */}
            <Text style = {style.subtitle}>Earning Distribution by Service Type</Text>
            <PieChart/>
        


            <View style = {style.line}/>

            {/* Top Earning */}
            <View style={style.earningHeader}>
                <Text style={style.subtitle}>Top Earning</Text>
                {/* <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity> */}
            </View>

            {topEarnings.map((item) => (
                <EarningCard key={item.id} {...item} />
                ))}
            </ScrollView>
        </View>
    )

}
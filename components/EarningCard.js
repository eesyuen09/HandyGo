import iconSet from '@expo/vector-icons/build/Fontisto';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export const colours = {
  darkest_coco: "#704F38",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "#E3E3E3",
  white: "#FFFFFF",
  yellow_brown: "#DDA853",
  black: "#000000",
};

const { darkest_coco, main_coco, beige, grey, white, yellow_brown, black } =
  colours;

const style = StyleSheet.create({
    card: {
        backgroundColor: beige,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        alignItems: 'center', //vertically center everything
    },

    iconTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        color: main_coco,
    },
    title:{
        fontWeight : '600',
        fontFamily: 'Sora',
        color: main_coco,
    },
    date: {
        color: main_coco,
        fontSize: 12,
        fontFamily: 'Inter',
    },
    amount:{
        fontSize: 16,
        fontWeight: 'bold',
        color: darkest_coco,
        fontFamily: 'Sora',
    },
});

export default function EarningCard({title, icon, date, amount}){
    return (
        <View style = {style.card}>
            <View style = {style.iconTitle}>
                {icon}

            <View style = {{marginLeft: 10,justifyContent: 'center'}}> 
                <Text style = {style.title}>{title}</Text>
                <Text style = {style.date}>{date}</Text>
            </View>
        </View>
        <Text style = {style.amount}> ${amount.toFixed(2)}</Text>


        </View>
    );
}
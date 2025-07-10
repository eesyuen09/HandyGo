import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

export const colours = {
  darkest_coco: "#704F38",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "#EFEFEF",
  white: "#FFFFFF",
  yellow_brown: "#DDA853",
  black: "#000000",
  purple: "#898AC4",
};

const {
  darkest_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black,
  purple,
} = colours;

export default function ReviewCard(){
    

    

}


const styles = StyleSheet.create({
    card: {
        backgroundColor: beige,
        borderRadius: 12,
        padding: 16,
        marginVertical: 12,
    },
    //header include name and ratings
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative'
    }, 
    headerSection: {
        marginLeft: 12,
        flex: 1,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    reviewText:{
        fontSize: 14,
        color: darkest_coco,
        lineHeight: 18,
        marginTop: 6,
    },
})
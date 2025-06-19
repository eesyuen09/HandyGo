import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Calendar } from 'react-native-calendars';



// import { Sora_400Regular, Sora_600SemiBold } from '@expo-google-fonts/sora';

export const colours = {
  darkest_coco: "#704F38",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "E3E3E3",
  white: '#FFFFFF',
  yellow_brown: '#DDA853',
  black: "#000000",
};

const {
  darkest_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black
} = colours;

export const style = StyleSheet.create({
    background:{
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },

    container: {
        flex: 1,
        padding: 25,
        paddingTop: Constants.statusBarHeight + 30,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: darkest_coco,
        fontFamily: 'Sora',
        textAlign: 'center',
        marginBottom: 10,
    },

    calendarContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        //Ensures that any content (like calendar elements or shadows) doesn’t spill outside the rounded corners
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 20,

    },

    subHeader: {
        fontSize: 16,
        fontWeight: '500',
        color: main_coco,
        marginBottom: 10,
    },

    card: {
        color: grey,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dot: {
        height: 10,
        width: 10,
        boederRadius: 5,
    },

    date: {
        fontSize: 14,
        color: colours.darkest_coco,
        marginTop: 4,
    },
});









    
    

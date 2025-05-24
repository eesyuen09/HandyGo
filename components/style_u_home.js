import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// Colours
export const colours = {
  darkest_coco: "#704F38",
  light_coco: "#CB9D83",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "E3E3E3",
  white: '#FFFFFF',
  yellow_brown: '#DDA853',
  black: "#000000",
};

const {
  darkest_coco,
  light_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black
} = colours;

// styles
export const styles = StyleSheet.create({
    //frame
    frame: {
        backgroundColor: white,
        flex: 1,
    },

    //container for search bar
    container: {
        backgroundColor: main_coco, 
        flexDirection:'column',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingTop: Constants.statusBarHeight + 8,
        height: Constants.statusBarHeight + 75,
        paddingHorizontal: 0,
        paddingBottom: 10,
        marginHorizontal: 0,
    },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: light_coco, 
        borderRadius: 30,
        paddingHorizontal: 26, 
        paddingVertical:8,
        marginHorizontal: 25,
        marginBottom: 8,
        height: 45,  
    },

    searchIcon: {
        width: 24,
        height: 24,
        color: white,
    },

    searchInput: {
        marginLeft: 10,
        justifyContent: 'center',
        fontFamily: 'Sora',
        color: white,
        lineHeight:25,
        alignItems: 'center',
        fontSize: 15,
        flex: 1,
    },

    section: {
        padding: 20,
    },

    sectionTitle: {
        marginLeft: 10,
        fontFamily: 'Sora',
        fontWeight: 'bold',
        fontSize: 20,
        color: darkest_coco,
        marginBottom: 15,
    },

    icon: {
        alignItems: 'center',
  
    },

    circle: {
        backgroundColor: beige,
        width: 70,
        height: 70,
        borderRadius: 38, 
        borderWidth: 1,
        borderColor: 'rgba(112, 79, 56, 0.13)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },

    iconRow: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 16,
        gap: 23,
        // marginBottom: 0,
    },


    // iconImage: {
    //     resizeMode: 'contain',
    //     alignItems: 'stretch',
    // },

    iconLabel: {
        fontFamily: 'Sora',
        fontSize: 13,
        color: darkest_coco,
        marginTop: 10,
        textAlign: 'center',
    },

    serviceBanner: {
        marginTop: 10,
        padding: 10,
        resizeMode: 'cover',
        height: 160,
        marginBottom: 10,
    },

});

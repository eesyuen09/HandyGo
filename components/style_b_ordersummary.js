import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';



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
        flex:1,
        resizeMode: 'cover',
        width : '100%',
        height:'100%',
        
    },    

    container: {
    flex: 1,
    padding: 25,
    paddingTop: Constants.statusBarHeight + 10,

    },
    headerContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',   
        backgroundColor: 'transparent',
    },

    backButton: {
        width: 22,
        height: 22,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle : {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 10,
        color: black,
        fontFamily: "Sora",

    },

    categoryContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        width: '100%',
        height: 160,
        marginVertical: 10,
    },

    image: {
        flex: 1,
        justifyContent: 'flex-end',//Push all children to the bottom of the container
     },

    overlay: {
        backgroundColor: beige,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    overlayTitle: {
        fontFamily : "Sora",
        fontWeight: 'bold',
        fontSize: 18,
        paddingLeft: 10,
        paddingBottom: 5,
    },

    overlaySubtitle:{
        fontFamily : 'Sora',
        fontSize: 12,
        paddingLeft: 10,
    },

    titleBelow: {
        fontFamily: 'Sora',
        fontSize: 18,
        color: darkest_coco,
        marginLeft: 15,
    },

    cardContainer: {
        flexDirection : 'row',
        alignItems: 'center',
        backgroundColor: white,
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 20,
        padding: 15,
        borderColor: main_coco,
        borderWidth: 1,

    },

    taskIconWrap: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,

    },

    taskIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },

    cardTitle: {
        fontWeight: 'bold',
        fontFamily: 'Sora',
        fontSize: 14,
        color: main_coco,
      },

    //for time only
    timeInfoContainer: { //group all rows of info
        marginTop: 10,
        paddingHorizontal: 15,
    },
    timeInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,

    },
    date: {
        flex: 1,
        fontFamily: "Sora",
        color: main_coco,
        fontSize: 10,
    },
    time: {
        flex: 1,
        textAlign: 'right',
        color: main_coco,
        fontSize: 10,
    },
    //for time only(above)



    taskInfo: { 
        flex: 1,
        marginLeft: 15,
        fontFamily: 'Sora',
        fontSize: 10,
        color: main_coco,
    },
    //for picture with different style

    pictureInfoRow: {
        flex: 1,
        marginTop : 10,
        justifyContent: "space-between",
        alignItems: 'center',
        marginRight: 15,
    },

    pictureIcon: {
        width: 15,
        height: 15,
        color: main_coco,
    },

    pictureText: {
        fontFamily: 'Sora',
        fontSize: 10,
        color: main_coco,
    },

    button:{
        width: 343,
        backgroundColor: main_coco,
        borderRadius: 10,
        paddingVertical: 25,
        paddingHorizontal:20,
        alignItems: 'center',
        marginVertical: 20,
        marginBottom: 40,
    },
    buttonText: {
        fontFamily: "Sora",
        fontSize: 16,
        color: white,
    },
}) 
import { StyleSheet, Dimensions} from 'react-native';
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

export const styles = StyleSheet.create({
  
    frame: {
    flex: 1,
    backgroundColor: white,
    fontFamily: 'Sora',
    },

    bannerContainer: {
      // paddingTop: Constants.statusBarHeight + 8,
      position: 'relative',
      overflow: 'hidden',
      // marginVertical: 16,
    },

    bannerImage: {
      flex: 1,
      height: 250, 
      width: '100%',
    },

    bannerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 16,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.3)'
    },

    bannerTitle: {
      left: 250,
      top: Constants.statusBarHeight - 25,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 30,
      fontFamily: 'Sora',
    },

    bannerDescription: {
      top: Constants.statusBarHeight -25,
      width: '50%',
      left: 187,
      color: 'white',
      fontSize: 13,
      marginTop: 4,

      textAlign: 'right',
      fontFamily: 'Sora',
    },

    bannerPrice: {
      color: 'white',
      fontSize: 14,
      // fontWeight: 'bold',
      marginTop: 4,
      fontFamily: 'Sora',
    },

     Price: {
      color: 'white',
      fontSize: 35,
      fontWeight: 'bold',
      left: 45,
      marginTop: 4,
      fontFamily: 'Sora',
    },

    section: {
      marginTop: 30,
      paddingHorizontal: 40,
    },

    sectionLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#704F38',
      marginBottom: 8,
      fontFamily: 'Sora',
    },

    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9F2ED',
      padding: 12,
      borderRadius: 10,
      marginBottom: 8,
      marginTop: 5,
    },

    inputText: {
      marginLeft: 10,
      color: '#704F38',
      fontFamily: 'Sora',
      fontSize: 14,
    },

    preferenceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
    },

    preferenceButton: {
      paddingHorizontal: '50',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      backgroundColor: '#F9F2ED',
    },

    preferenceText: {
      marginLeft: 5,
      color: darkest_coco,
    },

    textArea: {
      height: 80,
      borderRadius: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 10,
      textAlignVertical: 'top',
      color: darkest_coco,
    },

    bookNowButton: {
      marginHorizontal: 40,
      marginVertical: 20,
      backgroundColor: '#A76545',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },

    bookNowText: {
      paddingHorizontal: 40,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },

    
  });

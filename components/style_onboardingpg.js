import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';








// Colours
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

// Global Styles
export const globalStyles = StyleSheet.create({

  background:{
    flex:1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    padding: 25,
    paddingTop: Constants.statusBarHeight + 30,
    backgroundColor: beige,
  },

  inner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: 48,
    color: white,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Sora',
  },

  subtitle: {
    fontSize: 20,
    color: white,
    marginBottom: 73,
    fontFamily: 'Sora',
  },



  button: {
    width: 200,
    backgroundColor: beige,
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal:20,
    alignItems: 'center',
    marginVertical: 5,
    marginBottom: 30,
  },

  buttonText: {
    color: black,
    fontSize: 18,
    fontFamily: 'Inter',
  },

  
});

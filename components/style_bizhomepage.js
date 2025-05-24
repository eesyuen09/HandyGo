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

export const style = StyleSheet.create({
  background:{
    flex:1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    color: white,
    fontFamily: 'Sora',
    fontWeight: 400,
    marginBottom: 10,
    textAlign: 'center',
  },



  Button: {
    backgroundColor: colours.main_coco,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,

  },
  ButtonText: {
    color: colours.white,
    fontSize: 30,
    fontFamily: 'Sora',
    fontWeight: '600',
  
  },

  
});

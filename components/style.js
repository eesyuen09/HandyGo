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

  // title: {
  //   fontSize: 18,
  //   color: colours.black,
  //   fontFamily: 'Sora',
  //   fontWeight: 400,
  //   marginBottom: 10,
  //   textAlign: 'center',
  // },

  // logo: {
  //   width: 81.38,
  //   height: 75,
  //   marginBottom: 10,
  //   alignItems: 'center',
  // },
//group:label,text input
  inputGroup: {
    width: '100%',
    marginBottom: 20,

  },
  inputLabel: {
    color: colours.black,
    fontSize: 13,
    fontFamily: 'Inter',
    marginBottom: 5,
    textAlign: 'left',
  },

  Button: {
    backgroundColor: colours.main_coco,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,

  },
  ButtonText: {
    color: colours.white,
    fontSize: 16,
    fontFamily: 'Sora',
    fontWeight: '600',
  
  },

  
});

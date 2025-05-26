import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';

// Colours
export const colours = {
  darkest_coco: '#704F38',
  main_coco: '#A76545',
  beige: '#F9F2ED',
  grey: '#E3E3E3',
  white: '#FFFFFF',
  yellow_brown: '#DDA853',
  black: '#000000',
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

const { height, width } = Dimensions.get('window');

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
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight + 20,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 24,
    color: main_coco,
    fontFamily: 'Sora',
    fontWeight: '400',
    marginTop: 10,
    textAlign: 'center',
  },

  button: {
    width: 250,
    backgroundColor: main_coco,
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal:20,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 40,
  },

  buttonText: {
    color: white,
    fontSize: 25,
    fontFamily: 'Inter',
  },
});
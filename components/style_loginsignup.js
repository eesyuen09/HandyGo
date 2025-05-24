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
    fontSize: 30,
    color: darkest_coco,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Sora',
  },

  subtitle: {
    fontSize: 18,
    color: darkest_coco,
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Sora',
  },

  logo: {
    width: 250,
    height: 200,
    marginBottom: 10,
    alignItems: 'center',
  },

  button: {
    width: 200,
    backgroundColor: darkest_coco,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 5,
  },

  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },

  line: {
    height: 1,
    width: '80%',
    backgroundColor: darkest_coco,
    marginVertical: 10,
  },

  extraView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  extraText: {
    color: darkest_coco,
    fontSize: 15,
    marginRight: 5,
    fontFamily: 'Inter',
  },

  linkText: {
    color: darkest_coco,
    textDecorationLine: 'underline',
    fontSize: 15,
    fontFamily: 'Inter',
  },

  inputWrapper: {
    width: '90%',
    marginBottom: 25,
    
  },
  
  inputLabel: {
    color: darkest_coco,
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'left',
    borderRadius:20,
  },
  
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkest_coco,
    borderRadius: 30,
    height: 60,
    paddingHorizontal: 15,
  },
  
  inputIcon: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colours.white,
    marginLeft: 10,
    fontFamily: 'Inter',
  },

  // Google Sign In Button Content
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  welcomeContainer:{
    padding: 25,
    paddingTop: 10,
    justifyContent:'center',
  },
  roleButton: {
    backgroundColor: darkest_coco,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 10,
  },
  roleButtonSelected:{
    backgroundColor: darkest_coco,
    justifyContent:10,

  }

});

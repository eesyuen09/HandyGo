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
    color: primary_darkestblue,
    marginBottom: 20,
    fontWeight: 'bold',
  },

  logo: {
    width: 250,
    height: 200,
    marginBottom: 10,
    alignItems: 'center',
  },

  button: {
    width: 200,
    backgroundColor: tertiary_coco,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 5,
  },

  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  line: {
    height: 1,
    width: '80%',
    backgroundColor: primary_darkestblue,
    marginVertical: 10,
  },

  extraView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  extraText: {
    color: secondary_darkblue,
    fontSize: 15,
    marginRight: 5,
  },

  linkText: {
    color: secondary_darkblue,
    textDecorationLine: 'underline',
    fontSize: 15,
  },

  inputWrapper: {
    width: '90%',
    marginBottom: 25,
  },
  
  inputLabel: {
    color: colours.secondary_darkblue,
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'left',
  },
  
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.secondary_darkblue,
    borderRadius: 20,
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
    backgroundColor: tertiary_coco,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 10,
  },
  roleButtonSelected:{
    backgroundColor: primary_darkestblue,
    justifyContent:10,

  }

});

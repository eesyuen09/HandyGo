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

  title: {
    fontSize: 18,
    color: colours.black,
    fontFamily: 'Sora',
    fontWeight: 400,
    marginBottom: 10,
    textAlign: 'center',
  },

  // subtitle: {
  //   fontSize: 18,
  //   color: primary_darkestblue,
  //   marginBottom: 20,
  //   fontWeight: 'bold',
  // },

  logo: {
    width: 81.38,
    height: 75,
    marginBottom: 10,
    alignItems: 'center',
  },
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
  //text input for single line
  textInput: {
    width : '100%',
    borderWidth: 1,
    borderColor: colours.darkest_coco,
    backgroundColor: colours.beige,
    borderRadius: 20,
    paddingHorizontal:15,
    paddingVertical:12,
    fontSize: 13,
    color: colours.black,
    // marginLeft: 10,
  },
  //text area for multiline
  textArea: {
    width : '100%',
    borderWidth: 1,
    borderColor: colours.border_brown,
    backgroundColor: colours.beige,
    borderRadius: 20,

    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: colours.black,
    fontFamily: 'Inter',
    textAlignVertical: 'top',
    height: 100,
  },

  dropdown:{
    width : '100%',
    borderWidth:1,
    borderColor: colours.darkest_coco,
    backgroundColor: beige,
    borderRadius:20,
    padding:12,
    fontSize:14,
    fontFamily: 'Inter', 
  },

  add_delete_c:{
  
    backgroundColor: colours.main_coco,
    borderRadius: 20,
    paddingVertical: 10, // Adds space inside (top and bottom)
    paddingHorizontal: 15, // Adds space inside (left and right)
    alignItems: 'center', // Centers the child *horizontally*
    justifyContent: 'center', // Centers the child *vertically*
    marginBottom: 5,
  },
  add_delete_t:{
    color: colours.white,
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 10,
    

  },

  saveButton: {
    backgroundColor: colours.main_coco,
    borderRadius: 20,
    paddingVertical: 15, // Adds space inside (top and bottom)
    paddingHorizontal: 40, // Adds space inside (left and right)
    alignItems: 'center', // Centers the child *horizontally*
    justifyContent: 'center', // Centers the child *vertically*
    marginTop: 20,

  },
  saveButtonText: {
    color: colours.white,
    fontSize: 16,
    fontFamily: 'Sora',
    fontWeight: '600',
  },
});

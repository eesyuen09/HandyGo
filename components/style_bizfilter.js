import { StyleSheet } from "react-native";
import Constants from "expo-constants";

export const colours = {
  darkest_coco: "#704F38",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "#EFEFEF",
  white: "#FFFFFF",
  yellow_brown: "#DDA853",
  black: "#000000",
  purple: "#898AC4",
};

const {
  darkest_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black,
  purple,
} = colours;

export const style = StyleSheet.create({
    container: {
    flex: 1,
    padding: 25,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: beige,
  },

  inner: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  headerContainer: {
  height: 60,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", // Distribute space evenly
  backgroundColor: "transparent",
  marginBottom: 10,
  width: "100%", // Ensure full width
},

headerTitle: {
  fontSize: 22,
  fontWeight: "600",
  color: black,
  fontFamily: "Sora",
  textAlign: "center",
  position: "absolute", // Absolute positioning
  left: 0,
  right: 0, // Stretch to full width
  zIndex: -1, // Place behind buttons
},

backButton: {
  width: 40, // Fixed width for balance
  height: 40,
  justifyContent: "center",
  alignItems: "center",
},
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: main_coco,
    borderRadius: 8,
    backgroundColor: beige,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: main_coco, 
    fontFamily: 'Sora', 
  },
    button: {
    width: 250,
    alignSelf: 'center',
    backgroundColor: main_coco,
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 40,
  },

  buttonText: {
    color: white,
    fontSize: 16,
    fontFamily: "Sora",
  },

 sectionTitle: {
    alignSelf: "flex-start",        // never center—stick to the left edge
    fontSize: 16,                   // a bit smaller than header
    fontWeight: "600",              // semibold
    color: colours.darkest_coco,    // your main brown
    marginTop: 20,                  // space above
    marginBottom: 8,      
    fontFamily: "Sora",          // space below
  },

  })
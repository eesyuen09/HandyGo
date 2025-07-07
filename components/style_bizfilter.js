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
    paddingTop: Constants.statusBarHeight + 30,
    backgroundColor: beige,
  },

  inner: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

    header: {
    position: "relative",
    height: 60,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },

    headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: darkest_coco,
    fontFamily: "Sora",
    // justifyContent: 'center',
    // textAlign: 'center',
  },
  backButton: {
    width: 30, // same size as the icon
    alignItems: "center",
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -12 }],
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
    backgroundColor: main_coco,
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 40,
  },

  buttonText: {
    color: white,
    fontSize: 25,
    fontFamily: "Inter",
  },
  buttonSelected:{
    width: 250,
    backgroundColor: yellow_brown,
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 40,
  },

  })
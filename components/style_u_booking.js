import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { services_categories } from "../constants/category_constant";

// Colours
export const colours = {
  darkest_coco: "#704F38",
  light_coco: "#CB9D83",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "#E3E3E3",
  white: "#FFFFFF",
  yellow_brown: "#DDA853",
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
  black,
} = colours;

export const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: white,
    fontFamily: "Sora",
  },

  bannerContainer: {
    // paddingTop: Constants.statusBarHeight + 8,
    position: "relative",
    overflow: "hidden",
    // marginVertical: 16,
  },

  bannerImage: {
    flex: 1,
    height: 250,
    width: "100%",
  },

  bannerOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "column",
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // padding: 16,
    // justifyContent: "flex-end",
    // backgroundColor: "rgba(0,0,0,0.3)",
  },

  bannerTitle: {
    fontFamily: "Sora",
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 7,
    alignSelf: "flex-end",
    // paddingRight: 15,
    // top: Constants.statusBarHeight - 75,
    // color: "white",
    // fontWeight: "bold",
    // fontSize: 30,
    // fontFamily: "Sora",
  },

  bannerDescription: {
    // top: Constants.statusBarHeight - 73,
    width: "70%",
    alignSelf: "flex-end",
    bottom: 10,
    // paddingRight: 15,
    color: "white",
    fontSize: 14,
    // marginbottom: 30,
    textAlign: "right",
    fontFamily: "Sora",
  },

  bannerPrice: {
    color: "white",
    fontSize: 14,
    // top: Constants.statusBarHeight - 65,
    left: 15,
    // fontWeight: 'bold',
    marginTop: 4,
    fontFamily: "Sora",
  },

  Price: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    // top: Constants.statusBarHeight - 60,
    left: 60,
    marginTop: 4,
    fontFamily: "Sora",
  },

  section: {
    marginTop: 30,
    paddingHorizontal: 30,
  },

  sectionLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#704F38",
    marginBottom: 8,
    fontFamily: "Sora",
    marginLeft: 10,
  },

  inputRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: colours.white,
    borderColor: colours._coco,
    borderWidth: 0.5,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    marginTop: 5,
  },

  input: {
    marginLeft: 10,
    color: "#704F38",
    fontFamily: "Sora",
    fontSize: 14,
  },

  availabilityInput: {
    borderColor: colours.darkest_coco,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: "100%",
    alignSelf: "center",
    color: "black",
    fontFamily: "Sora",
    fontSize: 15,
  },

  availabilityInputRow: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colours.white,
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },

  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 5,
  },

  smallButtonText: {
    fontSize: 15,
    color: "#007AFF",
    paddingHorizontal: 45,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    color: "#704F38",
    fontFamily: "Sora",
    fontSize: 18,
    paddingHorizontal: 10,
  },

  pickerContainer: {
    backgroundColor: "white",
    // borderRadius: 8,
    height: 40,
    width: "100%",
    borderColor: colours.darkest_coco,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,

    zIndex: 10000,
  },

  picker: {
    height: 50,
    width: "100%",
    zIndex: 900,
    flex: 1,
    marginLeft: 10,
    backgroundColor: colours.white,
    borderColor: colours.darkest_coco,
    fontFamily: "Sora",
    fontSize: 14,
  },

  dropdownContainer: {
    borderWidth: 1,
    width: "100%",
    borderColor: colours.darkest_coco,
    backgroundColor: colours.white,
    borderRadius: 10,
    fontFamily: "Sora",
    fontSize: 14,
    color: colours.darkest_coco,
    zIndex: 100,
  },

  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  preferenceButton: {
    paddingHorizontal: "10",
    marginLeft: 10,
    bottom: 5,
    paddingBottom: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    borderRadius: 10,
    backgroundColor: "white",
  },

  preferenceText: {
    marginLeft: 5,
    color: darkest_coco,
  },

  textArea: {
    height: 120,
    borderRadius: 10,
    width: "95%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
    color: darkest_coco,
  },

  bookNowButton: {
    marginHorizontal: 40,
    marginVertical: 20,
    backgroundColor: "#A76545",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  bookNowText: {
    paddingHorizontal: 40,
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Sora",
    marginLeft: 20,
  },
});

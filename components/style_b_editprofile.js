import { StyleSheet } from "react-native";
import Constants from "expo-constants";

export const colours = {
  darkest_coco: "#704F38",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "#E3E3E3",
  white: "#FFFFFF",
  yellow_brown: "#DDA853",
  black: "#000000",
};

const { darkest_coco, main_coco, beige, grey, white, yellow_brown, black } =
  colours;

export const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: Constants.statusBarHeight + 30,
    backgroundColor: beige,
  },

  inner: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 18,
    color: black,
    fontFamily: "Sora",
    fontWeight: "400",
    marginBottom: 10,
    textAlign: "center",
  },

  avatarHeader: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "transparent",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    backgroundColor: white,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: darkest_coco,
    borderWidth: 2,
  },

  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: main_coco,
    borderRadius: 12,
    padding: 4,
  },

  inputGroup: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },

  inputLabel: {
    color: black,
    fontSize: 13,
    fontFamily: "Inter",
    marginBottom: 5,
    textAlign: "left",
    alignSelf: "flex-start", // makes sure label aligns left inside inputGroup
    paddingLeft: 20,
  },

  inputWrapper: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: darkest_coco,
    backgroundColor: white,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
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

  textInput: {
    flex: 1,
    fontSize: 14,
    color: black,
    fontFamily: "Sora",
    paddingVertical: 12,
    backgroundColor: "transparent",
    borderWidth: 0,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  icon: {
    marginLeft: 10,
  },

  button: {
    backgroundColor: main_coco,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 24,
  },

  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Sora",
  },
});

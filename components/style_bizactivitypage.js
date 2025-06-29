import { StyleSheet } from "react-native";
import Constants from "expo-constants";
// import { Calendar } from 'react-native-calendars';

// import { Sora_400Regular, Sora_600SemiBold } from '@expo-google-fonts/sora';

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
  background: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    padding: 25,
    paddingTop: Constants.statusBarHeight + 10,
  },
  headerContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginBottom: 10,
  },

  backButton: {
    width: 22,
    height: 22,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
    color: black,
    fontFamily: "Sora",
  },

  calendarContainer: {
    borderRadius: 19,
    overflow: "hidden",
    //Ensures that any content (like calendar elements or shadows) doesn’t spill outside the rounded corners
    shadowColor: "#000",
    padding: 16,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
    backgroundColor: colours.beige,
  },

  subHeader: {
    fontSize: 20,

    fontWeight: "500",
    color: colours.main_coco,
    marginBottom: 10,
  },

  card: {
    backgroundColor: grey,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    color: colours.darkest_coco,
    fontFamily: "Sora",
    fontSize: 16,
    fontWeight: "600",
  },

  date: {
    fontSize: 14,
    color: colours.darkest_coco,
    marginTop: 4,
  },
});

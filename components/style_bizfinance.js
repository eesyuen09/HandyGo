
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
    backgroundColor: '#fff', 
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
  totalIncomeLabel: {
    fontSize: 14, 
    fontFamily: 'Sora',
    color: darkest_coco, 
    marginTop: 20,
  },
  totalIncome: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: darkest_coco,
  },
  tabContainer: {
    flexDirection: 'row', 
    gap: 16, 
    marginVertical: 16,
  },
  tab: {
    fontSize: 16, 
    color: darkest_coco, 
    paddingHorizontal: 8, 
    paddingVertical: 4,
  },
  tabActive: {
    color: main_coco, 
    borderBottomWidth: 2, 
    borderBottomColor: main_coco,
  },
  earningHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 30,
  },
  subtitle: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: darkest_coco,
    fontFamily: 'Sora'
  },
    line: {
    height: 1,
    width: "100%",
    backgroundColor: darkest_coco,
    marginVertical: 10,
  },
  aiText:{
    fontSize: 14,
    color: darkest_coco,
    lineHeight: 18,
    marginTop: 6,
    fontFamily: 'Sora',
    textAlign: 'justify'

  }
//   seeAll: {
//     color: colours.primary,
//   },
});
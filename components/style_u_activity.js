import { StyleSheet } from "react-native";
import Constants from "expo-constants";

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

export const style = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: colours.white,
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: "Sora",
    padding: 16,
    fontWeight: "bold",
    color: colours.main_coco,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: colours.light_coco,
    textDecorationLine: "underline",
    fontFamily: "Sora",
  },
  emptyText: {
    fontSize: 16,
    color: colours.grey,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  card: {
    backgroundColor: colours.white,
    paddingLeft: 16,
    marginBottom: 25,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  taskMeta: {
    flexDirection: "column",
    alignItems: "flex-end",
    // gap: 15,
  },
  taskDetails: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  taskDetailsText: {
    marginLeft: 6,
    fontSize: 13,
    textAlign: "left",
    fontFamily: "Sora",
    color: colours.light_coco,
  },
  taskIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colours.main_coco,
    justifyContent: "center",
    alignItems: "center",
  },
  viewText: {
    fontSize: 14,
    color: colours.main_coco,
    fontFamily: "Sora",
    textDecorationLine: "underline",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 10,
  },
  backButton: {
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colours.darkest_coco,
  },
  taskIconWrap: {
    position: "relative",
    // top: 16,
    // right: 16,
  },
  taskInfo: {
    position: "relative",
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colours.darkest_coco,
    fontFamily: "Sora",
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colours.darkest_coco,
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
    // alignSelf: "flex-end",
  },
  statusBadge: {
    borderRadius: 12,
    // paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    minWidth: 80,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
  },

  statusScheduled: {
    backgroundColor: "#B5EAC2",
  },
  statusPending: {
    backgroundColor: "#F8E4A1",
  },
  statusFailed: {
    backgroundColor: "#F9C2C2",
  },
  statusCompleted: {
    backgroundColor: "#D1D1F7",
  },
  statusCancelled: {
    backgroundColor: "#E2E2E2",
  },

  textScheduled: {
    color: "#399E50",
  },
  textPending: {
    color: "#8A6C13",
  },
  textFailed: {
    color: "#EB3021",
  },
  textCompleted: {
    color: "#312E81",
  },
  textCancelled: {
    color: "#4B5563",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 12,
    paddingLeft: 20,
  },
  actionText: {
    fontSize: 12,
    // fontWeight: "bold",
    color: colours.black,
    textDecorationLine: "underline",
    justifyContent: "flex-end",
    alignSelf: "center",
    paddingVertical: 8,
  },
});

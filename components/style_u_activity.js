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

export const styles = StyleSheet.create({
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
    fontSize: 20,
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
    padding: 16,
    marginBottom: 16,
  },
  taskIconWrap: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  taskInfo: {
    paddingRight: 40,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colours.darkest_coco,
    marginBottom: 8,
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  taskDetailsText: {
    marginLeft: 6,
    fontSize: 14,
    color: colours.light_coco,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
  },

  statusScheduled: {
    backgroundColor: "#34A853",
  },
  statusFailed: {
    backgroundColor: "#EB4335",
  },
  statusCompleted: {
    backgroundColor: "#D1D1F7",
  },
  statusPending: {
    backgroundColor: "#E6BA0A",
  },

  textScheduled: {
    color: "#399E50",
  },
  textFailed: {
    color: "#EB3021",
  },
  textCompleted: {
    color: "#312E81",
  },
  textPending: {
    color: "#8A6C13",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colours.main_coco,
    textDecorationLine: "underline",
  },
});

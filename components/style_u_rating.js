import { StyleSheet, Dimensions, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9F2ED",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#704F38",
    textAlign: "center",
    marginVertical: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  star: {
    marginHorizontal: 6,
  },
  reviewBox: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginTop: 16,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#704F38",
    marginTop: 24,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

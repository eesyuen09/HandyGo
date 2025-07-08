import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { styles } from "../components/style_u_rating";

export default function UserRating() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { orderId, workerId } = route.params || {};

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      //Update booking document
      const bookingRef = doc(db, "booking", orderId);
      await updateDoc(bookingRef, {
        rating,
        review,
      });

      // Update worker’s review array and average rating
      const workerRef = doc(db, "users", workerId);
      const workerSnap = await getDoc(workerRef);
      const workerData = workerSnap.exists() ? workerSnap.data() : {};
      const prevReviews = workerData.reviews || [];
      const newReview = {
        orderId,
        rating,
        review,
        timestamp: new Date(),
      };

      const updatedTotal = (workerData.totalRating || 0) + rating;
      const updatedCount = (workerData.ratingCount || 0) + 1;
      const updatedAverage = updatedTotal / updatedCount;

      await updateDoc(workerRef, {
        reviews: arrayUnion(newReview),
        averageRating: updatedAverage,
        totalRating: updatedTotal,
        ratingCount: updatedCount,
      });

      Alert.alert("Success", "Your rating has been submitted.");
      navigation.goBack();
    } catch (err) {
      console.log(orderId, workerId);
      console.error("Failed to submit rating:", err);
      Alert.alert("Error", "Failed to submit your rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rate this order</Text>

      {/* Star Rating */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.star}
          >
            <Ionicons
              name={rating >= star ? "star" : "star-outline"}
              size={32}
              color="#FFC107"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Review Box */}
      <TextInput
        style={styles.reviewBox}
        placeholder="Leave a review..."
        value={review}
        onChangeText={setReview}
        multiline
        numberOfLines={4}
      />

      {/* Submit */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleRatingSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>
          {submitting ? "Submitting..." : "Submit Rating"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

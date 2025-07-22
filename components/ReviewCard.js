import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

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


export default function ReviewCard() {
    const [review, setReview] = useState(null);

    const getLatestReview = async (workerId) => {
        try {
            const reviewsRef = collection(db, "users", workerId, "reviews");
            const q = query(reviewsRef, orderBy("timestamp", "desc"), limit(3));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
            const latestReview = querySnapshot.docs[0].data();
            console.log("Latest review:", latestReview);
            setReview(latestReview);
            } else {
            console.log("No reviews found for this worker.");
            return null;
            }
        } catch (error) {
            console.error("Error fetching latest review:", error);
            return null;
        }
        };
  return (
    <View style={styles.card}>
      {/* Header Row: Avatar, Name, Rating */}
      <View style={styles.header}>
        <View style={styles.nameAndTitle}>
          <Text style={styles.username}>{review.userId}</Text>
          <Text style={styles.reviewTitle}>{review.title}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
      </View>

      {/* Body: Review Text */}
      <Text style={styles.reviewText}>
        {review.review}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  nameAndTitle: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: darkest_coco,
  },
  reviewTitle: {
    fontSize: 14,
    color: darkest_coco,
    marginTop: 2,
  },
  ratingContainer: {
    backgroundColor: darkest_coco,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  ratingText: {
    fontWeight: 'bold',
    color: darkest_coco,
  },
  reviewText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
});
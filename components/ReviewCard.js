import React, { useState} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
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


export default function ReviewCard({ review }) {
  //  ────── guard early ──────
  if (!review) return null;

  const date = review.timestamp?.toDate
    ? review.timestamp.toDate().toLocaleDateString()
    : new Date(review.timestamp).toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.username}>{review.type}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{review.rating}/5</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{review.review}</Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );
}

const { darkest_coco } = colours;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontWeight: '600',
    color: darkest_coco,
  },
  ratingContainer: {
    backgroundColor: darkest_coco,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reviewText: {
    marginTop: 8,
    color: '#333',
    lineHeight: 18,
  },
  dateText: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});
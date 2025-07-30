// ReviewsList.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import ReviewCard from './ReviewCard';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function ReviewsList({ workerId }) {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workerId) return;

    (async () => {
      try {
        const reviewsRef = collection(db, 'users', workerId, 'reviews');
        const q = query(reviewsRef, orderBy('timestamp', 'desc'), limit(3));
        const snap = await getDocs(q);
        setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error('Error fetching reviews:', e);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [workerId]);

  if (loading) return <ActivityIndicator style={{ margin: 20 }} />;
  if (!reviews || reviews.length === 0)
    return <Text style={{ textAlign: 'center', margin: 20 }}>No reviews yet.</Text>;

  return (
    <View>
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </View>
  );
}
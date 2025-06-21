import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { colours, styles } from "../components/style_u_home";
import { SafeAreaView } from "react-native-safe-area-context";

//extract data from firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { auth, getAuth } from "../firebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";

export default function UserActivity({ navigation }) {

    return {
        <SafeAreaView style={styles.frame}>

                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>User Activity</Text>
                    {/* Add your user activity content here */}
                </ScrollView>

        </SafeAreaView>

    }

}

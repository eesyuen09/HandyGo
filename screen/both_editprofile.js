import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { style, colours } from "../components/style_b_editprofile";
import { useFonts } from "expo-font";

export default function EditProfile({ navigation }) {
const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
    });
  const [clientForm, setClientForm] = useState(null);
  const [workerForm, setWorkerForm] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.role === "user") {
              setClientForm(data);
              setRole("client");
            } else if (data.role === "business") {
              setWorkerForm(data);
              setRole("worker");
            } else {
              console.warn("Unknown role:", data.role);
            }
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (key, value) => {
    if (role === "client") {
      setClientForm({ ...clientForm, [key]: value });
    } else {
      setWorkerForm({ ...workerForm, [key]: value });
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "users", user.uid);

    const form = role === "worker" ? workerForm : clientForm;
    try {
      await updateDoc(docRef, form);
      console.log("Saved changes:", form);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const form = role === "worker" ? workerForm : clientForm;
  if (!form) return null; // Prevent rendering before data is loaded
  return (
    <View style={style.container}>
      <ScrollView contentContainerStyle={style.inner}>
        {/* Avatar */}
        <View style={style.avatarHeader}>
          <View style={style.avatar}>
            <Ionicons name="person" size={60} color="#704F38" />
            {/* <TouchableOpacity style={style.editIcon}>
              <Ionicons name="create" size={16} color="white" />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Form Fields */}
        {(role === "worker"
          ? [
              { label: "Name", key: "fullName" },
              { label: "Email", key: "email", editable: false },
              { label: "Date of Birth", key: "dob" },
              { label: "Password", key: "password", secure: true },
              { label: "Contact", key: "contact" },
              { label: "Address", key: "address" },
              { label: "Bank Number", key: "bankNumber" },
              { label: "Service Type", key: "subcategory"},
              { label: "NRIC/ Passport", key: "nric" },
              {
                label: "Qualifications/ Experience/ Skills",
                key: "qualifications",
                multiline: true,
              },
              { label: "Introduction", key: "introduction" },
            ]
          : [
              { label: "Name", key: "fullName" },
              { label: "Email", key: "email", editable: false },
              { label: "Date of Birth", key: "dob" },
              { label: "Password", key: "password", secure: true },
            ]
        ).map((field) => (
          <View key={field.key} style={style.inputGroup}>
            <Text style = {style.inputLabel}>{field.label}</Text>
            <View style = {style.inputWrapper}>
            <TextInput
              style={[style.textInput, field.multiline && style.textArea]}
              value={form[field.key]}
              onChangeText={(val) => handleChange(field.key, val)}
              editable={field.editable !== false}
              secureTextEntry={field.secure || false}
              multiline={field.multiline || false}
              placeholder={field.label}
              placeholderTextColor="#888"
    
            />
            <Ionicons
              name="create-outline"
              size={20}
              color="#704F38"
              style={style.icon}
            />
          </View>
          </View>
        ))}

        <TouchableOpacity style={style.button} onPress={handleSave}>
          <Text style={style.buttonText}>Save Change</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

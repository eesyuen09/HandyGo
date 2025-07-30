import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { style, colours } from "../components/style_b_editprofile";
import { useFonts } from "expo-font";
import { Picker } from "@react-native-picker/picker";
import { services_categories } from "../constants/category_constant";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditProfile({ navigation }) {
  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  const [clientForm, setClientForm] = useState(null);
  const [workerForm, setWorkerForm] = useState(null);
  const [role, setRole] = useState(null);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [showPickerIndex, setShowPickerIndex] = useState(null);
  const [show, setShow] = useState(false);

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
              setCategory(data.category || []);
              setSubcategory(
                Array.isArray(data.subcategory)
                  ? data.subcategory.filter((s) => s.trim() !== "")
                  : [],
              );
            }
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

  const updateTitle = (index, newTitle) => {
    setCategory((prev) => {
      const updated = [...prev];
      if (updated.includes(newTitle) && updated[index] !== newTitle) {
        Alert.alert("Category already selected.");
        return updated;
      } else {
        updated[index] = newTitle;
        return updated;
      }
    });
  };

  const addSubtitle = (subtitle) => {
    setSubcategory((prev) => {
      if (prev.includes(subtitle)) {
        return prev.filter((item) => item !== subtitle);
      } else {
        return [...prev, subtitle];
      }
    });
  };

  const renderCategoryBlock = (cat, index) => {
    //cat is the current category name, index is the index of this category in the category array

    const selectedCategory = services_categories.find(
      (c) => c.title === category[index],
    ); // find full category obj(cat+ subcat)

    return (
      <View key={index} style={style.inputGroup}>
        <Text style={style.inputLabel}>Service Category</Text>

        <DropDownPicker
          style={style.dropdownContainer}
          open={showPickerIndex === index}
          value={category[index]}
          items={services_categories.map((catObj) => ({
            label: catObj.title,
            value: catObj.title,
          }))}
          setOpen={(open) => setShowPickerIndex(open ? index : null)}
          setValue={(callback) => {
            const selectedValue = callback(category[index]);
            updateTitle(index, selectedValue); // update category[index]
          }}
          setItems={() => {}}
          placeholder="Select category"
          zIndex={1000 - index}
          listMode="SCROLLVIEW"
        />

        {selectedCategory && (
          <>
            <Text style={{ marginTop: 10 }}>Select subcategories</Text>
            {selectedCategory.subcategories.map((subtitle) => (
              <TouchableOpacity
                key={subtitle}
                onPress={() => addSubtitle(subtitle)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 6,
                  alignSelf: "flex-start",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderRadius: 4,
                    marginRight: 10,
                    backgroundColor: subcategory.includes(subtitle)
                      ? "#9A5A3C"
                      : "transparent",
                  }}
                />
                <Text style={{ textAlign: "left" }}>{subtitle}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    );
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    const form = role === "worker" ? workerForm : clientForm;

    // Attach selected categories and subcategories
    if (role === "worker") {
      form.category = category;
      form.subcategory = subcategory;

      // validation check
      const requiredFields = [
        "contact",
        "address",
        "NRIC",
        "bankNumber",
        "fullName",
      ];
      for (let field of requiredFields) {
        if (!form[field]) {
          Alert.alert("Error", `Please fill in your ${field}`);
          return;
        }
      }
      //format check
      if (/[a-zA-Z]/.test(form.contact)) {
        Alert.alert(
          "Invalid Contact",
          "Contact number must not contain letters.",
        );
        return;
      }

      if (!/^[a-zA-Z0-9]+$/.test(form.NRIC)) {
        Alert.alert(
          "Invalid NRIC/Passport",
          "Only letters and numbers allowed.",
        );
        return;
      }

      if (/[a-zA-Z]/.test(form.bankNumber)) {
        Alert.alert(
          "Invalid Bank Number",
          "Bank number must contain digits only.",
        );
        return;
      }

      if (!category.length || !subcategory.length) {
        Alert.alert(
          "Error",
          "Please select at least one category and one subcategory.",
        );
        return;
      }
    } else {
      const requiredFields = ["dob", "fullName"];
      for (let field of requiredFields) {
        if (!form[field]) {
          Alert.alert("Error", `Please fill in your ${field}`);
          return;
        }
      }
    }

    try {
      await updateDoc(docRef, form);
      console.log("Saved changes:", form);
      Alert.alert("Successfully Save Changes");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const form = role === "worker" ? workerForm : clientForm;
  if (!form) return null;

  return (
    <View style={style.container}>
      <ScrollView contentContainerStyle={style.inner}>
        {/* Avatar */}
        <View style={style.avatarHeader}>
          <View style={style.avatar}>
            <Ionicons name="person" size={60} color="#704F38" />
          </View>
        </View>

        {/* Form Fields */}
        {(role === "worker"
          ? [
              { label: "Name", key: "fullName" },
              { label: "Email", key: "email", editable: false },
              { label: "Date of Birth", key: "dob" },
              { label: "Contact", key: "contact" },
              { label: "Address", key: "address" },
              { label: "Bank Number", key: "bankNumber" },
              { label: "NRIC/ Passport", key: "NRIC" },
              {
                label: "Introduction",
                key: "introduction",
                multiline: true,
              },
            ]
          : [
              { label: "Name", key: "fullName" },
              { label: "Email", key: "email", editable: false },
              { label: "Date of Birth", key: "dob" },
            ]
        ).map((field) => (
          <View key={field.key} style={style.inputGroup}>
            <Text style={style.inputLabel}>{field.label}</Text>
            <View style={style.inputWrapper}>
              {field.key === "dob" ? (
                <>
                  <TouchableOpacity onPress={() => setShow(true)}>
                    <TextInput
                      style={style.textInput}
                      value={
                        form.dob
                          ? new Date(form[field.key]).toISOString().slice(0, 10)
                          : ""
                      }
                      placeholder={field.label}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                  {show && (
                    <DateTimePicker
                      value={form.dob ? new Date(form.dob) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(_, selectedDate) => {
                        setShow(false);
                        if (selectedDate) {
                          handleChange("dob", selectedDate.toISOString());
                        }
                      }}
                    />
                  )}
                </>
              ) : (
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
              )}
              <Ionicons
                name="create-outline"
                size={20}
                color="#704F38"
                style={style.icon}
              />
            </View>
          </View>
        ))}

        {/* Category & Subcategory Blocks */}
        {role === "worker" &&
          category.map((cat, index) => renderCategoryBlock(cat, index))}

        {/* Add category button */}
        {role === "worker" && (
          <>
            <TouchableOpacity
              onPress={() => setCategory([...category, ""])}
              style={[style.button, { marginVertical: 10 }]}
            >
              <Text style={style.buttonText}>+ Add Category</Text>
            </TouchableOpacity>

            {category.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  const updated = [...category];
                  updated.pop(); // remove last category
                  setCategory(updated);

                  // clean up subcategories
                  setSubcategory((prev) =>
                    prev.filter((sub) =>
                      updated.some((cat) =>
                        services_categories
                          .find((c) => c.title === cat)
                          ?.subcategories.includes(sub),
                      ),
                    ),
                  );
                }}
                style={[
                  style.button,
                  { marginBottom: 20, backgroundColor: "#C94A4A" },
                ]}
              >
                <Text style={style.buttonText}>− Delete Category</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("Forgot Password")}
          style={style.button}
        >
          <Text style={style.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={style.button} onPress={handleSave}>
          <Text style={style.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

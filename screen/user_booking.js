import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colours, styles } from "../components/style_u_booking.js";
//Keyboard Avoiding Wrapper
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper.js";
import {
  FontAwesome5,
  AntDesign,
  MaterialIcons,
  Entypo,
  FontAwesome,
  Feather,
  FontAwesome6,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { services_categories } from "../constants/category_constant";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, app } from "../firebaseConfig";
import { getPriceEstimate } from "../src/api/pricing.js";
import { postcodes } from "../constants/postcodes.js";

const handleBookingSubmit = (values) => {
  console.log("Booking submitted:", values);
  Alert.alert(
    "Booking Submitted",
    "Your booking has been successfully submitted!",
  );
};

const calculateEndTime = (startTime, duration) => {
  const [hour, minute] = startTime.split(":").map(Number);
  const start = new Date();
  start.setHours(hour, minute, 0, 0);

  const end = new Date(start);
  end.setHours(end.getHours() + parseInt(duration));

  return end.toTimeString().slice(0, 5);
};

function bucketItemCount(count) {
  if (count <= 1) {
    return 1;
  }
  if (count <= 3) {
    return 2;
  } else {
    return 3;
  }
}

function bucketAreaSize(m2) {
  if (m2 <= 20) return 1;
  if (m2 <= 50) return 2;
  return 3;
}

export default function UserBooking() {
  const route = useRoute();
  const {
    serviceType,
    subcategory,
    description,
    price,
    duration,
    postcode,
    address,
    gender,
    rating,
    notes,
    questions = [],
  } = route.params || {};
  console.log("Route params:", route.params);
  const icon = services_categories.find(
    (category) => category.title === serviceType,
  )?.icon;
  const bannerImage = services_categories.find(
    (category) => category.title === serviceType,
  )?.bannerImage;
  const subcategories =
    services_categories.find((category) => category.title === serviceType)
      ?.subcategories || [];
  const dynamicInitial = {
    ...questions.reduce((acc, q) => {
      acc[q.key] = 0;
      return acc;
    }, {}),
  };
  const [openStates, setOpenStates] = useState(
    Object.keys(dynamicInitial).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {}),
  );
  const [openUrgency, setOpenUrgency] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openDuration, setOpenDuration] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const navigation = useNavigation();
  const dynamicSchema = questions.reduce((schema, q) => {
    schema[q.key] = Yup.number()
      .min(1, `${q.prompt} is required`)
      .required(`${q.prompt} is required`);
    return schema;
  }, {});
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Formik
      initialValues={{
        serviceType: serviceType,
        type: subcategory,
        urgency: false,
        isCompleted: false,
        duration: duration || null,
        availability: [{ date: "", time: "" }],
        postcode: postcode || "",
        address: address || "",
        gender: gender || "",
        rating: rating || "",
        notif: false,
        notes: notes || "",
        status: "pending",
        ...dynamicInitial,
      }}
      validationSchema={Yup.object({
        type: Yup.string().required("Type is required"),
        urgency: Yup.string().required("Urgency is required"),
        duration: Yup.number().required("duration is required"),
        availability: Yup.array().of(
          Yup.object().shape({
            date: Yup.string().required("Date is required"),
            time: Yup.string().required("Time is required"),
          }),
        ),
        state: Yup.string()
          .matches(/^[A-Za-z\s]+$/, "State can only contain letters")
          .required("State is required"),
        postcode: Yup.string()
          .matches(/^\d{5,}$/, "Postcode must be at least 5 digits")
          .test("valid-postcode", "Invalid Singapore postcode", (value) =>
            postcodes.some((p) => p.postal_code.toString() === value.trim()),
          )
          .required("Postcode is required"),
        address: Yup.string().required("Address is required"),
        ...dynamicSchema,
      })}
      onSubmit={async (values, { resetForm }) => {
        console.log("Submitting booking with values:", values);
        const {
          type,
          urgency,
          duration,
          availability,
          state,
          postcode,
          address,
          gender,
          rating,
          notif,
          notes,
          status,
          isCompleted,
        } = values;

        try {
          // create an array for scores
          const scores = [];

          // collect scores from dropdowns
          questions.forEach((q) => {
            if (
              ["severity", "access", "sizeTier", "floors", "distance"].includes(
                q.key,
              )
            ) {
              scores.push(values[q.key]);
            }
          });

          if (values.itemCount != null) {
            scores.push(bucketItemCount(values.itemCount));
          }
          if (values.areaSize != null) {
            scores.push(bucketAreaSize(values.areaSize));
          }

          const avgSeverity = scores.length
            ? scores.reduce((sum, s) => sum + s, 0) / scores.length
            : 0;

          const { date, time } = values.availability[0];

          const now = new Date();
          const [h, m] = time.split(":").map(Number);
          const target = new Date(`${date}T${time}:00`);
          let lead_time_hours = (target - now) / (1000 * 60 * 60);
          if (lead_time_hours < 0) lead_time_hours = 0;

          // Build the payload for the pricing API
          const payload = {
            service_type: values.serviceType,
            duration_hours: values.duration,
            lead_time_hours,
            postcode: values.postcode,
            severity_score: avgSeverity,
            gender_pref: values.gender != "" ? 1 : 0,
            min_rating_required: isNaN(parseFloat(values.rating))
              ? 0
              : parseFloat(values.rating),
          };

          console.log("Payload for pricing API:", payload);

          setLoading(true);

          const predicted_price = await getPriceEstimate(payload);

          console.log("Predicted price from API:", predicted_price);

          // const bookingRef = await addDoc(collection(db, "booking"), {
          //   ...values,
          //   createdAt: new Date(),
          //   userId: auth.currentUser.uid,
          //   severity: avgSeverity,
          //   price: predicted_price, //assume its a fixed price for now for worker's analysis
          // });

          setLoading(false);

          const bookingDetails = {
            ...values,
            userId: auth.currentUser.uid,
            severity: avgSeverity,
            price: predicted_price,
          };

          // await setDoc(bookingRef, { orderID: bookingRef.id }, { merge: true });
          // Alert.alert(
          //   "Success",
          //   "Your booking has been successfully submitted!"
          // );
          // console.log(bookingRef);
          // resetForm();
          // navigation.goBack();

          navigation.navigate("Order Summary", {
            tempBookingInfo: bookingDetails,
          });
        } catch (error) {
          console.error("Error processing booking:", error);
          Alert.alert("Error", "Could not process booking. Please try again.");
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View style={{ flex: 1, zIndex: 0, backgroundColor: "#F9F2ED" }}>
          {loading && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(255,255,255,0.8)",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 300 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* top banner */}
              <View style={styles.bannerContainer}>
                <Image source={bannerImage} style={styles.bannerImage} />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{serviceType}</Text>
                  <Text style={styles.bannerDescription}>{description}</Text>
                  <Text style={styles.bannerPrice}>Starting from</Text>
                  <Text style={styles.Price}> ${price}</Text>
                </View>
              </View>

              {/* Booking Information */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Booking Information</Text>

                {/* Type */}
                <View style={styles.inputRow}>
                  <View style={styles.header}>
                    {icon && icon}
                    <Text style={styles.input}>Service Type</Text>
                  </View>

                  <View style={{ zIndex: 1000, marginLeft: 10 }}>
                    <DropDownPicker
                      style={styles.dropdownContainer}
                      open={openType}
                      value={values.type}
                      items={subcategories.map((sub) => ({
                        label: sub.label,
                        value: sub.label,
                      }))}
                      setOpen={setOpenType}
                      setValue={(val) => setFieldValue("type", val())}
                      setItems={() => {}}
                      placeholder="Select Service Type"
                      containerStyle={{ zIndex: 1000 }}
                      zIndex={1000}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                </View>

                {touched.type && errors.type && (
                  <Text style={styles.error}>{errors.type}</Text>
                )}

                {/* Urgency */}
                <View style={styles.inputRow}>
                  <View style={styles.header}>
                    <MaterialIcons name="emergency" size={18} color="#704F38" />
                    <Text style={styles.input}>Urgency</Text>
                  </View>

                  <View style={{ zIndex: 750, marginLeft: 10 }}>
                    <DropDownPicker
                      style={styles.dropdownContainer}
                      open={openUrgency}
                      value={values.urgency}
                      items={[
                        {
                          label: "Yes, I want to schedule an urgent booking",
                          value: true,
                        },
                        {
                          label: "No, I want to schedule a future booking",
                          value: false,
                        },
                      ]}
                      setOpen={setOpenUrgency}
                      setValue={(val) => setFieldValue("urgency", val())}
                      setItems={() => {}}
                      placeholder="Do you need it now?"
                      containerStyle={{ zIndex: 750 }}
                      zIndex={750}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                </View>

                {touched.urgency && errors.urgency && (
                  <Text style={styles.error}>{errors.urgency}</Text>
                )}
              </View>

              {/* Severity */}
              <View style={styles.section}>
                <View style={styles.inputRow}>
                  <View style={styles.header}>
                    <FontAwesome name="tasks" size={18} color="#704F38" />
                    <Text style={styles.input}>Severity</Text>
                  </View>

                  {/* One box per question */}
                  {questions.map((q, i) => (
                    <View
                      key={q.key}
                      style={[styles.inputRow, { zIndex: 600 - i }]}
                    >
                      <Text style={styles.input}>{q.prompt}</Text>
                      {q.type === "select" ? (
                        <DropDownPicker
                          open={openStates[q.key]}
                          value={values[q.key]}
                          items={q.options.map((opt, idx) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          setOpen={(v) =>
                            setOpenStates((s) => ({ ...s, [q.key]: v }))
                          }
                          setValue={(cb) => setFieldValue(q.key, cb())}
                          containerStyle={{ zIndex: 600 - i }}
                          placeholder={`Select ${q.prompt.toLowerCase()}`}
                          listMode="SCROLLVIEW"
                        />
                      ) : (
                        <TextInput
                          value={String(values[q.key] ?? "")}
                          onChangeText={(text) => setFieldValue(q.key, text)}
                          keyboardType="numeric"
                          placeholder={q.prompt}
                          style={styles.numberInput}
                        />
                      )}
                      {touched[q.key] && errors[q.key] && (
                        <Text style={styles.error}>{errors[q.key]}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Time */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Time</Text>
                {/* Duration */}
                <View style={styles.inputRow}>
                  <View style={styles.header}>
                    <MaterialIcons name="schedule" size={18} color="#704F38" />
                    <Text style={styles.input}>Duration</Text>
                  </View>

                  <View style={{ zIndex: 800, marginLeft: 10 }}>
                    <DropDownPicker
                      style={styles.dropdownContainer}
                      open={openDuration}
                      value={values.duration}
                      items={[...Array(7)].map((_, i) => ({
                        label: `${i + 1} hour${i + 1 > 1 ? "s" : ""}`,
                        value: i + 1,
                      }))}
                      setOpen={setOpenDuration}
                      setValue={(val) => setFieldValue("duration", val())}
                      setItems={() => {}}
                      placeholder="Select Duration"
                      containerStyle={{ zIndex: 800 }}
                      zIndex={800}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                  {touched.duration && errors.duration && (
                    <Text style={styles.error}>{errors.duration}</Text>
                  )}
                </View>

                {/* Availability */}
                <View style={styles.inputRow}>
                  <View style={styles.header}>
                    <MaterialIcons
                      name="date-range"
                      size={18}
                      color="#704F38"
                    />
                    <Text style={styles.input}>
                      Availability (Sort by Priority)
                    </Text>
                  </View>

                  {/* <Text style={{alignSelf: 'center', fontSize:14}}>Select available dates</Text> */}
                  <FieldArray
                    name="availability"
                    render={({ push, remove }) => (
                      <View style={styles.centerContainer}>
                        {values.availability.map((slot, index) => (
                          <View key={index} style={styles.availabilityInputRow}>
                            {/* Date Picker */}
                            <View>
                              <TouchableOpacity
                                onPress={() =>
                                  setShowDatePicker({ index, type: "date" })
                                }
                              >
                                <Text style={styles.availabilityInput}>
                                  {slot.date ? slot.date : "Select Date"}
                                </Text>
                              </TouchableOpacity>

                              {showDatePicker &&
                                showDatePicker.index === index &&
                                showDatePicker.type === "date" && (
                                  <DateTimePicker
                                    style={{
                                      marginBottom: 10,
                                      alignSelf: "center",
                                    }}
                                    value={
                                      slot.date
                                        ? new Date(slot.date)
                                        : new Date()
                                    }
                                    mode="date"
                                    display="default"
                                    minimumDate={new Date()}
                                    onChange={(event, selectedDate) => {
                                      setShowDatePicker(null);
                                      if (event.type === "dismissed") return;
                                      // Extract local date
                                      const year = selectedDate.getFullYear();
                                      const month = String(
                                        selectedDate.getMonth() + 1,
                                      ).padStart(2, "0");
                                      const day = String(
                                        selectedDate.getDate(),
                                      ).padStart(2, "0");
                                      const formatted = `${year}-${month}-${day}`;

                                      setFieldValue(
                                        `availability[${index}].date`,
                                        formatted,
                                      );
                                    }}
                                  />
                                )}
                              {touched.availability?.[index]?.date &&
                                errors.availability?.[index]?.date && (
                                  <Text style={styles.error}>
                                    {errors.availability[index].date}
                                  </Text>
                                )}
                            </View>

                            {/* Time Picker */}
                            <View>
                              <TouchableOpacity
                                onPress={() =>
                                  setShowDatePicker({ index, type: "time" })
                                }
                              >
                                <Text style={styles.availabilityInput}>
                                  {slot.time ? slot.time : "Select Time"}
                                </Text>
                              </TouchableOpacity>

                              {values.duration && slot.time && (
                                <Text style={styles.input}>
                                  Ends at:{" "}
                                  {calculateEndTime(slot.time, values.duration)}
                                </Text>
                              )}

                              {showDatePicker &&
                                showDatePicker.index === index &&
                                showDatePicker.type === "time" && (
                                  <DateTimePicker
                                    style={{ alignSelf: "center" }}
                                    value={
                                      slot.time
                                        ? new Date(
                                            `2025-05-301T${slot.time}:00`,
                                          )
                                        : new Date()
                                    }
                                    mode="time"
                                    minuteInterval={15}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                      setShowDatePicker(null);
                                      if (event.type === "dismissed") return;
                                      const selectedHours =
                                        selectedDate.getHours();
                                      const selectedMinutes =
                                        selectedDate.getMinutes();
                                      const now = new Date();

                                      const year = now.getFullYear();
                                      const month = String(
                                        now.getMonth() + 1,
                                      ).padStart(2, "0");
                                      const day = String(
                                        now.getDate(),
                                      ).padStart(2, "0");
                                      const today = `${year}-${month}-${day}`;
                                      const isToday =
                                        values.availability[index].date ===
                                        today;

                                      const isPastTime =
                                        isToday &&
                                        (selectedHours < now.getHours() ||
                                          (selectedHours === now.getHours() &&
                                            selectedMinutes <
                                              now.getMinutes()));

                                      if (isPastTime) {
                                        Alert.alert(
                                          "Invalid Time",
                                          "You cannot select a time in the past.",
                                        );
                                        return;
                                      }
                                      const formatted = selectedDate
                                        .toTimeString()
                                        .slice(0, 5);
                                      setFieldValue(
                                        `availability[${index}].time`,
                                        formatted,
                                      );
                                    }}
                                  />
                                )}
                              {touched.availability?.[index]?.time &&
                                errors.availability?.[index]?.time && (
                                  <Text style={styles.error}>
                                    {errors.availability[index].time}
                                  </Text>
                                )}
                            </View>

                            {/* Remove/Add Buttons */}
                            <View style={styles.buttonRow}>
                              <TouchableOpacity
                                onPress={() => {
                                  if (values.availability.length === 1) {
                                    Alert.alert(
                                      "Action Not Allowed",
                                      "At least one time slot must be chosen.",
                                    );
                                  } else {
                                    remove(index);
                                  }
                                }}
                              >
                                <Text style={styles.smallButtonText}>
                                  Remove
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  if (values.availability.length >= 3) {
                                    Alert.alert(
                                      "Action Not Allowed",
                                      "You can only choose up to 3 time slots.",
                                    );
                                  } else {
                                    push({ date: "", time: "" });
                                  }
                                }}
                              >
                                <Text style={styles.smallButtonText}>
                                  Add Time Slot
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  />
                </View>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Location</Text>

                {/* Postcode*/}
                <View style={styles.inputRow}>
                  <View style={styles.header}>
                    <Entypo name="map" size={18} color="#704F38" />
                    <Text style={styles.input}>Postcode</Text>
                  </View>

                  <TextInput
                    value={values.postcode}
                    onChangeText={handleChange("postcode")}
                    onBlur={handleBlur("postcode")}
                    style={{
                      fontFamily: "Sora",
                      fontSize: 14,
                      color: "#704F38",
                      padding: 10,
                      marginLeft: 10,
                    }}
                    placeholder="Enter your postcode"
                  />

                  {touched.postcode && errors.postcode && (
                    <Text style={styles.error}>{errors.postcode}</Text>
                  )}
                </View>

                {/* Address */}
                <View style={styles.inputRow}>
                  <View style={styles.header}>
                    <FontAwesome5
                      name="map-marked-alt"
                      size={18}
                      color="#704F38"
                    />
                    <Text style={styles.input}>Address</Text>
                  </View>
                  <TextInput
                    value={values.address}
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    style={{
                      fontFamily: "Sora",
                      fontSize: 14,
                      color: "#704F38",
                      padding: 10,
                      marginLeft: 10,
                    }}
                    placeholder="Enter your address"
                  />

                  {touched.address && errors.address && (
                    <Text style={styles.error}>{errors.address}</Text>
                  )}
                </View>
              </View>

              {/* Preference */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Preferences(Optional)</Text>

                {/* Gender*/}
                <View style={styles.inputRow}>
                  <View style={styles.header}>
                    <FontAwesome name="venus" size={18} color="#704F38" />
                    <Text style={styles.input}>Gender Preference</Text>
                  </View>

                  <View style={{ zIndex: 700, marginLeft: 10 }}>
                    <DropDownPicker
                      style={styles.dropdownContainer}
                      open={openGender}
                      value={values.gender}
                      items={[
                        { label: "Female", value: "female" },
                        { label: "Male", value: "male" },
                      ]}
                      setOpen={setOpenGender}
                      setValue={(val) => setFieldValue("gender", val())}
                      setItems={() => {}}
                      placeholder="No Preference"
                      containerStyle={{ zIndex: 700 }}
                      zIndex={700}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                </View>

                {touched.gender && errors.gender && (
                  <Text style={styles.error}>{errors.gender}</Text>
                )}

                {/* Ratings*/}
                <View style={styles.inputRow}>
                  <View style={styles.preferenceRow}>
                    <FontAwesome name="star" size={16} color="#704F38" />
                    <Text style={styles.input}>Ratings</Text>
                  </View>

                  <View style={{ zIndex: 600, marginLeft: 10 }}>
                    <DropDownPicker
                      style={styles.dropdownContainer}
                      open={openRating}
                      value={values.rating}
                      items={[
                        { label: "5.0+", value: "5.0" },
                        { label: "4.5+", value: "4.5" },
                        { label: "4.0+", value: "4.0" },
                        { label: "3.5+", value: "3.5" },
                        { label: "3.0+", value: "3.0" },
                        { label: "2.5+", value: "2.5" },
                      ]}
                      setOpen={setOpenRating}
                      setValue={(val) => setFieldValue("rating", val())}
                      setItems={() => {}}
                      placeholder="4.0+"
                      containerStyle={{ zIndex: 600 }}
                      zIndex={600}
                      listMode="SCROLLVIEW"
                    />
                  </View>
                </View>
                {touched.rating && errors.rating && (
                  <Text style={styles.error}>{errors.rating}</Text>
                )}

                {/* Notification*/}
                <View style={styles.inputRow}>
                  <View style={styles.preferenceRow}>
                    <AntDesign name="notification" size={16} color="#704F38" />
                    <Text style={styles.input}>Notify Me</Text>

                    <TouchableOpacity style={styles.preferenceButton}>
                      <Switch
                        value={values.notif}
                        onValueChange={(val) => setFieldValue("notif", val)}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Additional Description*/}
                <View style={styles.inputRow}>
                  <View style={styles.preferenceRow}>
                    <MaterialIcons
                      name="description"
                      size={16}
                      color="#704F38"
                    />
                    <Text style={styles.input}>Additional Description</Text>
                  </View>

                  <TextInput
                    placeholder="Additional Description"
                    multiline
                    style={styles.textArea}
                  />
                </View>
                {touched.notes && errors.notes && (
                  <Text style={styles.error}>{errors.notes}</Text>
                )}

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.bookNowButton}
                >
                  <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
}

export {
  calculateEndTime,
  bucketItemCount,
  bucketAreaSize,
  handleBookingSubmit,
};

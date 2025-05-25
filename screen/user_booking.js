import React, {useState, useRoute} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
  } from 'react-native';

import { colours, styles } from '../components/style_u_booking.js';
import BookingForm from '../components/style_u_booking.js';

//fonts
import { useFonts } from 'expo-font';

//firebase storage
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';

//category import
import { services_catogories } from '../constants/categories.js';

//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper.js';
import { FontAwesome5, AntDesign, MaterialIcons, Entypo, FontAwesome} from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function user_booking() {

    const [fontsLoaded] = useFonts({
            'Sora': require('../assets/font/Sora-VariableFont_wght.ttf'),
            'Inter': require('../assets/font/Inter-regular.ttf')
          });
          if(!fontsLoaded){
            return null;
          }
    const placeholderData = {
      bannerImage: require('../assets/images/cleaning_banner.png'), // 👈 your placeholder image
      serviceType: 'Cleaning',
      description: 'Book trusted cleaners to dust, mop, sanitize, and freshen up your home—giving you a spotless space without the hassle.',
      price: 20,
    };

    const handlePress = (label) => {
        console.log(`Pressed: ${label}`);
    };

    // const route = useRoute() ;
    // const { bannerImage, serviceType, description, price } = route.params || placeholderData;
    const { bannerImage, serviceType, description, price } = placeholderData;

    return (
      <ScrollView style={styles.container}>

        {/* <Formik
          initialValues={{
            type: '',
            urgency: '',
            duration: '',
            date: '',
            state: '',
            region: '',
            address: '',
            genderPreference: '',
            rating: '',
            notify: false,
            additionalNotes: '',
          }}

          validationSchema={Yup.object({
            type: Yup.string().required('Type is required'),
            urgency: Yup.string().required('Urgency is required'),
            date: Yup.string().required('Date is required'),
            address: Yup.string().required('Address is required'),
          })}
          
          onSubmit={(values) => {
            // Upload booking data to Firestore
            console.log('Booking Data', values);
          }}
        > */}
          


          <ScrollView style={styles.frame}>
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
              <TouchableOpacity style={styles.inputRow}>
                <MaterialIcons name="cleaning-services" size={18} color="#704F38" />
                <Text style={styles.inputText}>After-Party Cleaning</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputRow}>
                <MaterialIcons name="emergency" size={18} color="#704F38"  />
                <Text style={styles.inputText}>Do you need it right now?</Text>
              </TouchableOpacity>
            </View>

            {/* Time */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Time</Text>
              <TouchableOpacity style={styles.inputRow}>
                <MaterialIcons name="schedule" size={18} color="#704F38" />
                <Text style={styles.inputText}>Select duration</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputRow}>
                <MaterialIcons name="date-range" size={18} color="#704F38" />
                <Text style={styles.inputText}>Select available dates</Text>
              </TouchableOpacity>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Location</Text>
              <TouchableOpacity style={styles.inputRow}>
                <Entypo name="location-pin" size={18} color="#704F38" />
                <Text style={styles.inputText}>Select Your State</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputRow}>
                <Entypo name="map" size={18} color="#704F38" />
                <Text style={styles.inputText}>Select Your Region</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputRow}>
                <FontAwesome5 name="map-marked-alt" size={18} color="#704F38" />
                <Text style={styles.inputText}>Enter Your Address</Text>
              </TouchableOpacity>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Preferences (Optional)</Text>
              <TouchableOpacity style={styles.inputRow}>
                <FontAwesome name="venus" size={18} color="#704F38" />
                <Text style={styles.inputText}>Gender Preference</Text>
              </TouchableOpacity>

              <View style={styles.preferenceRow}>
                <TouchableOpacity style={styles.preferenceButton}>
                  <FontAwesome name="star" size={16} color="#704F38" />
                  <Text style={styles.preferenceText}>4.5+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.preferenceButton}>
                  <AntDesign name="notification" size={16} color="#704F38" />
                  <Text style={styles.preferenceText}>Notify Me</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Additional Description"
                multiline
                style={styles.textArea}
              />
            </View>

            <TouchableOpacity style={styles.bookNowButton}>
              <Text style={styles.bookNowText}>Book Now</Text>
            </TouchableOpacity>
          </ScrollView>
        
          {/* Add your form fields here (e.g., dropdowns, text inputs)
        </Formik> */}
      </ScrollView>
    );
  }
  
    
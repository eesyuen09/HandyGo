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
import { styles } from '../components/style_u_booking.js';
//Keyboard Avoiding Wrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper.js';
import { FontAwesome5, AntDesign, MaterialIcons, Entypo, FontAwesome, Feather, FontAwesome6 } from '@expo/vector-icons';
import BookingForm from '../components/BookingForm';

const handleBookingSubmit = (values) => {
  console.log('Booking submitted:', values);
  Alert.alert('Booking Submitted', 'Your booking has been successfully submitted!');
};

export default function user_booking() {
    // const placeholderData = {
    //   bannerImage: require('../assets/images/cleaning_banner.png'), 
    //   serviceType: 'Cleaning',
    //   description: 'Book trusted cleaners to dust, mop, sanitize, and freshen up your home—giving you a spotless space without the hassle.',
    //   price: 20,
    // };

    const route = useRoute() ;
    const { serviceType, subcategory, description, price, bannerImage, icon } = route.params || {};

    return (
      <KeyboardAvoidingWrapper>
      <ScrollView style={styles.container}>
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
              <Image source = {icon} />
              {/* <MaterialIcons name="cleaning-services" size={18} color="#704F38" /> */}
              <Text style={styles.inputText}>{subcategory}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputRow}>
              <MaterialIcons name="emergency" size={18} color="#704F38"  />
              {/* <Text style={styles.inputText}>Do you need it right now?</Text> */}
            </TouchableOpacity>
            </View>

          {/* Time */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Time</Text>
            <TouchableOpacity style={styles.inputRow}>
              <MaterialIcons name="schedule" size={18} color="#704F38" />
              {/* <Text style={styles.inputText}>Select duration</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputRow}>
              <MaterialIcons name="date-range" size={18} color="#704F38" />
              {/* <Text style={styles.inputText}>Select available dates</Text> */}
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Location</Text>
            <TouchableOpacity style={styles.inputRow}>
              <Entypo name="location-pin" size={18} color="#704F38" />
              {/* <Text style={styles.inputText}>Enter Your State</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputRow}>
              <Entypo name="map" size={18} color="#704F38" />
              {/* <Text style={styles.inputText}>Enter Your Postcode</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputRow}>
              <FontAwesome5 name="map-marked-alt" size={18} color="#704F38" />
              {/* <Text style={styles.inputText}>Enter Your Address</Text> */}
            </TouchableOpacity>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Preferences (Optional)</Text>
            <TouchableOpacity style={styles.inputRow}>
              <FontAwesome name="venus" size={18} color="#704F38" />
              {/* <Text style={styles.inputText}>Gender Preference</Text> */}
            </TouchableOpacity>
            
            <View style={styles.preferenceRow}>
              <TouchableOpacity style={styles.preferenceButton}>
                <FontAwesome name="star" size={16} color="#704F38" />
                {/* <Text style={styles.preferenceText}>4.5+</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={styles.preferenceButton}>
                <AntDesign name="notification" size={16} color="#704F38" />
                {/* <Text style={styles.preferenceText}>Notify Me</Text> */}
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Additional Description"
              multiline
              style={styles.textArea}
            />
          </View>

          {/* Booking Form */}
          <BookingForm
          initialType={serviceType}
          onSubmit={handleBookingSubmit}
      />
        </ScrollView>
      </ScrollView>
      </KeyboardAvoidingWrapper>
      
    );
  }
  
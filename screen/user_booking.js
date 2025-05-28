import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Switch,
    Button,
    KeyboardAvoidingView,
    Platform,
  } from 'react-native';
import { colours, styles } from '../components/style_u_booking.js';
//Keyboard Avoiding Wrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper.js';
import { FontAwesome5, AntDesign, MaterialIcons, Entypo, FontAwesome, Feather, FontAwesome6 } from '@expo/vector-icons';
import BookingForm from '../components/BookingForm';
import { useRoute } from '@react-navigation/native';
import {services_categories}  from '../constants/category_constant';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const handleBookingSubmit = (values) => {
  console.log('Booking submitted:', values);
  Alert.alert('Booking Submitted', 'Your booking has been successfully submitted!');
};

const calculateEndTime = (startTime, hours, minutes) => {
  const [h, m] = startTime.split(':').map(Number);   
  const start = new Date();                          
  start.setHours(h, m, 0, 0);                        

  const end = new Date(start);                       
  end.setHours(end.getHours() + parseInt(hours));
  end.setMinutes(end.getMinutes() + parseInt(minutes));

  return end.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export default function UserBooking() {
    // const placeholderData = {
    //   bannerImage: require('../assets/images/cleaning_banner.png'), 
    //   serviceType: 'Cleaning',
    //   description: 'Book trusted cleaners to dust, mop, sanitize, and freshen up your home—giving you a spotless space without the hassle.',
    //   price: 20,
    // };

    const route = useRoute() ;
    const { serviceType, subcategory, description, price} = route.params || {};

    const icon = services_categories.find(category => category.title === serviceType)?.icon || <MaterialIcons name="cleaning-services" size={18} color="#704F38" />;
    const bannerImage = services_categories.find(category => category.title === serviceType)?.bannerImage || require('../assets/images/cleaning_banner.png');
    const subcategories = services_categories.find(category => category.title === serviceType)?.subcategories || [];
    const [openUrgency, setOpenUrgency] = useState(false);
    const [openType, setOpenType, openDuration, setOpenDuration, setGender, setOpenGender, setRating, setOpenRating] = useState(false);

    return (

      <Formik
            initialValues={{
              type: subcategory,
              urgency: '',
              duration: '',
              availability: [ { date: '', time: ''}],
              state: '',
              postcode: '',
              address: '',
              gender: '',
              rating: '',
              notif: false,
              notes: '',
            }}
      
            validationSchema={Yup.object({                  
              type: Yup.string().required('Type is required'),                  
              urgency: Yup.string().required('Urgency is required'),                  
              duration: Yup.string().required('duration is required'),                                
              availability: Yup.array().of(                    
                Yup.object().shape({                      
                  date: Yup.string().required('Date is required'),                      
                  time: Yup.string().required('Time is required'),                    
                })),                  
                state: Yup.string().required('State is required'),                  
                postcode: Yup.string().required('Postcode is required'),                  
                address: Yup.string().required('Address is required'),
                      })}


      
            onSubmit={
              async (values) => {
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
                  notes 
                } = values;
                
                if (!type || !urgency || !duration || !availability || !state || !postcode || !address ) {
                  Alert.alert('Error', 'Please fill in all fields.' );
                  return;
                }
      
                if (/[a-zA-Z]/.test(postcode)) {
                  Alert.alert('Invalid Postcode', 'Incorrect format.');
                  return;
                } 
      
                try {          
                  const docRef = await addDoc(collection(db, 'bookings'), values);          
                  Alert.alert('Success', 'Booking submitted successfully!');          
                  console.log('Booking ID:', docRef.id);        
                } catch (error) {          
                  console.error('Error submitting booking:', error);          
                  Alert.alert('Error', 'Booking submission failed.');        
                }
              }}
          
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        

        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 300 }} keyboardShouldPersistTaps="handled">
    

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
              {icon}
              <Text style={styles.input}>Service Type</Text>
            </View>

            <View style={ {zIndex:1000, marginLeft:10} }>
            <DropDownPicker
              style={styles.dropdownContainer}
              open={openType}
              value={values.type}
              items = {subcategories.map((sub) => ({
                label: sub,
                value: sub,
              }))}
              setOpen={setOpenType}
              setValue={(val) => setFieldValue('type', val())}
              setItems={() => {}}
              placeholder="Select Service Type"
            />
          </View>
          </View>

          {touched.type && errors.type&& (
            <Text style={styles.error}>{errors.type}</Text>
          )}
          
            
            {/* Urgency */}
            <View style={styles.inputRow}>
            <View style={styles.header}>
              <MaterialIcons name="emergency" size={18} color="#704F38" />
              <Text style={styles.input}>Urgency</Text>
            </View>

            <View style={ {zIndex:900, marginLeft:10} }>
            <DropDownPicker
              style={styles.dropdownContainer}
              open={openUrgency}
              value={values.urgency}
              items={[
                { label: 'Yes, I want to schedule an urgent booking', value: 'Yes' },
                { label: 'No, I want to schedule a future booking', value: 'No' },
              ]}
              setOpen={setOpenUrgency}
              setValue={(val) => setFieldValue('urgency', val())}
              setItems={() => {}}
              placeholder="Do you need it now?"
            />
          </View>
          </View>

          {touched.urgency && errors.urgency && (
            <Text style={styles.error}>{errors.urgency}</Text>
          )}

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
            <View style={ {zIndex:800, marginLeft:10} }>
            <DropDownPicker
              style={styles.dropdownContainer}
              open={openDuration}
              value={values.duration}
              items={[...Array(15)].map((_, i) => ({
                label: `${i + 1} hour${i + 1 > 1 ? 's' : ''}`,
                value: `${i + 1}`,
              }))}
              setOpen={setOpenDuration}
              setValue={(val) => setFieldValue('duration', val())}
              setItems={() => {}}
              placeholder="Select Duration"
            />
          </View>
          </View>

          {touched.duration && errors.duration && (
            <Text style={styles.error}>{errors.duration}</Text>
          )}
          


          <View style={styles.inputRow}>
            <View style={styles.header}>
              <MaterialIcons name="date-range" size={18} color="#704F38" />
              <Text style={styles.input}>Duration</Text>
            </View>
              
              <Text style={{alignSelf: 'center', fontSize:14}}>Select available dates</Text>
              <FieldArray
                          name="availability"
                          render={({ push, remove }) => (
                            <View>
                              {values.availability.map((slot, index) => (
                                <View key={index}>
                                  <TextInput
                                    placeholder="Date (YYYY-MM-DD)"
                                    value={slot.date}
                                    onChangeText={text => setFieldValue(`availability[${index}].date`, text)}
                                    style={styles.input}
                                  />
                                  <TextInput
                                    placeholder="Start Time (eg: 16:3)"
                                    value={slot.time}
                                    onChangeText={text => setFieldValue(`availability[${index}].time`, text)}
                                    style={styles.input}
                                  />
                                  {values.durationHour && values.durationMinute && slot.time && (
                                    <Text style={styles.input}>
                                      Ends at: {calculateEndTime(slot.time, values.durationHour, values.durationMinute)}
                                    </Text>
                                  )}
                                  <Button title="Remove"  onPress={() => remove(index)} />
                                </View>
                              ))}
                              <Button title="Add Time Slot" onPress={() => push({ date: '', time: '' })} />
                            </View>
                          )}
                        />
            </View>
            </View>
       

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Location</Text>
            
            {/* State */}
            <View style={styles.inputRow}>
              <View style={styles.header}>
              <Entypo name="location-pin" size={20} color="#704F38" />
              <Text style={styles.input}>State</Text>
              </View>

              <TextInput
                value={values.state}
                onChangeText={handleChange('state')}
                onBlur={handleBlur('state')}
                style={{fontFamily: 'Sora', fontSize: 14, color: '#704F38', padding: 10,  marginLeft: 10}}
                placeholder="Enter your state"
              />
                        
            {touched.state && errors.state && <Text style={styles.error}>{errors.state}</Text>}
            </View>

            {/* Postcode*/}
            <View style={styles.inputRow}>
              <View style={styles.header}>
              <Entypo name="map" size={18} color="#704F38" />
              <Text style={styles.input}>Postcode</Text>
              </View>

              <TextInput
                value={values.postcode}
                onChangeText={handleChange('postcode')}
                onBlur={handleBlur('postcode')}
                style={{fontFamily: 'Sora', fontSize: 14, color: '#704F38', padding: 10,  marginLeft: 10}}
                placeholder="Enter your postcode"
              />
                        
            {touched.postcode && errors.postcode && <Text style={styles.error}>{errors.postcode}</Text>}
            </View>

            {/* Address */}
            <View style={styles.inputRow}>
              <View style={styles.header}>
              <FontAwesome5 name="map-marked-alt" size={18} color="#704F38" />
              <Text style={styles.input}>Address</Text>
              </View>
              <TextInput
                          value={values.address}
                          onChangeText={handleChange('address')}
                          onBlur={handleBlur('address')}
                          style={styles.input}
                          placeholder="Enter your address"
                        />
                        {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}
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
            
            <View style={ {zIndex:800, marginLeft:10} }>
            <DropDownPicker
              style={styles.dropdownContainer}
              open={openDuration}
              value={values.duration}
              items={[
                { label: 'Female', value: 'female' },
                { label: 'Male', value: 'male' },
              ]}
              setOpen={setOpenGender}
              setValue={(val) => setFieldValue('gender', val())}
              setItems={() => {}}
              placeholder="No Preference"
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

            <View style={ {zIndex:700, marginLeft:10} }>
            <DropDownPicker
              style={styles.dropdownContainer}
              open={openDuration}
              value={values.rating}
              items={[
                { label: '5.0+', value: '5.0'},
                { label:"4.5+", value:"4.5" },
                { label:"4.0+", value:"4.0" },
                { label:"3.5+", value:"3.5" },
                { label:"3.0+", value:"3.0" },
                { label:"2.5+", value:"2.5" },
              ]}
              setOpen={setOpenRating}
              setValue={(val) => setFieldValue('rating', val())}
              setItems={() => {}}
              placeholder="4.0+"
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
                  onValueChange={(val) => setFieldValue('notif', val)}
                />
              </TouchableOpacity>
            </View>

            </View>

          {/* Additional Description*/}
            <View style={styles.inputRow}>
              <View style={styles.preferenceRow}>
                <MaterialIcons name="description" size={16} color="#704F38" />
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
            

          <TouchableOpacity onPress={handleSubmit} style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>




          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      
            )}
          </Formik> 
     
    );

  }

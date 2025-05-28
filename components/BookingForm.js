import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Button } from 'react-native';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';


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

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },

  label: {    
    fontSize: 20,
    fontWeight: 'bold',
    color: '#704F38',
    marginBottom: 8,
    fontFamily: 'Sora',
  },

    input: {
      marginLeft: 10,
      color: '#704F38',
      fontFamily: 'Sora',
      fontSize: 14,
    },

  error: {
    color: '#704F38',
    marginBottom: 10,
  },

  bookNowButton: {
      marginHorizontal: 40,
      marginVertical: 20,
      backgroundColor: '#A76545',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },

    bookNowText: {
      paddingHorizontal: 40,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },

    durationRow: {  
      flexDirection: 'row',  
      justifyContent: 'space-between',  
      marginBottom: 15,
    },


    picker: {  
      flex: 1,  
      marginRight: 10,  
      color: '#704F38',
    },

  });



export default function BookingForm({ onSubmit, initialType}) {
    
  return(
    <Formik
      initialValues={{
        type: initialType || '',
        urgency: '',
        durationHour: '',
        durationMinute: '',
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
        durationHour: Yup.string().required('durationHour is required'),                  
        durationMinute: Yup.string().required('durationMinute is required'),                  
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
            durationHour, 
            durationMinute, 
            availability, 
            state, 
            postcode, 
            address, 
            gender, 
            rating, 
            notif, 
            notes 
          } = values;
          
          if (!type || !urgency || !durationHour || !durationMinute || !availability || !state || !postcode || !address ) {
            Alert.alert('Error', 'Please fill in all fields.' );
            return;
          }

          if (/[a-zA-Z]/.test(postcode)) {
            Alert.alert('Invalid Postcode', 'Incorrect format.');
            return;
          } 

          try {
            const docRef = await addDoc(collection(db, 'bookings'), values);          
            console.log("Document written with ID: ", docRef.id);        
          } catch (e) {          
            console.error("Error adding document: ", e);        
          }
      
        }}
    
    >
  
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

        <View style={styles.form}>
            <Picker
            selectedValue={values.type}
            onValueChange={handleChange('type')}
            style={styles.input}
          >
            <Picker.Item label="Select Service Type" value="" />
            <Picker.Item label="1 hour" value="1 hour" />
            <Picker.Item label="2 hours" value="2 hours" />
            <Picker.Item label="3 hours" value="3 hours" />
          </Picker>
          {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}

           <Text>urgency</Text>
            <Picker
            selectedValue={values.urgency}
            onValueChange={handleChange('urgency')}
            style={styles.input}
          >
            <Picker.Item label="Do you need it right now?" value="" />
            <Picker.Item label="Yes, I want to schedule an urgent booking" value="Yes" />
            <Picker.Item label="No, I want to schedule a future booking" value="No" />
          </Picker>
          {touched.urgency && errors.urgency && <Text style={styles.error}>{errors.urgency}</Text>}


        {/* Duration */}
          <Text>Duration</Text>
          <View style={styles.durationRow}>
            {/* Hour Picker */}
            <Picker
              selectedValue={values.durationHour}
              onValueChange={handleChange('durationHour')}
              style={styles.picker}
            >
              <Picker.Item label="Hour" value="" />
              {[...Array(15)].map((_, i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
              ))}
            </Picker>

            {/* Minute Picker */}
            <Picker
              selectedValue={values.durationMinute}
              onValueChange={handleChange('durationMinute')}
              style={styles.picker}
            >
              <Picker.Item label="Minute" value="" />
              {[0, 15, 30, 45].map((min) => (
                <Picker.Item key={min} label={`${min}`} value={`${min}`} />
              ))}
            </Picker>
          </View>

          {/* Availability (multiple slots) */}
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
                      placeholder="Start Time (HH:mm)"
                      value={slot.time}
                      onChangeText={text => setFieldValue(`availability[${index}].time`, text)}
                      style={styles.input}
                    />
                    {values.durationHour && values.durationMinute && slot.time && (
                      <Text style={styles.input}>
                        Ends at: {calculateEndTime(slot.time, values.durationHour, values.durationMinute)}
                      </Text>
                    )}
                    <Button title="Remove" onPress={() => remove(index)} />
                  </View>
                ))}
                <Button title="Add Time Slot" onPress={() => push({ date: '', time: '' })} />
              </View>
            )}
          />

          {/* state */}
          <Text style={styles.label}>state</Text>
          <TextInput
            value={values.state}
            onChangeText={handleChange('state')}
            onBlur={handleBlur('state')}
            style={styles.input}
            placeholder="Enter your state"
          />
          {touched.state && errors.state && <Text style={styles.error}>{errors.state}</Text>}

          {/* postcode */}
          <Text style={styles.label}>postcode</Text>
          <TextInput
            value={values.postcode}
            onChangeText={handleChange('postcode')}
            onBlur={handleBlur('postcode')}
            style={styles.input}
            placeholder="Enter Your Postcode"
          />
          {touched.postcode && errors.postcode && <Text style={styles.error}>{errors.postcode}</Text>}

          {/* address */}
          <Text style={styles.label}>address</Text>
          <TextInput
            value={values.address}
            onChangeText={handleChange('address')}
            onBlur={handleBlur('address')}
            style={styles.input}
            placeholder="Enter your address"
          />
          {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}

          {/* genderPreference */}
          <Text>gender</Text>
          <Picker
          selectedValue={values.gender}
          onValueChange={handleChange('gender')}
          style={styles.input}
          >
          <Picker.Item label="No Preference" value="No Preference" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Male" value="Male" />
          </Picker>
          {touched.gender && errors.gender && <Text style={styles.error}>{errors.gender}</Text>}       

          {/* Rating */}
          <Text>rating</Text>
          <Picker
          selectedValue={values.rating}
          onValueChange={handleChange('rating')}
          style={styles.input}
          >
          <Picker.Item label="5.0" value="5" />
          <Picker.Item label="4.5+" value="4.5" />
          <Picker.Item label="4.0+" value="4.0" />
          <Picker.Item label="3.5+" value="3.5" />
          <Picker.Item label="3.0+" value="3.0" />
          <Picker.Item label="2.5+" value="2.5" />
          </Picker>
          {touched.rating && errors.rating && <Text style={styles.error}>{errors.rating}</Text>}   

          {/* additionalDescription */}
          <Text style={styles.label}>notes</Text>
          <TextInput
            value={values.notes}
            onChangeText={handleChange('notes')}
            onBlur={handleBlur('notes')}
            style={styles.input}
            placeholder="Tell us more about your request"
          />
          {touched.notes && errors.notes && <Text style={styles.error}>{errors.notes}</Text>}  

          {/* Notification */}
          <Text>Notification</Text>
          <Switch
            value={values.notif}
            onValueChange={(val) => setFieldValue('notif', val)}
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>
        
      )}
    
    </Formik>
  );
}

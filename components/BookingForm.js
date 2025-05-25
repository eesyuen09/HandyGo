import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';


export default function BookingForm({ onSubmit }) {
    
  return (
    <Formik
      initialValues={{
        serviceType: '',
        urgency: '',
        duration: '',
        dates: '',
        state: '',
        region: '',
        address: '',
        gender: '',
        rating: '',
        notif: '',
        notes: '',
      }}

      validationSchema={Yup.object({
                  type: Yup.string().required('Type is required'),
                  urgency: Yup.string().required('Urgency is required'),
                  date: Yup.string().required('Date is required'),
                  address: Yup.string().required('Address is required'),
                })}

      onSubmit={onSubmit || ((values) => console.log('Form submitted:', values))}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

        <View style={styles.form}>
            <Text>serviceType</Text>
            <Picker
            selectedValue={values.serviceType}
            onValueChange={handleChange('serviceType')}
            style={styles.input}
          >
            <Picker.Item label="Select Service Type" value="" />
            <Picker.Item label="1 hour" value="1 hour" />
            <Picker.Item label="2 hours" value="2 hours" />
            <Picker.Item label="3 hours" value="3 hours" />
          </Picker>
          {touched.serviceType && errors.serviceType && <Text style={styles.error}>{errors.serviceType}</Text>}

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

          

          <Text style={styles.label}>Address</Text>
          <TextInput
            value={values.address}
            onChangeText={handleChange('address')}
            onBlur={handleBlur('address')}
            style={styles.input}
            placeholder="Enter your address"
          />
          {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}

          {/* Add more inputs (date, state, region, etc.) here */}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
            <Text style={styles.submitText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#A76545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

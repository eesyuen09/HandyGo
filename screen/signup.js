import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Constants from 'expo-constants';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Octicons, Ionicons, FontAwesome } from '@expo/vector-icons';

import { colours, globalStyles } from '../components/style';

//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';


export default function Signup({ navigation }) {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [dob, setDob] = useState();

  const onChange = (_, selectedDate) => {
    setShow(false);
    setDate(selectedDate || date);
    setDob(selectedDate || date);
  };

  return (
    <KeyboardAvoidingWrapper>
    <View style={globalStyles.container}>
      <StatusBar style="dark" />
      {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
        <View style={globalStyles.inner}>
          <Image
            source={require('../assets/logo_not.jpg')}
            style={globalStyles.logo}
            resizeMode="cover"
          />
          <Text style={globalStyles.title}>HandyGo</Text>
          <Text style={globalStyles.subtitle}>Account Sign Up</Text>

          

          <Formik
            initialValues={{
              fullName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={(values) => console.log(values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <>
                {/* Full Name */}
                <View style={globalStyles.inputWrapper}>
                  <Text style={globalStyles.inputLabel}>Full Name</Text>
                  <View style={globalStyles.inputRow}>
                    <Octicons
                      name="person"
                      size={20}
                      color={colours.white}
                      style={globalStyles.inputIcon}
                    />
                    <TextInput
                      style={globalStyles.textInput}
                      placeholder="Enter Your Full Name Here"
                      placeholderTextColor={colours.white}
                      onChangeText={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      value={values.fullName}
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={globalStyles.inputWrapper}>
                  <Text style={globalStyles.inputLabel}>Email Address</Text>
                  <View style={globalStyles.inputRow}>
                    <Octicons
                      name="mail"
                      size={20}
                      color={colours.white}
                      style={globalStyles.inputIcon}
                    />
                    <TextInput
                      style={globalStyles.textInput}
                      placeholder="Enter Your Email Address Here"
                      placeholderTextColor={colours.white}
                      keyboardType="email-address"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                    />
                  </View>
                </View>

                {/* Date of Birth */}
                <View style={globalStyles.inputWrapper}>
                  <Text style={globalStyles.inputLabel}>Date of Birth</Text>
                  <TouchableOpacity onPress={() => setShow(true)}>
                    <View style={globalStyles.inputRow}>
                      <Octicons
                        name="calendar"
                        size={20}
                        color={colours.white}
                        style={globalStyles.inputIcon}
                      />
                      <TextInput
                        style={globalStyles.textInput}
                        placeholder="YYYY – MM – DD"
                        placeholderTextColor={colours.white}
                        editable={false}
                        value={dob ? dob.toDateString() : ''}
                      />
                      {show && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={onChange}
                    />
                  )}
                    </View>
                  </TouchableOpacity>
                  
                </View>

                {/* Password */}
                <View style={globalStyles.inputWrapper}>
                  <Text style={globalStyles.inputLabel}>Password</Text>
                  <View style={globalStyles.inputRow}>
                    <Octicons
                      name="lock"
                      size={20}
                      color={colours.white}
                      style={globalStyles.inputIcon}
                    />
                    <TextInput
                      style={globalStyles.textInput}
                      placeholder="••••••"
                      placeholderTextColor={colours.white}
                      secureTextEntry={hidePassword}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    <TouchableOpacity
                      onPress={() => setHidePassword(!hidePassword)}
                      style={globalStyles.rightIconRow}
                    >
                      <Ionicons
                        name={hidePassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={colours.white}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password */}
                <View style={globalStyles.inputWrapper}>
                  <Text style={globalStyles.inputLabel}>Confirm Password</Text>
                  <View style={globalStyles.inputRow}>
                    <Octicons
                      name="lock"
                      size={20}
                      color={colours.white}
                      style={globalStyles.inputIcon}
                    />
                    <TextInput
                      style={globalStyles.textInput}
                      placeholder="••••••"
                      placeholderTextColor={colours.white}
                      secureTextEntry={hidePassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      value={values.confirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setHidePassword(!hidePassword)}
                      style={globalStyles.rightIconRow}
                    >
                      <Ionicons
                        name={hidePassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={colours.white}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit */}
                <TouchableOpacity
                  style={globalStyles.button}
                  onPress={handleSubmit}
                >
                  <Text style={globalStyles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={globalStyles.line} />

                {/* Back to Login */}
                <View style={globalStyles.extraView}>
                  <Text style={globalStyles.extraText}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={globalStyles.linkText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      {/* </ScrollView> */}
    </View>
    </KeyboardAvoidingWrapper>
  );
}

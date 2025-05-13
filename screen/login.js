import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons, Ionicons, FontAwesome } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import { colours, globalStyles } from '../components/style';
//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

export default function Login({ navigation }) {
  const [hidePassword, setHidePassword] = useState(true);
  const { white } = colours;

  return (
    <KeyboardAvoidingWrapper>
    <View style={globalStyles.container}>
      <StatusBar style="dark" />

      <View style={globalStyles.inner}>
        {/* Logo */}
        <Image
          source={require('../assets/logo_not.jpg')}
          style={globalStyles.logo}
          resizeMode="cover"
        />

        {/* Titles */}
        <Text style={globalStyles.title}>HandyGo</Text>
        <Text style={globalStyles.subtitle}>Account Login</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values) => {
            console.log(values);
            navigation.navigate('Welcome');
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              {/* Email Field */}
              <View style={globalStyles.inputWrapper}>
                <Text style={globalStyles.inputLabel}>Email Address</Text>
                <View style={globalStyles.inputRow}>
                  <Octicons
                    name="mail"
                    size={20}
                    color={white}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.textInput}
                    placeholder="Enter Your Email Here"
                    placeholderTextColor={white}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={globalStyles.inputWrapper}>
                <Text style={globalStyles.inputLabel}>Password</Text>
                <View style={globalStyles.inputRow}>
                  <Octicons
                    name="lock"
                    size={20}
                    color={white}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.textInput}
                    placeholder="••••••"
                    placeholderTextColor={white}
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
                      color={white}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={globalStyles.button}
                onPress={handleSubmit}
              >
                <Text style={globalStyles.buttonText}>Login</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={globalStyles.line} />

              {/* Google Button */}
              <TouchableOpacity
                style={globalStyles.button}
                onPress={handleSubmit}
              >
                <View style={globalStyles.googleButtonContent}>
                  <FontAwesome
                    name="google"
                    size={20}
                    color={white}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={globalStyles.buttonText}>Sign In with Google</Text>
                </View>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={globalStyles.extraView}>
                <Text style={globalStyles.extraText}>
                  Don't have an account already?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={globalStyles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
    </KeyboardAvoidingWrapper>
  );
}




        

        
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
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
import { signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  const [hidePassword, setHidePassword] = useState(true);
  const { white } = colours;
    const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '158473300904-4qg6m53aic6gtp2ttjlcg19b0rihshhi.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'business') {
              navigation.navigate('Business Dashboard');
            } else {
              navigation.navigate('User Dashboard');
            }
          } else {
            // First-time Google login — ask role or default
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              fullName: user.displayName,
              role: 'user', // or ask user for role
              createdAt: new Date().toISOString()
            });
            navigation.navigate('User Dashboard');
          }
        })
        .catch((error) => {
          console.error('Firebase login error:', error);
          Alert.alert('Login Error', error.message);
        });
    }
  }, [response]);



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
          onSubmit={async (values) => {
            const { email, password } = values;
              if (!email || !password) {
                Alert.alert('Error', 'Please fill in all fields.' );
                return;
              }

               try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  const userData = docSnap.data();
                  if (userData.role == 'business') {
                    navigation.navigate('Business Dashboard');
                  } else if (userData.role == 'user') {
                    navigation.navigate('User Dashboard');
                  } else {
                    Alert.alert('Error', 'No role assigned' )
                  }
                }   
               } catch (error) {
                 if (error.code === 'auth/user-not-found') {
                  Alert.alert('Error', 'No user found' );                  
                } else if (error.code === 'auth/wrong-password') {
                  Alert.alert('Error', 'Incorrect password'  );                     
                } else {
                  Alert.alert('Error', error.message);  
                }
              }                                      
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
                onPress={() => promptAsync()}
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




        

        
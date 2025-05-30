
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

export default function Welcome({navigation}) {
  return (
    <KeyboardAvoidingWrapper>
    <View style={globalStyles.container}>
      <StatusBar style="dark" />

      <View style={globalStyles.inner}>
        {/* Logo */}
        <Image
          source={require('../assets/png.png')}
          style={globalStyles.logo}
          resizeMode="cover"
        />
        <View style = {globalStyles.welcomeContainer}>
        {/* Titles */}
            <Text style={globalStyles.title}>HandyGo</Text>
            <Text style={globalStyles.subtitle}>Good to see you! Let’s match you with someone who needs a hand. </Text>

            {/* Divider */}
            <View style={globalStyles.line} />
        </View>
        <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.navigate('Login')}>
            <Text
                style={globalStyles.buttonText}>
            Sign Out
            </Text>
        </TouchableOpacity>

      </View>
    </View>
    </KeyboardAvoidingWrapper>
  );
}





        

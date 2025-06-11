import React, {useState} from 'react';
import {View, 
        Text, 
        TextInput, 
        TouchableOpacity, 
        StyleSheet, 
        Alert, 
        ActivityIndicator } from 'react-native';

import {StatusBar} from 'expo-status-bar';//status bar: area at the top of the screen, like battery level, time..

import {Octicons} from '@expo/vector-icons';

import { colours, globalStyles} from '../components/style_loginsignup';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import {getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword({navigation}){
    const [email, setEmail] = useState('');
    // const [loading, setLoading] = useState(false);
    const {white} = colours;
    const auth = getAuth(); //get the Firebase Auth instance,tools to handle user authentication for this application, 'Auth' variable handle the tools
    
    async function handleForgotPassword (){
        if(!email) {
            Alert.alert('Error, please enter your email address.');
            return;
        }

        // setLoading(true);
        try{
            await sendPasswordResetEmail(auth,email);
            Alert.alert(
                "Success. If a user with that email exists, a password reset email has been sent! Please check your inbox and spam folder."
            );
            setEmail('');
            navigation.goBack();
        }catch(error){
            console.error('Forgot password error:', error.code, error.message);
            let errorMessage = 'An error occurred. Please try again.';
            // More specific error messages for user-friendliness
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'The email address is not valid.';
            } else if (error.code === 'auth/user-not-found') {
                // some suggestions: For security, still show generic success message
                // This prevents an attacker from enumerating valid email addresses.
                Alert.alert(
                    'Success',
                    'If a user with that email exists, a password reset email has been sent! Please check your inbox and spam folder.'
                );
                
            setEmail('');
            return;
        }
        Alert.alert('Error', errorMessage);
    }
}
    return (
        <KeyboardAvoidingWrapper>
            <View style = {globalStyles.container}>
                <StatusBar style = 'dark' />
                <View style = {globalStyles.inner}>
                    <Text style = {globalStyles.title}>Reset Your Password</Text>
                    <Text style = {globalStyles.subtitle}>
                        Enter you email to receive a password reset link.
                    </Text>

                <View style = {globalStyles.inputWrapper}>
                    <Text style = {globalStyles.inputLabel}>Email Address</Text>
                    <View style = {globalStyles.inputRow}>
                        <Octicons
                            name = 'mail'
                            size = {20}
                            color={white}
                            style = {globalStyles.inputIcon}
                        />
                        <TextInput
                            style = {globalStyles.textInput}
                            placeholder='Enter Your Email Here'
                            placeholderTextColor={white}
                            onChangeText={setEmail}
                            value={email}
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style = {globalStyles.button}
                    onPress = {handleForgotPassword}>
                    <Text style = {globalStyles.buttonText}>Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style = {globalStyles.extraView}
                />
            
                </View>
            </View>
        </KeyboardAvoidingWrapper>
    );
}
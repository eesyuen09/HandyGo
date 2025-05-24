import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ImageBackground,
  } from 'react-native';
import { Formik } from 'formik';

import { colours, style } from '../components/style_bizhomepage';
import bg from '../assets/bg.png';
//fonts
import { useFonts } from 'expo-font';

//firebase storage
import { getDocs, doc, collection, getDoc } from 'firebase/firestore';
// use (getDocs + collection) to fetch all documents in a collection, use (getDoc+doc) to fetch single document
import { db } from '../firebaseConfig';

import { auth } from '../firebaseConfig';
const uid = auth.currentUser.uid;



//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// route: contain parameters passed from the previous screen
export default function biz_homepage({ route, navigation}) {
    // const {uid} = route.params;
    const {
      darkest_coco,
      main_coco,
      beige,
      grey,
      white,
      yellow_brown,
      black
    } = colours;

    const [BusinessName, setBusinessName] = useState('');

    useEffect(() => {
        async function fetchBusinessName() {
          const ref = doc(db, 'serviceProviders', uid); //Build a reference to the Firestore document at collection “serviceProviders” with ID = uid
          
          const snap = await getDocs(ref); //fetch that document snapshot from Firestore
          if (snap.exists()) {
            setBusinessName(snap.data().businessName);
          } else {
            console.warn('No serviceProvider document for uid:', uid);
          }
        }
    
        fetchBusinessName(); //The dependency array: re-run this entire effect
        //    (and refetch) whenever `uid` changes
      }, [uid]);

  

    const [fontsLoaded] = useFonts({
        'Sora': require('../assets/font/Sora-VariableFont_wght.ttf'),
        'Inter': require('../assets/font/Inter-regular.ttf')
      });
      if(!fontsLoaded){
        return null;
      }
    return(
        <KeyboardAvoidingWrapper>
        <ImageBackground source={bg} style = {style.background}>
            <View style = {style.inner}>
                { /*Logo*/}
                <Image 
                source={require('../assets/HandyGo Logo.png')}
                style= {style.logo}
                resizeMode = 'cover'
            />

            {/* titles */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={style.title}>
                    Welcome Back, {BusinessName}!
                </Text>
            </View>

            <View style ={style.Button}>
                <Text style = {style.ButtonText}>
                    Urgent Task
                </Text>
            </View>

            <View style ={style.Button}>
                <Text style = {style.ButtonText}>
                    Scheduled Task
                </Text>
            </View>

            </View>
        </ImageBackground>
        </KeyboardAvoidingWrapper>
    )
}
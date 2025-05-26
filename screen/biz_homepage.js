// import React, {useState, useEffect} from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Image,
//     Alert,
//     ImageBackground
//   } from 'react-native';
// import { Formik } from 'formik';

// import { colours, style } from '../components/style_bizhomepage';
// import bg from '../assets/bg.png';
// //fonts
// import { useFonts } from 'expo-font';

// //firebase storage
// import { getDocs, doc, collection, getDoc } from 'firebase/firestore';
// // use (getDocs + collection) to fetch all documents in a collection, use (getDoc+doc) to fetch single document
// import { db } from '../firebaseConfig';

// import { auth } from '../firebaseConfig';






// //keyboardavoidingwrapper
// import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// // route: contain parameters passed from the previous screen
// export default function biz_homepage({ navigation, uid}) {
//     const {
//       darkest_coco,
//       main_coco,
//       beige,
//       grey,
//       white,
//       yellow_brown,
//       black
//     } = colours;

//     const [BusinessName, setBusinessName] = useState('');

//     useEffect(() => {
//         async function fetchBusinessName() {
//           const user = auth.currentUser;

//           if (!user){
//             console.warn('User not logged in');
//             return
//           }
//           const ref = doc(db, 'users', user.uid); //Build a reference to the Firestore document at collection “serviceProviders” with ID = uid
          
//           const snap = await getDoc(ref); //fetch that document snapshot from Firestore
//           if (snap.exists()) {
//             setBusinessName(snap.data().businessName);
//           } else {
//             console.warn('No serviceProvider document for uid:', user.uid);
//           }
//         }
    
//         fetchBusinessName(); //The dependency array: re-run this entire effect
//         //    (and refetch) whenever `uid` changes
//       }, []);

  

//     const [fontsLoaded] = useFonts({
//         'Sora': require('../assets/fonts/Sora-VariableFont_wght.ttf'),
//         'Inter': require('../assets/fonts/Inter-regular.ttf')
//       });
//       if(!fontsLoaded){
//         return null;
//       }
//     return(
//         <KeyboardAvoidingWrapper>
//         <ImageBackground source={bg} style = {style.background}>
//             <View style = {style.inner}>
 

//             {/* titles */}
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <Text style={style.title}>
//                     Welcome Back, {BusinessName}!
//                 </Text>
//             </View>

//             <View style ={style.Button}>
//                 <Text style = {style.ButtonText}>
//                     Urgent Task
//                 </Text>
//             </View>

//             <View style ={style.Button}>
//                 <Text style = {style.ButtonText}>
//                     Scheduled Task
//                 </Text>
//             </View>

//             </View>
//         </ImageBackground>
//         </KeyboardAvoidingWrapper>
//     )
// }

import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Button,
} from 'react-native';

import { useFonts } from 'expo-font';


import { colours, style } from '../components/style_bizhomepage';

import bg from '../assets/bg.png'


export default function Biz_homepage({navigation}){
  const [fontsLoaded] = useFonts({
    'Sora': require('../assets/fonts/Sora-VariableFont_wght.ttf'),
    'Inter': require('../assets/fonts/Inter-regular.ttf'),

  });

  if (!fontsLoaded) return null;
  
  return(
    <ImageBackground source={bg} style = {style.background}>
      <View>
        <Text style={style.title}>
          Welcome Back! Good to see you! Let’s match you with someone who needs a hand.
        </Text>
      </View>

      <TouchableOpacity 
        style = {style.button}
        onPress={() => navigation.navigate('Login')}>

        <Text style={style.buttonText}>
        Urgent Task
      </Text>
      </TouchableOpacity>
    
     

      <TouchableOpacity 
        style = {style.button}
        onPress={() => navigation.navigate('Signup')}>
      <Text style={style.buttonText}>
          Booking Request
        </Text>

      </TouchableOpacity>

    </ImageBackground>
  )

}
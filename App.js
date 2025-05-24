import React from 'react';
import { StatusBar } from 'expo-status-bar';


//screen

// import Login from './screen/login';
// import Signup from './screen/signup';
import Moredetails from './screen/moredetails';
import Onboard from './screen/onboardingpg';



import { NavigationContainer } from '@react-navigation/native';
// react navigation stack
import RootStack from './navigator/RootStack';




export default function App() {
  return (

    <NavigationContainer>
    <RootStack/>
  </NavigationContainer>

  );
}

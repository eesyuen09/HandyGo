import React from 'react';
import { StatusBar } from 'expo-status-bar';


//screen
// import Login from './screen/login';
// import Signup from './screen/signup';
import Moredetails from './screen/moredetails';
import User_homepage from './screen/user_home';
import User_booking from './screen/user_booking';

// import { NavigationContainer } from '@react-navigation/native';
// react navigation stack
// import RootStack from './navigator/RootStack';




export default function App() {
  return (
  //   <NavigationContainer>
  //   <RootStack/>
  // </NavigationContainer>
  //  < Moredetails/>
   //<User_homepage/>
   <User_booking/>
  );
}

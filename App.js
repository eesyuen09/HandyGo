import React from 'react';
import { StatusBar } from 'expo-status-bar';


//screen

import PrepopulateWorkerMaps from './constants/categorymap';
import Login from './screen/login';
import Signup from './screen/signup';
import Moredetails from './screen/moredetails';
import Onboard from './screen/onboardingpg';
import Biz_homepage from './screen/biz_homepage';
import UrgentTask from './screen/biz_urgenttask';



import { NavigationContainer } from '@react-navigation/native';
// react navigation stack
import RootStack from './navigator/RootStack';




export default function App() {
  return (
  //   <>
  //   <PrepopulateWorkerMaps/>
  //   <NavigationContainer>
  //   <RootStack/>
  // </NavigationContainer>
  // </>
  <UrgentTask/>
  );
}

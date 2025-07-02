import React from 'react';


//screen

import PrepopulateWorkerMaps from './constants/categorymap';




import { NavigationContainer } from '@react-navigation/native';
// react navigation stack
import RootStack from './navigator/RootStack';




export default function App() {
  return (
    <>
    <PrepopulateWorkerMaps/>
    <NavigationContainer>
    <RootStack/>
  </NavigationContainer>
  </>
  
  );
}
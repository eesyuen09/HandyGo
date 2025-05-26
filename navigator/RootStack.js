import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';


import {colours} from '../components/style_loginsignup';



const Stack = createNativeStackNavigator();
const {darkest_coco, main_coco, beige, grey, white, yellow_brown, black} = colours;

//screens
import PrepopulateWorkerMaps from '../constants/categorymap';
import Onboard from '../screen/onboardingpg';
import Login from '../screen/login';
import Signup from '../screen/signup';
// import businessDashboard from '../screen/welcome_business';
// import userDashboard from '../screen/welcome_user';
import Biz_adddetails from '../screen/moredetails';
import Biz_homepage from '../screen/biz_homepage';


const RootStack = () => {
    return (
      <>
      <PrepopulateWorkerMaps/>
      <Stack.Navigator 
      initialRouteName='Login'
      screenOptions={{
         headerStyle: {
          backgroundColor: 'transparent'
         },
         headerTintColor: main_coco,
         headerTransparent: true,
         headerTitle: '',
         headerLeftContainerStyle: {
            paddingLeft: 20
         }

         }}>
        <Stack.Screen name = "Onboard" component={Onboard}/>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name= 'Business Home Page' component={Biz_homepage}/>
        <Stack.Screen name = "Add Details" component={Biz_adddetails}/>
      </Stack.Navigator>
      </>
    );
  };
  
  export default RootStack;
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
import UserHome from '../screen/user_home';
import UserBooking from '../screen/user_booking';
import Biz_adddetails from '../screen/moredetails';
import Biz_homepage from '../screen/biz_homepage';
import Biz_urgentTask from '../screen/biz_urgenttask';
import ForgotPassword from '../screen/forgotpassword';
import Biz_ordersummary from '../screen/biz_ordersummary';


const RootStack = () => {
    return (
      <>
      {/* <PrepopulateWorkerMaps/> */}
      <Stack.Navigator 
      initialRouteName='Onboard'
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
        <Stack.Screen name="UserHome" component={UserHome} />
        <Stack.Screen name="UserBooking" component={UserBooking}
        options={{
          headerTitle: 'Booking',
          headerTransparent: false,
          headerStyle: {
            backgroundColor: 'white',           
          },
          headerTintColor: main_coco,
          headerTitleStyle: {
            fontFamily: 'Sora',     
            fontSize: 18,             
            color: darkest_coco,         
          },
        }}
       />
        <Stack.Screen name= 'Business Home Page' component={Biz_homepage}/>
        <Stack.Screen name = "Add Details" component={Biz_adddetails}/>
        <Stack.Screen name = 'Business Urgent Task' component ={Biz_urgentTask}/>
        <Stack.Screen name = 'Forgot Password' component={ForgotPassword}/>
        <Stack.Screen name = 'Business Order Summary' component = {Biz_ordersummary} options={{headerShown: false}}/>

      </Stack.Navigator>
      </>
    );
  };
  
  export default RootStack;
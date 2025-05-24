import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
<<<<<<< HEAD

import {colours} from '../components/style_loginsignup';

=======
import {colours} from './../components/style_onboardingpg';
>>>>>>> onboarding

const Stack = createNativeStackNavigator();
const {darkest_coco, main_coco, beige, grey, white, yellow_brown, black} = colours;



//screens
// import Login from '../screen/login';
// import Signup from '../screen/signup';
// import businessDashboard from '../screen/welcome_business';
// import userDashboard from '../screen/welcome_user';

const RootStack = () => {
    return (
      <Stack.Navigator 
      initialRouteName='Login'
      screenOptions={{
         headerStyle: {
          backgroundColor: 'transparent'
         },
         headerTintColor: primary_darkestblue,
         headerTransparent: true,
         headerTitle: '',
         headerLeftContainerStyle: {
            paddingLeft: 20
         }

         }}>
          
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name= 'Business Dashboard' component={businessDashboard}/>
        <Stack.Screen name= 'User Dashboard' component={userDashboard}/>
      </Stack.Navigator>
    );
  };
  
  export default RootStack;
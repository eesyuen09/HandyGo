import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import {View} from 'react-native';
import {
  FontAwesome5,
  AntDesign,
  MaterialIcons,
  Entypo,
  FontAwesome,
  Feather,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";


import {colours} from '../components/style_loginsignup';



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
import Biz_scheduledTask from '../screen/biz_scheduledtask';
import ForgotPassword from '../screen/forgotpassword';
import Biz_ordersummary from '../screen/biz_ordersummary';
import Moredetails from '../screen/moredetails';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colours.darkest_coco,
        tabBarInactiveTintColor: colours.main_coco,
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: beige,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Biz_homepage}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Biz_adddetails}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-edit-outline" size={24} color={color} />
          ),
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="UrgentTask"
        component={Biz_urgentTask}
        options={{
          //options meaning: to customize the tab appearance or behaviour
          tabBarIcon: ({ color }) => (
              <FontAwesome5 name="wallet" size={24} color ={color} />
          ),
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Login} // placeholder
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} />,
          tabBarLabel: ''
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Signup} // placeholder
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
          tabBarLabel: '',
        }}
        
      />
    </Tab.Navigator>
  );
}


const RootStack = () => {
    return (
      <>
      {/* <PrepopulateWorkerMaps/> */}
      <Stack.Navigator 
      initialRouteName='Onboard'
      screenOptions={{
        //  headerStyle: {
        //   backgroundColor: 'transparent'
        //  },
        //  headerTintColor: main_coco,
        //  headerTransparent: true,
        //  headerTitle: '',
        //  headerLeftContainerStyle: {
        //     paddingLeft: 20
        //  }
          headerShown: false
         }}>
        {/* Main App (after login) */}
        <Stack.Screen name="MainApp" component={BottomTabs} />
        

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
        <Stack.Screen name= 'Business Home Page' component={Biz_homepage} />
        <Stack.Screen name = "Add Details" component={Biz_adddetails} />
        <Stack.Screen name = 'Business Urgent Task' component ={Biz_urgentTask} />
        <Stack.Screen name = 'Business Scheduled Task' component = {Biz_scheduledTask} />
        <Stack.Screen name = 'Forgot Password' component={ForgotPassword} />
        <Stack.Screen name = 'Business Order Summary' component = {Biz_ordersummary}/>
        

      </Stack.Navigator>
      </>
    );
  };
  
  export default RootStack;
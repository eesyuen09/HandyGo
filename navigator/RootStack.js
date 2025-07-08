import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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

import { colours } from "../components/style_loginsignup";

const Stack = createNativeStackNavigator();

const { darkest_coco, main_coco, beige, grey, white, yellow_brown, black } =
  colours;

//screens
import PrepopulateWorkerMaps from "../constants/categorymap";
import Onboard from "../screen/onboardingpg";
import Login from "../screen/login";
import Signup from "../screen/signup";
import UserHome from "../screen/user_home";
import UserBooking from "../screen/user_booking";
import UserActivity from "../screen/user_activity";
import Biz_adddetails from "../screen/moredetails";
import Biz_homepage from "../screen/biz_homepage";
import Biz_urgentTask from "../screen/biz_urgenttask";
import Biz_scheduledTask from "../screen/biz_scheduledtask";
import ForgotPassword from "../screen/forgotpassword";
import Biz_ordersummary from "../screen/biz_ordersummary";
import UserTabs from "./userTabs";
import WorkerTabs from "./workerTabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FilterScreen from "../screen/biz_servicefilter";

const stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RootStack = () => {
  return (
    <>
      {/* <PrepopulateWorkerMaps/> */}
      <Stack.Navigator
        initialRouteName="Onboard"
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
          headerShown: false,
        }}
      >
        {/* {!user ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            
          </>
        ) : role === "business" ? (
          <Stack.Screen name="workerTabs" component={workerTabs} />
        ) : (
          <Stack.Screen name="UserTabs" component={UserTabs} />
        )} */}

        <Stack.Screen name="Onboard" component={Onboard} />
        <Stack.Screen name="UserTabs" component={UserTabs} />
        <Stack.Screen name="WorkerTabs" component={WorkerTabs} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="UserHome" component={UserHome} />
        <Stack.Screen
          name="UserBooking"
          component={UserBooking}
          options={{
            headerTitle: "Booking",
            headerTransparent: false,
            headerStyle: {
              backgroundColor: "white",
            },
            headerTintColor: main_coco,
            headerTitleStyle: {
              fontFamily: "Sora",
              fontSize: 18,
              color: darkest_coco,
            },
          }}
        />
        <Stack.Screen
          name="UserActivity"
          component={UserActivity}
          options={{
            headerTitle: "Activity",
            headerTransparent: false,
            headerStyle: {
              backgroundColor: "white",
            },
            headerTintColor: main_coco,
            headerTitleStyle: {
              fontFamily: "Sora",
              fontSize: 18,
              color: darkest_coco,
            },
          }}
        />
        <Stack.Screen name="Business Home Page" component={Biz_homepage} />
        <Stack.Screen name="Add Details" component={Biz_adddetails} />
        <Stack.Screen name="Business Urgent Task" component={Biz_urgentTask} />
        <Stack.Screen
          name="Business Scheduled Task"
          component={Biz_scheduledTask}
        />
        <Stack.Screen name="FilterScreen" component={FilterScreen} />
        <Stack.Screen name="Forgot Password" component={ForgotPassword} />
        <Stack.Screen name="Order Summary" component={Biz_ordersummary} />
      </Stack.Navigator>
    </>
  );
};

export default RootStack;

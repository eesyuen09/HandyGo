import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import { useNavigation } from "@react-navigation/native";
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
import UserRating from "../screen/user_rating";

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
            header: () => {
              const navigation = useNavigation();
              return (
                <SafeAreaView
                  style={{
                    backgroundColor: "white",
                    paddingTop:
                      Platform.OS === "android" ? StatusBar.currentHeight : 0,
                  }}
                >
                  <View
                    style={{
                      height: 60,
                      paddingHorizontal: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Ionicons name="arrow-back" size={24} color="#704F38" />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Sora",
                        color: "#704F38",
                      }}
                    >
                      Booking
                    </Text>
                    <View style={{ width: 24 }} />{" "}
                    {/* Spacer to balance layout */}
                  </View>
                </SafeAreaView>
              );
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
        <Stack.Screen name="UserRating" component={UserRating} />
        <Stack.Screen name="Business Home Page" component={Biz_homepage} />
        <Stack.Screen name="Add Details" component={Biz_adddetails} />
        <Stack.Screen name="Business Urgent Task" component={Biz_urgentTask} />
        <Stack.Screen
          name="Business Scheduled Task"
          component={Biz_scheduledTask}
        />
        <Stack.Screen name="Forgot Password" component={ForgotPassword} />
        <Stack.Screen name="Order Summary" component={Biz_ordersummary} />
      </Stack.Navigator>
    </>
  );
};

export default RootStack;

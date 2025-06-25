import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import UserHome from "../screen/user_home";
import UserActivity from "../screen/user_activity";
import Signup from "../screen/signup";
import { colours } from "../components/style_loginsignup";

const Tab = createBottomTabNavigator();

const { darkest_coco, main_coco, beige, grey, white, yellow_brown, black } =
  colours;

export default function UserTabs() {
  return (
    <Tab.Navigator
      initialRouteName="UserHome"
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
        component={UserHome}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Activity"
        component={UserActivity}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-edit-outline"
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />

      {/* <Tab.Screen
            name="Chat"
            component={Login} // placeholder
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="chatbubble-outline" size={24} color={color} />
              ),
              tabBarLabel: "",
            }} 
          /> */}

      <Tab.Screen
        name="Profile"
        component={Signup} // placeholder
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
          tabBarLabel: "",
        }}
      />
    </Tab.Navigator>
  );
}

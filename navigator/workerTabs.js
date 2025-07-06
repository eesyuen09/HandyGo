import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { colours } from "../components/style_loginsignup";

import Biz_homepage from "../screen/biz_homepage";
import Biz_activitypage from "../screen/biz_activitypage";
import Biz_urgentTask from "../screen/biz_urgenttask";
import Login from "../screen/login"; // placeholder
import Signup from "../screen/signup"; // placeholder
import EditProfile from "../screen/both_editprofile";

const { darkest_coco, main_coco, beige, grey, white, yellow_brown, black } =
  colours;

const Tab = createBottomTabNavigator();

export default function WorkerTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Biz_homepage"
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
        name="Biz_homepage"
        component={Biz_homepage}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Biz_activitypage}
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
      <Tab.Screen
        name="UrgentTask"
        component={Biz_urgentTask}
        options={{
          //options meaning: to customize the tab appearance or behaviour
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="wallet" size={24} color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Login} // placeholder
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Edit Profile"
        component={EditProfile} // placeholder
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

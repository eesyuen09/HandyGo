import React from "react";
import { StatusBar } from "expo-status-bar";

//screen

import PrepopulateWorkerMaps from "./constants/categorymap";

import { NavigationContainer } from "@react-navigation/native";
// react navigation stack
import RootStack from "./navigator/RootStack";

export default function App() {
  return (
    <>
      <PrepopulateWorkerMaps />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </>
  );
}

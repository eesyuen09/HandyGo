import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Button,
} from "react-native";

import { useFonts } from "expo-font";

import { colours, globalStyles } from "../components/style_onboardingpg";

import bg from "../assets/onboardingbg.png";

export default function Onboarding({ navigation }) {
  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ImageBackground source={bg} style={globalStyles.background}>
      <View>
        <Text style={globalStyles.title}>HandyGo</Text>
      </View>

      <View>
        <Text style={globalStyles.subtitle}>Your Go-To for Home Services</Text>
      </View>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate("UserHome")}
      >
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={globalStyles.buttonText}>SignUp</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}


import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Button,
} from "react-native";

import { useFonts } from "expo-font";

import { colours, style } from "../components/style_bizhomepage";

import bg from "../assets/bg.png";

export default function Biz_homepage({ navigation }) {
  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ImageBackground source={bg} style={style.background}>
      <View>
        <Text style={style.title}>
          Good to see you! Let’s match you with someone who needs a hand.
        </Text>
      </View>

      <TouchableOpacity
        style={style.button}
        onPress={() => navigation.navigate("Business Urgent Task")}
      >
        <Text style={style.buttonText}>Urgent Task</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={style.button}
        onPress={() => navigation.navigate("Business Scheduled Task")}
      >
        <Text style={style.buttonText}>Scheduled Task</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

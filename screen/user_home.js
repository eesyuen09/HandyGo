import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
  } from 'react-native';

import { colours, styles } from '../components/style_u_home';
console.log("STYLES LOADED:", styles);

//fonts
import { useFonts } from 'expo-font';

//firebase storage
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

//category import
import { services_catogories } from '../constants/categories';

//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Feather, AntDesign, MaterialIcons, FontAwesome5, FontAwesome6} from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function user_home() {
    const {
          darkest_coco,
          main_coco,
          beige,
          grey,
          white,
          yellow_brown,
          black
        } = colours;

    const [fontsLoaded] = useFonts({
            'Sora': require('../assets/font/Sora-VariableFont_wght.ttf'),
            'Inter': require('../assets/font/Inter-regular.ttf')
          });
          if(!fontsLoaded){
            return null;
          }

    const services = [
        { icon: <MaterialIcons name="cleaning-services" size={30} color = {colours.darkest_coco} />, label: 'Cleaning' },
        { icon: <FontAwesome5 name="truck-moving" size={30} color = {colours.darkest_coco}/>, label: 'Moving' },
        { icon: <Feather name="tool" size={35} color = {colours.darkest_coco} />, label: 'Repair' },
        { icon: <FontAwesome6 name="border-all" size={30} color = {colours.darkest_coco}/>, label: 'All' },
    ];

    // const iconMap = {
    //     'cleaning.png': require('../assets/icons/cleaning.png'),
    //     'organizing.png': require('../assets/icons/organizing.png'),
    //     'repair_icon.png': require('../assets/icons/repair_icon.png'),
    //     'all.png': require('../assets/icons/all.png'),
    // };

    const serviceBanners = [
        { image: 'Moving.png', label: 'Moving'},
        { image: 'home_organization.png', label: 'Home Organization'  },
        { image: 'repair_banner.jpg', label: 'Repair' }
    ];

    const bannerImageMap = {
        'Moving.png': require('../assets/images/Moving.png'),
        'home_organization.png': require('../assets/images/home_organization.png'),
        'repair_banner.jpg': require('../assets/images/repair_banner.png')
    };

    const handlePress = (label) => {
        console.log(`Pressed: ${label}`);
    };
                   
  return (
    <View style={styles.frame}>
      {/* Top Search Bar */}
      <View style = {styles.container}>
      <View style={styles.searchBar}>
        <AntDesign name="search1" size={24} color="white"  style={styles.searchIcon} />
        <TextInput
          placeholder="Looking for any service?"
          placeholderTextColor="white"
          style={styles.searchInput}
        />
        </View>
      </View>

      <ScrollView>
        {/* Popular Services Section */}
        <View style = {styles.section}>
            <Text style = {styles.sectionTitle}>Popular Services</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
                {services.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.icon}>
                    <View style={styles.circle}>
                        {item.icon}
                    </View>
                    <Text style={styles.iconLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
                </ScrollView>

        </View>


       {/* Services You May Like Section */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle} > Service You May Like </Text>
        {serviceBanners.map((item, index) => (
            <TouchableOpacity
            key={index}
            style={styles.serviceBanner}
            onPress={() => handlePress(item.label)}
            >
            <View>
            <Text style={styles.bannerLabel}>{item.label}</Text>
            <Image
                source={bannerImageMap[item.image]}
                style={styles.serviceBanner}
            />

            </View>
            
            </TouchableOpacity>
        ))}
        </View>
      </ScrollView>
    </View>
  );
}
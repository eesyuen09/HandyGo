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
import { Octicons, Ionicons, FontAwesome } from '@expo/vector-icons';
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
        { icon: 'cleaning.png', label: 'Cleaning' },
        { icon: 'organizing.png', label: 'Home \n Organising' },
        { icon: 'repair_icon.png', label: 'Home \nRepair' },
        { icon: 'all.png', label: 'All' },
    ];

    const iconMap = {
        'cleaning.png': require('../assets/icons/cleaning.png'),
        'organizing.png': require('../assets/icons/organizing.png'),
        'repair_icon.png': require('../assets/icons/repair_icon.png'),
        'all.png': require('../assets/icons/all.png'),
    };

    const serviceBanners = [
        { image: 'Moving.png' },
        { image: 'home_organization.png' },
        { image: 'repair_banner.jpg' }
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
        <Image source={require('../assets/icons/search.png')} style={styles.searchIcon} />
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
                        <Image source={iconMap[item.icon]} style={styles.iconImage} />
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
            <Image
                source={bannerImageMap[item.image]}
                style={styles.serviceBanner}
            />
            </TouchableOpacity>
        ))}
        </View>
      </ScrollView>
    </View>
  );
}
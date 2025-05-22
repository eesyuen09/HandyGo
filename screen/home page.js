import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
  } from 'react-native';
import { Formik } from 'formik';

import { colours, style } from '../components/style';

//fonts
import { useFonts } from 'expo-font';

//firebase storage
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';



//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Octicons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
// route: contain parameters passed from the previous screen
export default function moredetails({ route, navigation}) {
    const {uid} = route.params;
    const {
      darkest_coco,
      main_coco,
      beige,
      grey,
      white,
      yellow_brown,
      black
    } = colours;

    const handleBusinessDetailsSubmit = async (values) =>{
            const{ contact, address, NRIC, bankName, bankNumber, qualificationsSkillsExperiences, introduction } = values;

            {/* validation check */}
            if (!contact || !address || !NRIC || !bankName || !bankNumber) {
                Alert.alert('Error', 'Please fill in all required fields.');
                return;
              }
            
              if (/[a-zA-Z]/.test(contact)) {
                Alert.alert('Invalid Contact', 'Contact number must not contain letters.');
                return;
              }
            
              if (!/^[a-zA-Z0-9]+$/.test(NRIC)) {
                Alert.alert('Invalid NRIC/Passport', 'Only letters and numbers allowed.');
                return;
              }
            
              if (/[a-zA-Z]/.test(bankNumber)) {
                Alert.alert('Invalid Bank Number', 'Bank number must contain digits only.');
                return;
              }

            
            {/* submit to firestore */}
            try{
                await updateDoc(doc(db, 'serviceProviders', uid),{
                    contact: values.contact,
                    address: values.address,
                    NRIC: values.NRIC,
                    bankName: values.bankName,
                    bankNumber: values.bankNumber,
                    qualificationsSkillsExperiences: values.qualificationsSkillsExperiences,
                    introduction: values.introduction,
                    
    
                });
                alert('Data saved successfully!');
                        // navigation.goBack();

                    }catch(error){
                        console.error("Error adding document: ", error);
                        alert("Failed to save data.");
                    
                    }
                }

    const [selectedBank, setSelectedBank] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [fontsLoaded] = useFonts({
        'Sora': require('../assets/font/Sora-VariableFont_wght.ttf'),
        'Inter': require('../assets/font/Inter-regular.ttf')
      });
      if(!fontsLoaded){
        return null;
      }
    return(
        <KeyboardAvoidingWrapper>
        <View style= {style.container}>
            <View style = {style.inner}>
                { /*Logo*/}
                <Image 
                source={require('../assets/HandyGo Logo.png')}
                style= {style.logo}
                resizeMode = 'cover'
            />

            {/* titles */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={style.title}>
                    Let us know more about you!
                </Text>
            </View>

            {/* input*/}

            <Formik
                initialValues={{contact:'', address:'', NRIC:'', bankName:'',
                    bankNumber:'', qualificationsSkillsExperiences:'', introduction:'',
                }}
                onSubmit={handleBusinessDetailsSubmit}
            >

                {({ handleChange, handleBlur, handleSubmit,setFieldValue, values }) => (
                    <>
                    {/*contact*/}
                        <View style = {style.inputGroup}>
                            <Text style = {style.inputLabel}>Contact</Text>
                                <TextInput
                                    style = {style.textInput}
                                    placeholder='Enter your contact here'
                                    placeholderTextColor={darkest_coco}
                                    onChangeText={handleChange('contact')}
                                    onBlur={handleBlur('contact')}
                                    value = {values.contact}
                                    keyboardType='number-pad'
                                />
                        </View>
                    
                    {/*Address*/}
                        <View style = {style.inputGroup}>
                            <Text style = {style.inputLabel}>Address</Text>
                                <TextInput
                                    style = {style.textInput}
                                    placeholder='Enter your address here'
                                    placeholderTextColor={darkest_coco}
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                    value = {values.address}
                                />
                        </View>
                    
                    {/*NRIC/ passport*/}
                        <View style = {style.inputGroup}>
                            <Text style = {style.inputLabel}>NRIC/Passport</Text>
                                <TextInput
                                    style = {style.textInput}
                                    placeholder='Enter your details here'
                                    placeholderTextColor={darkest_coco}
                                    onChangeText={handleChange('NRIC')}
                                    onBlur={handleBlur('NRIC')}
                                    value = {values.NRIC}
                                />
                        </View>
                    
                    
                    {/*bank name, syntax , condition ? ifTrue : ifFalse*/}
                        <View style = {style.inputGroup}>
                            <Text style = {style.inputLabel}>Bank Name</Text>
                            {showPicker ?(
                                <View style = {style.dropdown}>
                                <Picker
                                    selectedValue={values.bankName}
                                    onValueChange={(value) => {
                                        setFieldValue('bankName', value);
                                        setShowPicker(false); // close dropdown</View>
                                    }}
                                >
                                    <Picker.Item label="Select your bank" value="" />
                                    <Picker.Item label="Maybank" value="Maybank" />
                                    <Picker.Item label="CIMB" value="CIMB" />
                                    <Picker.Item label="DBS" value="DBS" />
                                    <Picker.Item label="OCBC" value="OCBC" />
                                    <Picker.Item label="UOB" value="UOB" />
                                    <Picker.Item label="POSB" value="POSB" />

                                </Picker>
                                </View>
                            ):(
                                <TouchableOpacity
                                    style={style.dropdown}
                                    onPress={() => setShowPicker(true)}
                                >
                                    <Text style ={{ fontFamily: 'Inter', fontSize:14}}>
                                        {values.bankName ?(
                                            values.bankName):("Select your bank name")}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            </View>
                    {/*bank number*/}
                    <View style = {style.inputGroup}>
                    <Text style = {style.inputLabel}>Bank Number </Text>
                        <TextInput
                            style = {style.textInput}
                            placeholder='Enter your details here'
                            placeholderTextColor={darkest_coco}
                            onChangeText={handleChange('bankNumber')}
                            onBlur={handleBlur('bankNumber')}
                            value = {values.bankNumber}
                            keyboardType='number-pad'
                        />
                    </View>

                    {/*qualifications*/}
                    <View style = {style.inputGroup}>
                        <Text style = {style.inputLabel}>Qualifications/ Experiences/ Skills </Text>
                        <TextInput
                            style = {style.textArea}
                            multiline={true}
                            placeholder='Enter your details here'
                            placeholderTextColor={darkest_coco}
                            onChangeText={handleChange('qualificationsSkillsExperiences')}
                            onBlur={handleBlur('qualificationsSkillsExperiences')}
                            value = {values.qualificationsSkillsExperiences}
                        />
                    </View>

                    {/*introduction*/}
                    <View style = {style.inputGroup}>
                        <Text style = {style.inputLabel}>Introduction </Text>
                        <TextInput
                            style = {style.textArea}
                            multiline = {true}
                            placeholder='Enter your details here'
                            placeholderTextColor={darkest_coco}
                            onChangeText={handleChange('introduction')}
                            onBlur={handleBlur('introduction')}
                            value = {values.introduction}
                        />
                    </View>

                    {/*savebutton*/}
                    <TouchableOpacity 
                        style = {style.saveButton}
                        onPress = {handleSubmit}
                     >
                        <Text style = {style.saveButtonText}>Save Change</Text>
                     </TouchableOpacity>
            </>
            )}
            </Formik>
            </View>
        </View>
        </KeyboardAvoidingWrapper>
    )
}
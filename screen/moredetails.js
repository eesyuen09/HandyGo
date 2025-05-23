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

//category import
import { services_catogories } from '../constants/categories';



//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Octicons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
// import { services_catogories } from '../constants/categories';
// route: contain parameters passed from the previous screen
export default function moredetails({ route, navigation}) {
    // const {uid} = route.params;
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
            const{ contact, address, NRIC, bankName, bankNumber, categories, introduction } = values;

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
                await updateDoc(doc(db, 'serviceProviders'),{ //await updateDoc(doc(db, 'serviceProviders', uid) in dev
                    contact: values.contact,
                    address: values.address,
                    NRIC: values.NRIC,
                    bankName: values.bankName,
                    bankNumber: values.bankNumber,
                    categories: values.categories,
                    introduction: values.introduction,
                    
    
                });
                alert('Data saved successfully!');
                        // navigation.goBack();

                    }catch(error){
                        console.error("Error adding document: ", error);
                        alert("Failed to save data.");
                    
                    }
                }

  
    const [step, setStep] = useState('title');
    const [showPickerIndex, setShowPickerIndex] = useState(null);


    const [categories, setCategories] = useState([{title:'',subtitle:[] }])
    const [selectedBank, setSelectedBank] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [fontsLoaded] = useFonts({
        'Sora': require('../assets/font/Sora-VariableFont_wght.ttf'),
        'Inter': require('../assets/font/Inter-regular.ttf')
      });
      if(!fontsLoaded){
        return null;
      }
    //function for categories
    function addEmptyCategory() {
        setCategories(prev => [...prev, {title:'', subtitle:[]}]);
    }

    function deleteEmptyCategory(){
        setCategories(prev => (prev.length >1 ? prev.slice(0,prev.length-1):prev));
    }
    function updateTitle(index, title, setFieldValue){
        setCategories(prev => {
            const updated = [...prev];
            updated[index].title = title;
            updated[index].subtitle = [];
            setFieldValue('categories',updated);
            return updated;
        });
        
    }



    function addSubtitle(index, subtitle,setFieldValue){
        setCategories(prev => {
            const updated = [...prev];
            const currentSubtitle = updated[index].subtitle;

            if(currentSubtitle.includes(subtitle)){
                //remove subtitle
                updated[index].subtitle = currentSubtitle.filter((item) => item!==subtitle)
            }else{
                updated[index].subtitle = [...currentSubtitle, subtitle];
            }
            setFieldValue('categories',updated);
            return updated;
        });
        
    }

    function renderCategoryBlock(cat, index, setFieldValue){
        const selectedCategory = services_catogories.find((c)=> c.title === cat.title);

        return (
            <View key = {index} style = {style.inputGroup}>
                <Text style = {style.inputLabel}>Service Category</Text>
                <TouchableOpacity  
                    style = {style.dropdown}
                    onPress = {() => setShowPickerIndex(index)}
                    >
                    <Text style = {{fontFamily: 'Inter', fontSize:14}}>
                        {cat.title || 'Select'}
                    </Text>
                    </TouchableOpacity>
                    {showPickerIndex === index && (
                    <Picker
                    selectedValue={cat.title}
                    onValueChange={(value) => {
                        updateTitle(index, value);
                        setShowPickerIndex(null); // hide picker after selection
                    }}
                    >
                    <Picker.Item label="Select..." value="" />
                    {services_catogories.map((cat) => (
                        <Picker.Item key={cat.title} label={cat.title} value={cat.title} />
                    ))}
                    </Picker>
                )}
                
            

                {/* subcategory*/}
                {selectedCategory && (
                    <>
                    
                    <Text style = {{marginTop : 10}}>Select subcategories</Text>
                    {selectedCategory.subcategories.map((subtitle) => (
                    <TouchableOpacity
                        key = {subtitle}
                        onPress ={() => addSubtitle(index,subtitle)}
                        style = {{
                            flexDirection :'row',
                            alignItems: 'Center',
                            marginVertical:6,
                        }}
                        >
                            <View
                                style ={{width: 20,
                                        height: 20,
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        marginRight: 10,
                                        backgroundColor: cat.subtitle.includes(subtitle)
                                            ? '#9A5A3C'
                                            : 'transparent',
                                }}
                            />
                            <Text>{subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                
                    </>
                )}
                </View>
            );
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
            initialValues={{
                contact: '',
                address: '',
                NRIC: '',
                bankName: '',
                bankNumber: '',
                categories:[{title:'', subtitle:[]}],
                introduction: '',
            }}
            onSubmit={handleBusinessDetailsSubmit}
            >
  {({ handleChange, handleBlur, handleSubmit, setFieldValue, values }) => (
    <>
      {/* Contact */}
      <View style={style.inputGroup}>
        <Text style={style.inputLabel}>Contact</Text>
        <TextInput
          style={style.textInput}
          placeholder="Enter your contact here"
          placeholderTextColor={darkest_coco}
          onChangeText={handleChange('contact')}
          onBlur={handleBlur('contact')}
          value={values.contact}
          keyboardType="number-pad"
        />
      </View>

      {/* Address */}
      <View style={style.inputGroup}>
        <Text style={style.inputLabel}>Address</Text>
        <TextInput
          style={style.textInput}
          placeholder="Enter your address here"
          placeholderTextColor={darkest_coco}
          onChangeText={handleChange('address')}
          onBlur={handleBlur('address')}
          value={values.address}
        />
      </View>

      {/* NRIC/Passport */}
      <View style={style.inputGroup}>
        <Text style={style.inputLabel}>NRIC/Passport</Text>
        <TextInput
          style={style.textInput}
          placeholder="Enter your details here"
          placeholderTextColor={darkest_coco}
          onChangeText={handleChange('NRIC')}
          onBlur={handleBlur('NRIC')}
          value={values.NRIC}
        />
      </View>

      {/* Bank Name */}
      <View style={style.inputGroup}>
        <Text style={style.inputLabel}>Bank Name</Text>
        {showPicker ? (
          <View style={style.dropdown}>
            <Picker
              selectedValue={values.bankName}
              onValueChange={(value) => {
                setFieldValue('bankName', value);
                setShowPicker(false);
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
        ) : (
          <TouchableOpacity
            style={style.dropdown}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ fontFamily: 'Inter', fontSize: 14 }}>
              {values.bankName ? values.bankName : 'Select your bank name'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bank Number */}
      <View style={style.inputGroup}>
        <Text style={style.inputLabel}>Bank Number</Text>
        <TextInput
          style={style.textInput}
          placeholder="Enter your details here"
          placeholderTextColor={darkest_coco}
          onChangeText={handleChange('bankNumber')}
          onBlur={handleBlur('bankNumber')}
          value={values.bankNumber}
          keyboardType="number-pad"
        />
      </View>

      {/* title*/}
      {categories.map((cat, index) => renderCategoryBlock(cat, index))}
      <TouchableOpacity 
        onPress={addEmptyCategory}
        style = {style.add_delete_c}>
        <Text style={style.add_delete_t}>
            + Add More Category
        </Text>
        </TouchableOpacity>
        <TouchableOpacity 
            onPress ={deleteEmptyCategory}
            style = {style.add_delete_c}>
            <Text style={style.add_delete_t}>
                - Delete Category
            </Text>
        </TouchableOpacity>
      

      {/* Introduction */}
      <View style={style.inputGroup}>
        <Text style={style.inputLabel}>Introduction</Text>
        <TextInput
          style={style.textArea}
          multiline={true}
          placeholder="Enter your details here"
          placeholderTextColor={darkest_coco}
          onChangeText={handleChange('introduction')}
          onBlur={handleBlur('introduction')}
          value={values.introduction}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={style.saveButton}
        onPress={handleSubmit}
      >
        <Text style={style.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </>
  )}
    </Formik>
            

    </View>
    </View>
    </KeyboardAvoidingWrapper>
    )
}

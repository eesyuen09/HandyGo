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

import { colours, style } from '../components/style_adddetails';

//fonts
import { useFonts } from 'expo-font';

//firebase storage
import { updateDoc, doc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseConfig';

//category import
import { categoryMap } from '../constants/categorymap';
import { services_catogories } from '../constants/category_constant';

import { auth } from '../firebaseConfig';

const uid = auth.currentUser?.uid;

//keyboardavoidingwrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Octicons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

// route: contain parameters passed from the previous screen
export default function moredetails() { //export default function moredetails({ route, navigation}) {


    const navigation = useNavigation();
    const {
      darkest_coco,
      main_coco,
      beige,
      grey,
      white,
      yellow_brown,
      black
    } = colours;

    useEffect(() => {
      const checkIfDetailsExist = async () => {
        const user = auth.currentUser;
        if (!user) return;
  
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
  
        if (snap.exists()) {
          const data = snap.data();
          const hasAllDetails =
            data.contact &&
            data.address &&
            data.NRIC &&
            data.bankName &&
            data.bankNumber &&
            Array.isArray(data.category) && data.category.length > 0 &&
            Array.isArray(data.subcategory) && data.subcategory.length > 0 &&
            data.introduction;
  
          if (hasAllDetails) {
            navigation.replace('Business Dashboard');
          }
        }
      };
  
      checkIfDetailsExist();
    }, []);

    const handleBusinessDetailsSubmit = async (values) =>{

            const user = auth.currentUser;
            if (!user) {
              Alert.alert('Error', 'User not logged in');
              return;
            }
            const uid = user.uid;
            const{ contact, address, NRIC, bankName, bankNumber, category, subcategory, introduction } = values;

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
              

              if (!category.length || !subcategory.length) {
                Alert.alert('Error', 'Please select at least one category and subcategory.');
                return;
              }

            
            {/* submit to firestore */}
            try{
                await updateDoc(doc(db, 'users',uid),{ //await updateDoc(doc(db, 'serviceProviders', uid) in dev
                    contact: values.contact,
                    address: values.address,
                    NRIC: values.NRIC,
                    bankName: values.bankName,
                    bankNumber: values.bankNumber,
                    category :values.category,
                    subcategory :values.subcategory,
                    introduction : values.introduction,
                    
    
                });

                alert('Data saved successfully!');
                values.category.forEach(async (category) => {
                  console.log(category);
                  console.log('UID', uid);
                  await updateDoc(doc(db, 'categoryToWorker', category), {
                    workers: arrayUnion(uid) //
                  });
                });

                values.subcategory.forEach(async (subcategory) => {
  
                  await updateDoc(doc(db,'subcategoryToWorker', subcategory),{
                    workers: arrayUnion(uid)
                  });
                });




                        // navigation.goBack();

                    }catch(error){
                        console.error("Error adding document: ", error);
                        alert("Failed to save data.");
                    
                    }
                }

  
    const [step, setStep] = useState('title');
    const [showPickerIndex, setShowPickerIndex] = useState(null);


    const [category, setCategory] = useState([])
    const [subcategory, setSubcategory] = useState([]);
    const [selectedBank, setSelectedBank] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [fontsLoaded] = useFonts({
        'Sora': require('../assets/fonts/Sora-VariableFont_wght.ttf'),
        'Inter': require('../assets/fonts/Inter-regular.ttf')
      });
      if(!fontsLoaded){
        return null;
      }
    //function for categories
    function addEmptyCategory() {
      setCategory(prev => [...prev,'']);
      setSubcategory(prev => [...prev,''])
      
    }

    function deleteEmptyCategory(){
      setCategory(prev => (prev.length >1 ? prev.slice(0,prev.length-1):prev));
      setSubcategory(prev => (prev.length >1 ? prev.slice(0,prev.length-1):prev));
    }
    function updateTitle(index, newTitle, setFieldValue) {
      setCategory(prev => {
        const updated = [...prev];
        if(updated.includes(newTitle) && updated[index]!==newTitle){
          Alert.alert("Category already selected.")
          return updated;
        }else{
        updated[index] = newTitle; // replace selected one
        setFieldValue('category', updated);
        return updated;
      }
    });
    }
    function addSubtitle(subtitle, setFieldValue) {
      setSubcategory(prev => {
        let updated;
    
        if (prev.includes(subtitle)) {
          // remove subtitle
          updated = prev.filter(item => item !== subtitle);
        } else {
          if(prev.length ===0){
            updated = [subtitle];}
          else{
          // add subtitle
            updated = [...prev, subtitle];
            };
        }
    
        setFieldValue('subcategory', updated);
        return updated;
      });
    }
// cat = titles
    function renderCategoryBlock(cat, index, setFieldValue, subcategory){
        const selectedCategory = services_catogories.find((c)=> c.title === cat);

        return (
            <View key = {cat} style = {style.inputGroup}>
                <Text style = {style.inputLabel}>Service Category</Text>
                <TouchableOpacity  
                    style = {style.dropdown}
                    onPress = {() => setShowPickerIndex(cat)}
                    >
                    <Text style = {{fontFamily: 'Inter', fontSize:14}}>
                        {cat || 'Select'}
                    </Text>
                    </TouchableOpacity>
                    {showPickerIndex === cat && (
                    <Picker
                    selectedValue={cat}
                    
                    onValueChange={(value) => {
                        updateTitle(index, value,setFieldValue);
                        setShowPickerIndex(null); // hide picker after selection
                    }}
                    >
                    <Picker.Item label="Select..." value="" />
                    {services_catogories.map((catObj) => (
                        <Picker.Item key={catObj.title} label={catObj.title} value={catObj.title} />
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
                        onPress ={() => addSubtitle(subtitle,setFieldValue)}
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
                                        backgroundColor: subcategory.includes(subtitle)
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
                category: [],
                subcategory: [],
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
      {category.map((cat, index ) => renderCategoryBlock(cat, index,  setFieldValue, values.subcategory))}
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

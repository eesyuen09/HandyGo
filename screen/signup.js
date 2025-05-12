import React, {use, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';

// formik
import { Formik } from 'formik';

//icons
import { Octicons, Ionicons, createIconSetFromIcoMoon} from '@expo/vector-icons';


import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    colours,
    StyledButton,
    ButtonText,
    MsgBox,
    Line,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent

} from '../components/style';

import { View, TouchableOpacity} from 'react-native';



//colours
const { primary_darkestblue, dark_grey, white } = colours;

//datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

// import { InnerContainer, PageLogo, PageTittle } from '../components/style';
const Signup = ({navigation}) =>{
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const[date, setDate] = useState(new Date(2000, 0, 1));
    const isDate = false;

    //actual date to be sent
    const [dob, setDob] = useState();

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate)
    };
    
    function showDatePicker(){
        setShow(true);
    };
    return (
        <StyledContainer>
            <StatusBar style = "dark"></StatusBar>
            <ScrollView contentContainerStyle={{ flexGrow: 1}}>
            <InnerContainer>
                <PageLogo resizeMode="cover" 
                source={require('../assets/logo_not.jpg')}></PageLogo>
                <PageTitle>HandyGo</PageTitle>
                <SubTitle>Account Sign Up</SubTitle>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode='date'
                    is24Hour={true}
                    onChange={onChange}
                    />
                )}


                <Formik
                    initialValues= {{fullName: '', email:'', dateOfBirth:'', password: '', confirmPassword: ''}}
                    onSubmit={(values) =>{
                        console.log(values);
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values }) => 
                    <StyledFormArea>
                        <MyTextInput 
                            label="Full Name"
                            icon = "person"
                            placeholder="John"
                            placeholderTextColor={white}
                            onChangeText={handleChange('fullName')}
                            onBlur={handleBlur('fullName')}
                            value= {values.fullName}
                            editable = {!isDate}
                
                        />

                        <MyTextInput 
                            label="Email Address"
                            icon = "mail"
                            placeholder="john123@gmail.com"
                            placeholderTextColor={white}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value= {values.email}
                            keyboardType='email-address'
                            editable = {!isDate}
                        />

                        <MyTextInput 
                            label="Date of Birth"
                            icon = "calendar"
                            placeholder="   YYYY - MM - DD"
                            placeholderTextColor={white}
                            onChangeText={handleChange('dateOfBirth')}
                            onBlur={handleBlur('dateOfBirth')}
                            value= {dob ? dob.toDateString() : ''}
                            isDate = {true}
                            editable = {!isDate}
                            showDatePicker = {showDatePicker}
             
        
                        />      
                        <MyTextInput
                            label="Password"
                            icon = "lock"
                            placeholder="* * * * *"
                            placeholderTextColor={white}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value= {values.password}
                            secureTextEntry = {hidePassword}
                            isPassword={true}
                            hidePassword={hidePassword}
                            setHidePassword={setHidePassword}
                            editable = {!isDate}

                        />

                        <MyTextInput
                            label="Confirm Password"
                            icon = "lock"
                            placeholder="* * * * *"
                            placeholderTextColor={white}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value= {values.confirmPassword}
                            secureTextEntry = {hidePassword}
                            isPassword={true}
                            hidePassword={hidePassword}
                            setHidePassword={setHidePassword}
                            editable = {!isDate}

                        />          
                        <MsgBox>...</MsgBox>
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>
                                Sign Up
                            </ButtonText>
                        </StyledButton>
                        <Line />
                    
                        <ExtraView>
                            <ExtraText>Already have an account?</ExtraText>
                            <TextLink onPress ={() => navigation.navigate('Login')}>
                                <TextLinkContent>Login</TextLinkContent>
                            </TextLink>
                        </ExtraView>
                        </StyledFormArea>}

                </Formik>

            </InnerContainer>
            </ScrollView>
        </StyledContainer>
    );
}


const MyTextInput = ({
    label,
    icon,
    isPassword,
    hidePassword,
    setHidePassword,
    isDate = false,
    showDatePicker,
    ...props
  }) => {
    const inputField = (
      <StyledTextInput
        {...props}
        editable={props.editable}// disable keyboard if it's a date field
        // pointerEvents={isDate ? "none" : "auto"} // prevent input from intercepting touch if date
      />
    );
  
    return (
      <View>
        <LeftIcon>
          {icon === 'calendar' ? (
            <TouchableOpacity onPress={showDatePicker}>
              <Octicons name="calendar" size={30} color={white} />
            </TouchableOpacity>
          ) : (
            <Octicons name={icon} size={30} color={white} />
          )}
        </LeftIcon>
  
        <StyledInputLabel>{label}</StyledInputLabel>
  
        {isDate ? (
          <TouchableOpacity onPress={showDatePicker} activeOpacity={1}>
            {inputField}
          </TouchableOpacity>
        ) : (
          inputField
        )}
  
        {isPassword && (
          <RightIcon onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? 'eye-off' : 'eye'}
              size={20}
              color={white}
            />
          </RightIcon>
        )}

        </View> 
    );
  };
export default Signup;

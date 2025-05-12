import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

//icons
import { Octicons, Ionicons} from '@expo/vector-icons';

//navigation
import { useNavigation } from '@react-navigation/native';

//google icon
import { FontAwesome } from '@expo/vector-icons';
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




const { primary_darkestblue, dark_grey, white } = colours;

// import { InnerContainer, PageLogo, PageTittle } from '../components/style';
const Login = ({navigation}) =>{
    const [hidePassword, setHidePassword] = useState(true);
    return (
        <StyledContainer>
            <StatusBar style = "dark"></StatusBar>
            <InnerContainer>
                <PageLogo resizeMode="cover" 
                source={require('../assets/logo_not.jpg')}></PageLogo>
                <PageTitle>HandyGo</PageTitle>
                <SubTitle>Account Login</SubTitle>

                <Formik
                    initialValues= {{email: '', password: ''}}
                    onSubmit={(values) =>{
                        console.log(values);
                        navigation.navigate('Welcome');
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values }) => 
                    <StyledFormArea>
                        <MyTextInput 
                            label="Email Address"
                            icon = "mail"
                            placeholder="john123@gmail.com"
                            placeholderTextColor={white}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value= {values.email}
                            keyboardType='email-address'
        
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

                        />
                        <MsgBox>...</MsgBox>
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>Login</ButtonText>
                        </StyledButton>
                        <Line />
                        <StyledButton onPress={handleSubmit}>
                    
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome name="google" size={20} color={white} style={{ marginRight: 10 }} />
                            <ButtonText>Sign In with Google</ButtonText>
                        </View>
                        </StyledButton>
                        <ExtraView>
                            <ExtraText>Don't have an account already?</ExtraText>
                            <TextLink onPress ={() => navigation.navigate('Signup')}>
                                <TextLinkContent>Sign Up</TextLinkContent>
                            </TextLink> 
                        </ExtraView>
                        </StyledFormArea>}

                </Formik>

            </InnerContainer>
        </StyledContainer>
    );
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) =>{
    return (
        <View>
        <LeftIcon>
            <Octicons name={icon} size={30} color={white} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput{...props} />
        {isPassword && (
            <RightIcon onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons name={hidePassword ? 'eye-off':'eye'} size={20} color={white} />
          </RightIcon>
            )}
        </View>
    );
};

export default Login;

import styled from "styled-components/native";
import { View, Text, Image ,TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;

// colours
export const colours = {
    primary_darkestblue: "#27548A",
    secondary_darkblue: "#27548A",
    tertiary_coco: "#DDA853",
    beige: "#F5EEDC",
    dark_grey: "#393E46",
    white: '#FFFDF6'

}
const { primary_darkestblue, secondary_darkblue, tertiary_coco, beige, dark_grey, white } = colours;

export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
        padding-top: ${StatusBarHeight + 30}px;
    background-color: ${beige};
`;
    


export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const PageLogo = styled.Image`
    width: 250px;
    height: 200px;
    `;

export const PageTitle = styled.Text`
    font-size: 30px;            
    color: ${primary_darkestblue};    
    background-color: ${beige};  
    height: 200px; 
    font-weight: bold;
    font-family: 'Poppin';             
    `;

export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    font-family: 'Poppin';
    color: ${primary_darkestblue};`


export const StyledFormArea = styled.View`
    width: 90%;
    align-items: center;
    `;
import { TextInput } from 'react-native';

export const StyledTextInput = styled(TextInput)`
    background-color: ${secondary_darkblue};
    width: 500px;
    align-self: center;
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 20px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 12px;
    color: ${white};
    
    `;

export const StyledInputLabel = styled.Text`
    color: ${secondary_darkblue};
    font-size: 13px;
    text-align: left;
    font-family: 'Times New Roman';
    `;

export const LeftIcon = styled.View`
    left: 15px;
    top: 33px;
    position: absolute;
    z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
    right: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    width: 200px;
    align-self: center;
    padding: 10px;
    background-color: ${tertiary_coco};
    justify-content: center;
    border-radius: 20px;
    margin-vertical: 5px;
    height: 60px;
`;

export const ButtonText = styled.Text`
    color: ${white};
    font-size: 16px;
    align-self: center;
    font-family: 'Times New Roman';
    font-weight: bold;

`;

export const MsgBox = styled.Text`
    text-align: center;
    font-size: 13px
`;

export const Line = styled.View`
    height: 1px;
    width: 800px;
    align-self: center;
    background-color: ${primary_darkestblue}
    margin-vertical: 10px
`;

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const ExtraText = styled.Text`
    justify-content: center;
    align-content: center;
    color: ${secondary_darkblue}
    font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center
`;

export const TextLinkContent = styled.Text`
    color: ${secondary_darkblue};
    text-decoration-line: underline;
    font-size: 15px;

    `

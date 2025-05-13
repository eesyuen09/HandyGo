// import { View, Text, Image ,TouchableOpacity, StyleSheet} from 'react-native';
// import Constants from 'expo-constants';

// const StatusBarHeight = Constants.statusBarHeight;

// // colours
// export const colours = {
//     primary_darkestblue: "#27548A",
//     secondary_darkblue: "#27548A",
//     tertiary_coco: "#DDA853",
//     beige: "#F5EEDC",
//     dark_grey: "#393E46",
//     white: '#FFFDF6'

// }
// const { primary_darkestblue, secondary_darkblue, tertiary_coco, beige, dark_grey, white } = colours;

// export const globalStyles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 25,
//         paddingTop: Constants.statusBarHeight +30,
//         backgroundColor: colours.beige,
//     },
//     inner: {
//         flex: 1,
//         width: '100%',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 30,
//         color: colours.primary_darkestblue,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     subtitle: {
//         fontSize: 18,
//         color: colours.primary_darkestblue,
//         marginBottom: 20,
//         fontWeight: 'bold',
//     },
//     logo: {
//         width: 250,
//         height: 200,
//         marginBottom: 10,
//     },
//     button: {
//         width: 200,
//         backgroundColor: colours.tertiary_coco,
//         borderRadius: 20,
//         paddingVertical: 15,
//         alignItems: 'center',
//         marginVertical: 5,
//       },
//       buttonText: {
//         color: colours.white,
//         fontSize: 16,
//         fontWeight: 'bold',
//       },
      
//       line: {
//         height: 1,
//         width: '80%',
//         backgroundColor: colours.primary_darkestblue,
//         marginVertical: 10,
//       },
//       extraView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//       },
//       extraText: {
//         color: colours.secondary_darkblue,
//         fontSize: 15,
//         marginRight: 5,
//       },
//       linkText: {
//         color: colours.secondary_darkblue,
//         textDecorationLine: 'underline',
//         fontSize: 15,
//       },
//       inputWrapper: {
//         width: '90%',
//         marginBottom: 25,
//         position: 'relative',
//       },
      
//       inputLabel: {
//         color: colours.secondary_darkblue,
//         fontSize: 13,
//         marginBottom: 5,
//         textAlign: 'left',
//       },
      
//       // ⬇️ New: container-style left icon
//       leftIcon: {
//         position: 'absolute',
//         left: 15,
//         top: 0,
//         height: 60,                // same as input
//         width: 30,
//         justifyContent: 'center', // vertically center
//         alignItems: 'center',     // horizontally center
//         zIndex: 1,
//       },
      
//       // ⬇️ New: container-style right icon (e.g. eye)
//       rightIcon: {
//         position: 'absolute',
//         right: 15,
//         top: 0,
//         height: 60,
//         width: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 1,
//       },
      
//       input: {
//         backgroundColor: colours.secondary_darkblue,
//         width: '100%',
//         paddingLeft: 50,
//         paddingRight: 50,
//         borderRadius: 20,
//         fontSize: 16,
//         height: 60,
//         color: colours.white,
//       },
//     googleButtonContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     });

import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// Colours
export const colours = {
  primary_darkestblue: "#27548A",
  secondary_darkblue: "#27548A",
  tertiary_coco: "#DDA853",
  beige: "#F5EEDC",
  dark_grey: "#393E46",
  white: '#FFFDF6',
};

const {
  primary_darkestblue,
  secondary_darkblue,
  tertiary_coco,
  beige,
  dark_grey,
  white
} = colours;

// Global Styles
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: Constants.statusBarHeight + 30,
    backgroundColor: beige,
  },

  inner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    color: primary_darkestblue,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: primary_darkestblue,
    marginBottom: 20,
    fontWeight: 'bold',
  },

  logo: {
    width: 250,
    height: 200,
    marginBottom: 10,
  },

  button: {
    width: 200,
    backgroundColor: tertiary_coco,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 5,
  },

  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  line: {
    height: 1,
    width: '80%',
    backgroundColor: primary_darkestblue,
    marginVertical: 10,
  },

  extraView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  extraText: {
    color: secondary_darkblue,
    fontSize: 15,
    marginRight: 5,
  },

  linkText: {
    color: secondary_darkblue,
    textDecorationLine: 'underline',
    fontSize: 15,
  },

  inputWrapper: {
    width: '90%',
    marginBottom: 25,
  },
  
  inputLabel: {
    color: colours.secondary_darkblue,
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'left',
  },
  
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.secondary_darkblue,
    borderRadius: 20,
    height: 60,
    paddingHorizontal: 15,
  },
  
  inputIcon: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colours.white,
    marginLeft: 10,
  },

  // Google Sign In Button Content
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

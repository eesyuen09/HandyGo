import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const colours ={
    darkest_coco: "#704F38",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "#E3E3E3",
  white: '#FFFFFF',
  yellow_brown: '#DDA853',
  black: "#000000",
};

const {
  darkest_coco,
  main_coco,
  beige,
  grey,
  white,
  yellow_brown,
  black
} = colours;


export const style = StyleSheet.create({
    background:{
        flex:1,
        resizeMode: 'cover',
        width : '100%',
        height:'100%',
        
      },
    
      container: {
        flex: 1,
        padding: 25,
        paddingTop: Constants.statusBarHeight + 30,
   
      },
    
      header: {//include title, backbutton, icon..
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 10,
        justifyContent: 'center',
      },

   
    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: darkest_coco,
        justifyContent: 'center',
        textAlign: 'center',

    },

    searchContainer: {
        flexDirection: 'row',
        backgroundColor: white,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 20,
        marginBottom: 15,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
        boarderColor: darkest_coco,
        borderWidth:1,

      },

      searchInput: {
        flex:1,
        paddingHorizontal: 10,
        color: darkest_coco,
      },

      card: {
        flexDirection : 'row',
        alignItems: 'center',
        backgroundColor: white,
        marginHorizontal: 20,
        marginVertical: 8,
        borderRadius: 20,
        padding: 15,
        borderColor: main_coco,
        borderWidth: 1,
      },

      taskInfo: { //group all rows of info
        flex: 1,
        marginLeft: 15,
        fontFamily: 'Sora',
        fontSize: 11,
        justifyContent: 'center',
    
      },
      taskIconWrap: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,

      },

      taskIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
      },

      cardTitle: {
        fontWeight: 'bold',
        fontFamily: 'Sora',
        fontSize: 14,
        color: darkest_coco,
      },

      taskDetails: {//one row info
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
      },

      taskDetailsText:{
        marginLeft: 6,
        fontSize: 13,
        color: colours.darkest_coco,
        fontFamily: 'Inter',
      },

      viewText: {
        color: main_coco,
        fontWeight: '600',
      },

      paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        alignSelf: 'center',
      
      },
})

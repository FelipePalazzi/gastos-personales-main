import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;

const styleForm = StyleSheet.create({
    dateText: {
      fontSize: theme.fontSizes.ingresar,
      marginRight:80
    },
    buttonContainer: {
      marginLeft: -60,
    },
    button: {
      padding: 16,
      alignItems: 'center',
    },
    text:{
      padding: 10,
      fontSize: theme.fontSizes.ingresar,
      color: theme.colors.white,
      backgroundColor: theme.colors.primary,
      marginVertical: 2,
      borderRadius:6,
      overflow: 'hidden',
      marginRight: 8,
      marginLeft: 15
    },
    rowContainer: {
      fontSize: theme.fontSizes.ingresar,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      marginStart:15,
      width:'100%',
    },
    rowButton: {
      flexDirection: 'row',
      alignItems:'center',
      justifyContent:'space-between',
      width:'100%',
      marginBottom: 16,
    },
     title: {
      textAlign: 'center',
    },

    container: {
      padding:10,
      paddingHorizontal:10,
      marginEnd:20,
  },
  dialogActions:{
    marginTop:20,
    justifyContent:'center',
   justifyContent:'space-between'
  }
  })
  export default styleForm
import { StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';

const styleDialog = StyleSheet.create({
    dateText: {
        fontSize: theme.fontSizes.ingresar,
        marginRight: 80,
        color:theme.colors.primary
    },
    title: {
        textAlign: 'center',
        color:theme.colors.primary
      },
      dialogActions:{
        marginTop:20,
        justifyContent:'center',
       justifyContent:'space-between'
      }
})
export default styleDialog
import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;

const styleLista = StyleSheet.create({
    container: {
      marginBottom:7,
      marginHorizontal:10,
      borderRadius:5,
      overflow:'hidden',
      width:screenWidth-20, 
  },
    row: {
      paddingHorizontal:1,
      borderBottomWidth: 1,
      backgroundColor: theme.colors.table
  },
  textTitleTable:{
    color:theme.colors.textPrimary ,
    fontWeight:theme.fontWeights.bold
  },
  textRowTable:{
    color:theme.colors.textPrimary,
  },
  card: {
    elevation:2,
    backgroundColor: theme.colors.card
  },
    description: {
      fontWeight: theme.fontWeights.bold,
  },
    descriptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
  },
    headerRow: {
      paddingStart:40,
      borderBottomWidth: 1,
      backgroundColor: theme.colors.primary,
  },

  });
  export default styleLista
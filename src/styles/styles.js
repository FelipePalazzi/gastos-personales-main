import { StyleSheet, Dimensions } from 'react-native';
import theme from './theme';

const screenWidth = Dimensions.get('window').width;

const styleLista = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
    loadingText: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.primary,
  },
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
    scroll: { 
      flex:1
  },
    button: {
      marginTop:20,
      marginBottom:20,
      alignItems: 'center',
  },
    search:{
      margin:20,
      backgroundColor: theme.colors.search,
  }
  });

  export default styleLista;
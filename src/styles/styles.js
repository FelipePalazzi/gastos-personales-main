import { StyleSheet, Dimensions } from 'react-native';
import theme from './theme';

const screenWidth = Dimensions.get('window').width;

const styleLista = StyleSheet.create({
    loadingContainer: {
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
  const styleResumen = StyleSheet.create({
    datapoint: {
      width: 8,
      height: 8,
      marginBottom:5,
      backgroundColor: theme.colors.white,
      borderWidth: 1.5,
      borderRadius: 10,
      borderColor: theme.colors.primary,
    },
    container:{
      flex:1,
      paddingTop:10,
      paddingBottom:10,
      paddingHorizontal: 5,
      margin: 10,
      backgroundColor: theme.colors.table,
      borderRadius: 7,
    },
    title: {
      textAlign: 'center',
      fontWeight:theme.fontWeights.bold,
      fontSize:theme.fontSizes.body,
      color: theme.colors.edit,
      marginTop:15,
    },
    titleContainer:{
      marginHorizontal:10,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    Containerbutton: {
      flexDirection: 'row',
      marginLeft: screenWidth / 10,
      marginBottom:10,
    },
    button:{
      paddingHorizontal: 10,
      marginTop:10,
      borderRadius: 8,
    },
    ejeYstyle:{
      color: theme.colors.textPrimary,
    },
    pointer:{
      position:'absolute',
      justifyContent:'center',
      top: 20,
      height: 90,
      width: 100,
      marginTop: -30,
      marginLeft: -40,
      
    },
    fechaPointer:{
      color: theme.colors.white,
      fontSize: theme.fontSizes.pointer,
      marginBottom: 6,
      textAlign: 'center',
    },
    containerPointer:{
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
    },
    fechaContainerPointer:{
      paddingHorizontal: 5,
      paddingVertical: 6,
      width: 80,
      marginHorizontal:10,
      borderTopRightRadius: 16,
      borderTopLeftRadius:16,
      backgroundColor: theme.colors.textPrimary,
    },
    titlePointer:{
      color: theme.colors.textPrimary,
      fontSize: theme.fontSizes.pointer,
      fontWeight: theme.fontWeights.bold,
    },
    textPointer:{
      fontWeight: theme.fontWeights.bold,
      textAlign: 'center',
    },
    rightCardTitle:{
      marginEnd:15,
    }

  })
  export {styleLista, styleResumen, screenWidth};
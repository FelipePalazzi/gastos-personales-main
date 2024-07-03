import { StyleSheet, Dimensions } from 'react-native';
import theme from './theme.js';

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
      color: theme.colors.white,
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

  const styleForm = StyleSheet.create({
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
      marginEnd:20,
      width:screenWidth*0.97,
    },
    picker: {
      flex: 1,
      fontSize: theme.fontSizes.ingresar,
      height: 40,
      marginEnd:16,
      width: screenWidth * 0.6,
      borderColor: theme.colors.gray,
      borderWidth: 1,
      backgroundColor: theme.colors.picker
    },
    rowButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
     title: {
      textAlign: 'center',
    },
    text_input:{
      flex: 1,
      marginRight: 16, 
      height: 40,
      padding: 10,
      paddingVertical: 8,
      fontSize:13,
    }, 
    container: {
      padding:10,
      paddingHorizontal:10,
      marginEnd:20,
  },
  backgroundContainer:{
    backgroundColor: theme.colors.table,
  },
  scroll:{
    flex:1,
  },
  dialogActions:{
    marginTop:20,
    justifyContent:'center',
   justifyContent:'space-between'
  }
  })

  export {styleLista, styleResumen, screenWidth, styleForm};
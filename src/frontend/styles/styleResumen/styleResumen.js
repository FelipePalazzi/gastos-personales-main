import { StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';

const styleResumen = StyleSheet.create({
    viewContainer:{
      marginBottom:15
    },
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
      backgroundColor: theme.colors.pieBackground,
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
      marginBottom:10,
      flex:1,
      paddingHorizontal: 5,
    },
    button:{
      paddingHorizontal: 10,
      marginTop:10,
      borderRadius: 8,
    },
    ejeYstyle:{
      color: theme.colors.white,
      fontSize:13,
    },
    pointer:{
      position:'absolute',
      justifyContent:'center',
      top: 20,
      height: 90,
      width: 120,
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
      backgroundColor: theme.colors.primary,
    },
    fechaContainerPointer:{
      paddingHorizontal: 5,
      paddingVertical: 6,
      width: 80,
      marginHorizontal:10,
      borderTopRightRadius: 16,
      borderTopLeftRadius:16,
      backgroundColor: theme.colors.primary,
    },
    titlePointer:{
      color: theme.colors.primary,
      fontSize: theme.fontSizes.pointer,
      fontWeight: theme.fontWeights.bold,
    },
    textPointer:{
      fontWeight: theme.fontWeights.bold,
      textAlign: 'center',
    },
    rightCardTitle:{
      marginEnd:15,
    },
    monedaButton:{
      alignContent: 'center',
      marginBottom:10,
    },
    tooltipBarChart:{
      marginBottom: 1,
      marginLeft: -6,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 4,
    },
     renderDot:{
      height: 10,
      width: 10,
      borderRadius: 5,
      marginRight: 10,
    },
    renderSquare:{
      height: 10,
      width: 10,
      marginRight: 10,
    },
    containerLegend:{
      flexDirection: 'row',
      flexWrap: 'wrap' 
    },
    containerLegendText:{
      flexDirection: 'row',
      alignItems: 'center',
      width: 120,
      marginRight: 20,
      marginVertical:10,
    },
    textLegend:{
      color: theme.colors.white,
    },
    containerResponsableSection:{
      backgroundColor: theme.colors.pieBackground,
      flex: 1,
      marginTop:10,
    },
    viewContainerResponsableSection:{
      marginHorizontal: 20,
      marginVertical:10,
      paddingHorizontal: 10,
      paddingVertical:5,
      borderRadius: 20,
      backgroundColor: theme.colors.pieInner,
      alignItems:'center'
    },
    viewPieChart:{
      padding: 20,
    },
    viewCentrado:{ 
      justifyContent: 'center',
      alignItems: 'center' ,
    },
    pieCenter:{
      fontSize: theme.fontSizes.body,
      color: theme.colors.white,
      fontWeight: theme.fontWeights.bold,
    },
    pieCenterDescription:{
      fontSize: theme.fontSizes.pointer,
      color: theme.colors.white,
    },
    labels:{
      fontSize: theme.fontSizes.pointer,
      color: theme.colors.white,
      fontWeight: theme.fontWeights.bold, 
    }, labelStyleBalance:{
      fontSize: 14,
      marginTop: -250,
      marginStart:-15,
      width:40,
      height:50,
      color: theme.colors.white,
    },
    containerBalance:{
      backgroundColor:theme.colors.pieInner,
      marginTop:10,
      paddingBottom:10,
      borderRadius:4,
      overflow:'hidden'
    },


  })
  export default styleResumen
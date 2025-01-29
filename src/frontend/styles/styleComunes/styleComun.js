import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styleComun = StyleSheet.create({
    container: {
        padding:10,
        paddingHorizontal:10,
        marginEnd:20,
    },
    rowContainer: {
        fontSize: theme.fontSizes.ingresar,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginEnd:20,
        width:screenWidth*0.897,
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
        marginLeft: 15,
      },
      title:{
        padding: 10,
        fontSize: theme.fontSizes.body,
        fontWeight:theme.fontWeights.bold,
        color: theme.colors.white,
        marginVertical: 2,
        textAlign:'center',
      },
      subtitle:{
        padding: 5,
        fontSize: theme.fontSizes.ingresar,
        fontWeight:theme.fontWeights.bold,
        color: theme.colors.white,
        textAlign:'center',
      },
      scroll:{
        flex:1,
        backgroundColor:theme.colors.background
      },
      text_input:{
        flex: 1,
        marginRight: 16, 
        height: 40,
        padding: 10,
        paddingVertical: 8,
        fontSize:13,
      }, 
      text_input_wide:{
      flex: 1,
      marginRight: 16,
      paddingVertical: 0,
      height: 70,
      fontSize: 13,
    },
    button: {
        marginTop:20,
        marginBottom:20,
        alignItems: 'center',
    },
    fab: {
      position: 'absolute',
      margin: 6,
      right: 0,
      bottom: screenHeight/2+185,
      
    },
    agregar:{
      container:{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom:10,
      }
    },
    keys:{
      container:{
          paddingHorizontal:10,
          marginEnd:20,
          width:screenWidth-50,
      },
      button:{
          alignItems: 'center',
          justifyContent:'center',
          flexDirection:'row',
          width:'100%',
          paddingVertical:10,
      },
      buttonText:{
        color:theme.colors.white,
        fontSize:theme.fontSizes.normal
      }
    }
})

export default styleComun
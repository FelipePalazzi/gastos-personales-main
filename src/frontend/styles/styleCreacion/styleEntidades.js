import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;

const styleEntidades = StyleSheet.create({
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
    width:screenWidth*0.97,
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
  scroll:{
    flex:1,
    backgroundColor:theme.colors.background
  },
  search:{
    margin:20,
    backgroundColor: theme.colors.search,
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
})

export default styleEntidades
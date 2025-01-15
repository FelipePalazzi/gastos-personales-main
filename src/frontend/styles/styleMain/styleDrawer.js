import { StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const styleDrawer = StyleSheet.create({
  drawerStyle: {
    backgroundColor: theme.colors.primary
},
container: {
    flex:1,
    backgroundColor: theme.colors.primary,
    borderBottomWidth:0.8,
    borderBottomColor:theme.colors.white
},
list:{
    marginBottom: 0,
    backgroundColor: theme.colors.primary,
    paddingVertical: 20,
    marginTop: 0,
    paddingBottom: 25,
    alignContent: 'center',
    justifyContent: 'center'
  },
  picker: {
    flex: 1,
    alignContent:'center',
    fontSize: theme.fontSizes.ingresar,
    height: 40,
    marginHorizontal:10,
    backgroundColor: theme.colors.card
  },
})
export default styleDrawer
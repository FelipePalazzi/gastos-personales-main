import { StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const styleDrawer = StyleSheet.create({
  drawerStyle: {
    backgroundColor: theme.colors.pieBackground
},
container: {
    flex:1,
    backgroundColor: theme.colors.pieInner,
    paddingVertical:4,
},
list:{
    marginBottom: 0,
    backgroundColor: theme.colors.pieBackground,
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
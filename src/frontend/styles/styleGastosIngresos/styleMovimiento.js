import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;

const styleMovimiento = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
    width: screenWidth*1.1,
    backgroundColor:theme.colors.white
  },
  row: {
    paddingHorizontal: 1,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.white
  },
  textTitleTable: {
    fontSize: theme.fontSizes.header,
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    marginLeft:28
  },
  textRowTable: {
    color: theme.colors.primary,
  },
  card: {
    elevation: 2,
    backgroundColor: theme.colors.table.card,
    borderRadius: 3,
  },
  SinDatos: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
  },
  description: {
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,

  },
  descriptionItem: {
    color: theme.colors.primary,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerRow: {
    paddingStart: 0,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.primary,
  },
  expandedrow: {
    backgroundColor: theme.colors.table.expanded,
  },
  pagination: {
    backgroundColor: theme.colors.white,
    paddingEnd: 30,
  },
  SinDatoscontainer:{
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width:screenWidth
  },
  colorLoading: theme.colors.primary,
  colorBackground: theme.colors.white
});
export default styleMovimiento
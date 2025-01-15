import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;

const styleMovimiento = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
    width: screenWidth,
    backgroundColor:theme.colors.white
  },
  row: {
    paddingHorizontal: 1,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.white
  },
  textTitleTable: {
    fontSize: theme.fontSizes.header,
    color: theme.colors.table.textHeader,
    fontWeight: theme.fontWeights.bold,
  },
  textRowTable: {
    color: theme.colors.table.textPrimary,
  },
  card: {
    elevation: 2,
    backgroundColor: theme.colors.table.card,
    borderRadius: 3,
  },
  SinDatos: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.table.textPrimary,
  },
  description: {
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.table.textPrimary,

  },
  descriptionItem: {
    color: theme.colors.table.textPrimary,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerRow: {
    paddingStart: 20,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.table.header,
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
  },
  colorLoading: theme.colors.table.textPrimary,
  colorBackground: theme.colors.white
});
export default styleMovimiento
import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;

const styleIngreso = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
    width: screenWidth,
  },
  row: {
    paddingHorizontal: 1,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.tableIngreso.table
  },
  textTitleTable: {
    fontSize: theme.fontSizes.header,
    color: theme.colors.tableIngreso.textHeader,
    fontWeight: theme.fontWeights.bold,
  },
  textRowTable: {
    color: theme.colors.tableIngreso.textPrimary,
  },
  card: {
    elevation: 2,
    backgroundColor: theme.colors.tableIngreso.card,
    borderRadius: 3,
  },
  SinDatos: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.tableIngreso.textPrimary,
  },
  description: {
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.tableIngreso.textPrimary,

  },
  descriptionItem: {
    color: theme.colors.tableIngreso.textPrimary,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerRow: {
    paddingStart: 20,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.tableIngreso.header,
  },
  expandedrow: {
    backgroundColor: theme.colors.tableIngreso.expanded,
  },
  pagination: {
    backgroundColor: theme.colors.tableIngreso.tableSecondary,
    paddingBottom: 60,
    paddingEnd: 50,
  },
  colorLoading: theme.colors.tableIngreso.textPrimary,
  colorBackground: theme.colors.tableIngreso.tableSecondary
});
export default styleIngreso
import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;

const styleGasto = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
    width: screenWidth,
  },
  row: {
    paddingHorizontal: 1,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.tableGasto.table
  },
  textTitleTable: {
    fontSize: theme.fontSizes.header,
    color: theme.colors.tableGasto.textHeader,
    fontWeight: theme.fontWeights.bold,
  },
  textRowTable: {
    color: theme.colors.tableGasto.textPrimary,
  },
  card: {
    elevation: 2,
    backgroundColor: theme.colors.tableGasto.card,
    borderRadius: 3,
  },
  SinDatos: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.tableGasto.textPrimary,
  },
  description: {
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.tableGasto.textPrimary,

  },
  descriptionItem: {
    color: theme.colors.tableGasto.textPrimary,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerRow: {
    paddingStart: 20,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.tableGasto.header,
  },
  expandedrow: {
    backgroundColor: theme.colors.tableGasto.expanded,
  },
  pagination: {
    backgroundColor: theme.colors.tableGasto.tableSecondary,
    paddingBottom: 60,
    paddingEnd: 50,
  },
  colorLoading: theme.colors.tableGasto.textPrimary,
  colorBackground: theme.colors.tableGasto.tableSecondary
});
export default styleGasto
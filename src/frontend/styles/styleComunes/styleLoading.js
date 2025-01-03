import { StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';

const styleLoading = StyleSheet.create({
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
})
export default styleLoading
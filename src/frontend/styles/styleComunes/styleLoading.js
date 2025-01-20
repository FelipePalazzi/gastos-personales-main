import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styleLoading = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: screenWidth,
    height: screenHeight - 150,
  },
  loadingData: {
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
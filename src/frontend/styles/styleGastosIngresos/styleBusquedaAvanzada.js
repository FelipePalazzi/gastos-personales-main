import { Dimensions, StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styleBusquedaAvanzada = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginHorizontal: 23,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 47, 92, 0.47)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: screenWidth *0.95,
    marginVertical:10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  closeButton: {
    backgroundColor: theme.colors.transparente,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color:theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
export default styleBusquedaAvanzada
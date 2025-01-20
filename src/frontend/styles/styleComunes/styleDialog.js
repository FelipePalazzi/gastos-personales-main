import { StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';

const styleDialog = StyleSheet.create({
  dateText: {
    fontSize: theme.fontSizes.ingresar,
    marginRight: 80,
    color: theme.colors.primary
  },
  title: {
    textAlign: 'center',
    color: theme.colors.primary
  },
  text: {
    fontSize: theme.fontSizes.ingresar,
    backgroundColor: theme.colors.white,
    marginVertical: 2,
    borderRadius: 6,
  },
  dialogActions: {
    marginTop: 20,
    justifyContent: 'space-between'
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    marginTop: 10,
},
overlayButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
},
noDataText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
},
container: {
    width: '100%',
},
searchbarContainer: {
    position: 'relative',
    width: '100%',
},
label: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 15,
    fontSize: 12,
    color: theme.colors.white,
    paddingHorizontal: 5,
},
labelRight: {
    position: 'absolute',
    zIndex: 2,
    top: 6,
    right: 6,
    fontSize: 12,
    color: theme.colors.white,
    paddingHorizontal: 5,
},
searchbar: {
    backgroundColor: theme.colors.white,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary,
},
modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 47, 92, 0.47)',
    justifyContent: 'center',
    alignItems: 'center',
},
modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
},
modalSearchbar: {
    marginBottom: 10,
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
},
dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.gray,
},
dropdownText: {
    fontSize: 16,
    color: theme.colors.text,
},
})
export default styleDialog
import { StyleSheet } from 'react-native';
import theme from '../../theme/theme.js';

const styleSearchDropdown = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
    },
    searchbar: {
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: theme.colors.white,
        borderRadius: 5,
        elevation: 2,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
});
export default styleSearchDropdown
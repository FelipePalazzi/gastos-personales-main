import React from 'react';
import { TextInput } from 'react-native-paper';
import { Text } from 'react-native';
import theme from '../../theme/theme';
import { screenWidth } from '../../styles/styles';

const formatCurrency = (value) => {
    if (!value) return '';
    const [integer, decimal] = String(value).split('.');
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return decimal !== undefined ? `${formattedInteger},${decimal}` : formattedInteger;
};

const parseCurrency = (text) => {
    let cleanText = text.replace(/[^0-9,]/g, '');
    const parts = cleanText.split(',');
    if (parts.length > 2) {
        cleanText = parts[0] + ',' + parts[1].slice(0, 2);
    }
    cleanText = cleanText.replace(',', '.');
    
    return cleanText;
};
const CurrencyInput = ({ value = '', onChange, label, deleteMode, style }) => {
    return (
        <TextInput
            mode="outlined"
            label={label}
            style={[{
                width: screenWidth / 3 * 2 - 50,
                marginLeft: 10,
                backgroundColor: value ? theme.colors.primary : theme.colors.white,
                paddingVertical: 10,
                color: theme.colors.white,
                height: 38,
            }, style]}
            outlineStyle={{
                borderColor:theme.colors.primary,
                borderRadius: 27,
            }}
            disabled={deleteMode}
            textColor={value ? theme.colors.white : theme.colors.primary}
            outlineColor={value ? theme.colors.white : theme.colors.primary}
            activeOutlineColor={value ? theme.colors.white : theme.colors.primary}
            theme={{ colors: { onSurfaceVariant: value ? theme.colors.white : theme.colors.primary, onSurfaceDisabled: theme.colors.white } }}
            right={
                value && !deleteMode ? (
                    <TextInput.Icon
                        icon="close"
                        onPress={() => onChange('')}
                        size={26}
                        color={theme.colors.white}
                        style={{ marginTop: 34 }}
                    />
                ) : null
            }
            value={formatCurrency(value || '')}
            keyboardType="numeric"
            onChangeText={(text) => {
                const parsedValue = parseCurrency(text);
                onChange(parsedValue);
            }}
        />
    );
};

export default CurrencyInput;

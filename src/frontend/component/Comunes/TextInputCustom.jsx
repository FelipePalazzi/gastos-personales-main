import { TextInput } from "react-native-paper"
import theme from "../../theme/theme"

const TextInputCustom = ({ label, placeholder, value, onChangeText, onPressClose }) => {
    return (
        <TextInput
            placeholder={placeholder}
            mode={'outlined'}
            label={label}
            value={value || ''}
            onChangeText={onChangeText}
            style={{
                width: '100%',
                backgroundColor: value ? theme.colors.primary : theme.colors.white,
                paddingVertical: 10,
                color: theme.colors.white,
                height: 38,
                marginTop: -5, marginBottom: 5
            }}
            outlineStyle={{
                borderColor: theme.colors.primary,
                borderRadius: 27,
            }}
            textColor={value ? theme.colors.white : theme.colors.primary}
            outlineColor={value ? theme.colors.white : theme.colors.primary}
            activeOutlineColor={value ? theme.colors.white : theme.colors.primary}
            theme={{ colors: { onSurfaceVariant: value ? theme.colors.white : theme.colors.primary } }}
            right={
                value ? (
                    <TextInput.Icon
                        icon="close"
                        onPress={onPressClose}
                        size={26}
                        color={theme.colors.white}
                        style={{ marginTop: 34 }}
                    />
                ) : null
            }
        />
    )
}
export default TextInputCustom
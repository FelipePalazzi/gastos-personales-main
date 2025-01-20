import { Text } from "react-native";
import { Portal, Dialog } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import theme from "../../../theme/theme";
import { styleDialog, screenWidth } from "../../../styles/styles";

const Error = ({
    visibleError,
    setVisibleError,
    message
}) => {
    return (
        <Portal>
            <Dialog style={{ backgroundColor: theme.colors.white }} visible={visibleError} onDismiss={() => setVisibleError(false)}>
                <Dialog.Icon color={theme.colors.primary} icon={'alert'} />
                <Dialog.Title style={styleDialog.title}>Error</Dialog.Title>
                <Dialog.Content style={{ alignItems: 'center' }}>
                    <Text style={[styleDialog.dateText, { marginRight: 0 }]}>{message}</Text>
                </Dialog.Content>
                <Dialog.Actions style={{ marginEnd: screenWidth / 5, marginTop: 10 }}>
                    <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={'check'} onPress={() => setVisibleError(false)} iconStyle={{ marginRight: 0, paddingHorizontal: 50 }} />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}
export default Error
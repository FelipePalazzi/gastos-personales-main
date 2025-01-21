import { Text } from "react-native";
import { Portal, Dialog } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import theme from "../../../theme/theme";
import { styleDialog, screenWidth } from "../../../styles/styles";

const Error = ({
    visibleOk,
    setVisibleOk,
    message
}) => {
    return (
        <Portal>
            <Dialog style={{ backgroundColor: theme.colors.white }} visible={visibleOk} onDismiss={() => setVisibleOk(false)}>
                <Dialog.Icon color={theme.colors.primary} icon={'cloud-check'} />
                <Dialog.Title style={styleDialog.title}>Correcto</Dialog.Title>
                {message && <Dialog.Content style={{ alignItems: 'center' }}>
                    <Text style={[styleDialog.dateText, { marginRight: 0 }]}>{message}</Text>
                </Dialog.Content>}
                <Dialog.Actions style={{ marginEnd: screenWidth / 5, marginTop: 10 }}>
                    <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={'check'} onPress={() => setVisibleOk(false)} iconStyle={{ marginRight: 0, paddingHorizontal: 50 }} />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}
export default Error
import { Portal, Dialog } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text } from "react-native"
import theme from "../../../theme/theme"
import { alerts, button_text } from "../../../../constants"
import { styleDialog, screenWidth } from "../../../styles/styles"

const Error = ({
    visible,
    setVisible,
    message
}) => {
    return (
        <Portal>
            <Dialog style={{ backgroundColor: theme.colors.white }} visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Icon color={theme.colors.primary} icon={'alert'} />
                <Dialog.Title style={styleDialog.title}>{message ? `${'Error con las credenciales'}` : `Error identificando la huella`}</Dialog.Title>
                {message ? <Dialog.Content>
                    <Text style={styleDialog.dateText}>{`${message}`}</Text>
                </Dialog.Content> : null}
                <Dialog.Actions style={{ marginEnd: screenWidth / 5, marginTop: 10 }}>
                    <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={'check'} onPress={() => setVisible(false)} iconStyle={{ marginRight: 0, paddingHorizontal: 50 }} />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}
export default Error
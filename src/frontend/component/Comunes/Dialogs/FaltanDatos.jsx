import { Portal, Dialog, Text } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from "../../../theme/theme"
import { alerts, button_text } from "../../../../constants"
import { styleDialog, screenWidth} from "../../../styles/styles"

const FaltanDatos = ({
    visible,
    setVisible,
    message
}) => {
    return (
        <Portal>
            <Dialog visible={visible} style={{ backgroundColor: theme.colors.white, width:screenWidth/1.2 }} onDismiss={() => setVisible(false)}>
                <Dialog.Icon icon={theme.icons.alerta} color={theme.colors.primary} />
                <Dialog.Title style={styleDialog.title}>{alerts.missing_data}</Dialog.Title>
                <Dialog.Content style={{alignItems:'center'}}>
                    <Text style={styleDialog.dateText}>{`${message}`}</Text>
                </Dialog.Content>
                <Dialog.Actions style={{marginEnd:screenWidth/4, marginTop:10}}>
                    <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={theme.icons.close} onPress={() => setVisible(false)}>
                        {button_text.close}
                    </Icon.Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}
export default FaltanDatos
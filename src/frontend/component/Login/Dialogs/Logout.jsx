import { Portal, Dialog } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from "../../../theme/theme"
import { styleDialog, screenWidth } from "../../../styles/styles"

const Logout = ({
    visible,
    setVisible,
}) => {
    return (
        <Portal>
            <Dialog style={{ backgroundColor: theme.colors.white }} visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Icon color={theme.colors.primary} icon={'hand-wave'} />
                <Dialog.Title style={styleDialog.title}>{'Sesion cerrada con exito'}</Dialog.Title>
                <Dialog.Actions  style={{marginEnd:screenWidth/5, marginTop:10}}>
                    <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={'thumb-up-outline'} onPress={() => setVisible(false)}  iconStyle={{marginRight:0, paddingHorizontal:50}}/>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}
export default Logout

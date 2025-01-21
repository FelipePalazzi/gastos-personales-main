import { Portal, Dialog } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from "../../../theme/theme"
import { alerts, button_text, symbols, pagina} from "../../../../constants"
import { styleDialog, screenWidth } from "../../../styles/styles"
import { useState } from "react"
import Error from "../../Comunes/Dialogs/Error"
import Correcto from "../../Comunes/Dialogs/CorrectoNavigation"
import { useAuth } from "../../../helpers/AuthContext";
import { PAGINA_URL } from '@env';

const RechazarInvitacion = ({
    visible,
    setVisible,
    invitacionId
}) => {
    const { accessToken, refreshToken } = useAuth()
    const [loading, setLoading] = useState(false);
    const [visibleError, setVisibleError] = useState(false);
    const [visibleOk, setVisibleOk] = useState(false);
    const [message, setMessage] = useState('');

    const handleCancel = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}rechazar${symbols.barra}${invitacionId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken,
                    'Content-Type': 'application/json'
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.message)
                setLoading(false)
                setVisibleError(true)
                return
            }
            const data = await response.json()
            setLoading(false)
            setMessage('Se ha rechazado la invitacion')
            setVisibleOk(true)
        } catch (error) {
            console.error(error);
            setMessage(`Hubo un problema al enviar el código.\n Por favor, intenta nuevamente.`)
            setVisibleError(true)
            setLoading(false);
        }
    }

    return (
        <>
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{ backgroundColor: theme.colors.primary }}>
                    <Dialog.Icon icon={loading ? 'loading' : theme.icons.alerta} color={theme.colors.white} />
                    <Dialog.Title style={[styleDialog.title, { color: theme.colors.white }]}>¿Desea rechazar la invitacion?</Dialog.Title>
                    <Dialog.Actions style={styleDialog.dialogActions}>
                        <Icon.Button name={theme.icons.close} backgroundColor={theme.colors.primary} color={theme.colors.white} onPress={() => setVisible(false)}>{button_text.cancel}</Icon.Button>
                        <Icon.Button name={theme.icons.ok} backgroundColor={theme.colors.white} color={theme.colors.primary} onPress={handleCancel}>Borrar
                        </Icon.Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Error visibleError={visibleError} setVisibleError={setVisibleError} message={message} />
            <Correcto visibleOk={visibleOk} setVisibleOk={setVisibleOk} message={message} />
        </>
    )
}
export default RechazarInvitacion
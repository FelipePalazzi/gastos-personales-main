import { useState } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Portal, Dialog, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import theme from "../../../theme/theme";
import { styleDialog, screenWidth } from "../../../styles/styles";
import { pagina, symbols, alerts, atributos } from '../../../../constants';
import { useAuth } from "../../../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL
import { decodeTokenUserId } from "../../../utils";
import Clipboard from '@react-native-clipboard/clipboard';
import Error from "../../Comunes/Dialogs/Error";
import Correcto from "../../Comunes/Dialogs/Correcto";

const CodigoInvitacionIngresar = ({
    visible,
    handlePress,
}) => {
    const { accessToken, refreshToken } = useAuth()
    const pasteClipboard = async () => {
        const copiedText = await Clipboard.getString();
        if (copiedText) {
            setCodigo(copiedText);
            setPegado(true);
        }
    };
    const [pegado, setPegado] = useState(false);
    const [codigo, setCodigo] = useState('')

    const [loading, setLoading] = useState(false);
    const [visibleError, setVisibleError] = useState(false);
    const [visibleOk, setVisibleOk] = useState(false);
    const [message, setMessage] = useState('');

    const handleSumbit = async (codigo) => {
        try {
            if (!codigo || codigo.length < 10) {
                setMessage('Codigo inválido')
                setVisibleError(true)
                return;
            }
            setLoading(true)
            const userId = decodeTokenUserId(accessToken)
            if (!userId) {
                setMessage('Usuario no encontrado')
                setVisibleError(true)
                return;
            }
            const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}${userId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ codigo_invitacion: codigo })
            })
            if (!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.error)
                setLoading(false)
                setVisibleError(true)
                return
            }
            const data = await response.json()
            setLoading(false)
            setMessage('Le ha llegado la invitacion al creador')
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
                <Dialog
                    style={{
                        backgroundColor: theme.colors.white,
                        width: screenWidth / 1.2,
                    }}
                    visible={visible}
                    onDismiss={handlePress}
                >
                    <Dialog.Title style={styleDialog.title}>
                        {`Unirse a una cuenta`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <TouchableWithoutFeedback onPress={pasteClipboard}>
                            <View style={[styleDialog.searchbarContainer, { marginTop: 10 }]}>
                                {pegado ? (
                                    <Text style={[styleDialog.label, { top: 3 }]}>
                                        Pegado
                                    </Text>
                                ) :
                                    <Text style={[styleDialog.label, { top: 3, color: theme.colors.primary }]}>
                                        Código de invitación:
                                    </Text>}
                                <Searchbar
                                    placeholder={"Toca para pegar el codigo de invitación"}
                                    value={codigo}
                                    editable={false}
                                    multiline={true}
                                    style={[
                                        {
                                            minHeight: 60,
                                            justifyContent: "center",
                                            paddingVertical: 10
                                        },
                                        pegado
                                            ? styleDialog.modalSearchbar
                                            : styleDialog.searchbar,
                                    ]}
                                    iconColor={
                                        pegado
                                            ? theme.colors.white
                                            : theme.colors.primary
                                    }
                                    placeholderTextColor={
                                        pegado
                                            ? theme.colors.white
                                            : theme.colors.primary
                                    }
                                    inputStyle={{
                                        color: pegado
                                            ? theme.colors.white
                                            : theme.colors.primary,
                                        textAlignVertical: "center",
                                    }}
                                    icon={
                                        pegado
                                            ? "clipboard-check-outline"
                                            : "clipboard-outline"
                                    }
                                    onClearIconPress={() => (setPegado(false), setCodigo(''))}
                                    loading={loading}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </Dialog.Content>
                    <Dialog.Actions
                        style={{
                            justifyContent: 'space-between'
                        }}
                    >
                        <Icon.Button
                            backgroundColor={theme.colors.white}
                            color={theme.colors.primary}
                            name={"keyboard-backspace"}
                            onPress={handlePress}
                            style={{
                                paddingHorizontal: 25,
                            }}
                        />
                        <Icon.Button
                            backgroundColor={theme.colors.primary}
                            color={theme.colors.white}
                            name={"check"}
                            onPress={() => handleSumbit(codigo)}
                            style={{
                                paddingHorizontal: 50,
                            }}
                        />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Error visibleError={visibleError} setVisibleError={setVisibleError} message={message} />
            <Correcto visibleOk={visibleOk} setVisibleOk={setVisibleOk} message={message} />
        </>
    );
};

export default CodigoInvitacionIngresar;

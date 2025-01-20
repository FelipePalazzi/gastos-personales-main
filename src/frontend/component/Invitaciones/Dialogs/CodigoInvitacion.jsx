import { useState } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Portal, Dialog, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import theme from "../../../theme/theme";
import { styleDialog, screenWidth } from "../../../styles/styles";
//import Clipboard from '@react-native-clipboard/clipboard';

const CodigoInvitacion = ({
    visible,
    handlePress,
    codigo = "",
    keyName,
}) => {
    const [copiado, setCopiado] = useState(false);

    const formatCodigo = (codigo) => {
        return codigo.replace(/((?:[^-]*-){3}[^-]*)(-)/g, "$1\n");
    };

    const copyToClipboard = () => {
        // Clipboard.setString(codigo);
        setCopiado(true);
        setTimeout(() => {
            setCopiado(false);
        }, 4000);
    };

    return (
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
                    {`Cuenta: ${keyName}`}
                </Dialog.Title>
                <Dialog.Content>
                    <TouchableWithoutFeedback onPress={copyToClipboard}>
                        <View style={[styleDialog.searchbarContainer, { marginTop:10}]}>
                            {copiado ? (
                                <Text style={[styleDialog.label, { top: 3}]}>
                                    Copiado
                                </Text>
                            ) : 
                            <Text style={[styleDialog.label, {top: 3,color:theme.colors.primary}]}>
                                    Código de invitación:
                                </Text>}
                            <Searchbar
                                placeholder={"Código de Invitación"}
                                value={formatCodigo(codigo)}
                                editable={false}
                                multiline={true}
                                style={[
                                    {
                                        minHeight: 60, 
                                        justifyContent: "center",
                                        paddingVertical:10
                                    },
                                    copiado
                                        ? styleDialog.modalSearchbar
                                        : styleDialog.searchbar,
                                ]}
                                iconColor={
                                    copiado
                                        ? theme.colors.white
                                        : theme.colors.primary
                                }
                                placeholderTextColor={
                                    copiado
                                        ? theme.colors.white
                                        : theme.colors.primary
                                }
                                inputStyle={{
                                    color: copiado
                                        ? theme.colors.white
                                        : theme.colors.primary,
                                    textAlignVertical: "center",
                                }}
                                icon={
                                    copiado
                                        ? "clipboard-check-outline"
                                        : "clipboard-outline"
                                }
                                right={null}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </Dialog.Content>
                <Dialog.Actions
                    style={{
                        marginEnd: screenWidth/5.2,
                        alignItems: "flex-start",
                    }}
                >
                    <Icon.Button
                        backgroundColor={theme.colors.white}
                        color={theme.colors.primary}
                        name={"keyboard-backspace"}
                        onPress={handlePress}
                        style={{
                            marginRight: -10,
                            paddingHorizontal: 50,
                        }}
                    />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default CodigoInvitacion;

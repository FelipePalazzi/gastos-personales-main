import { Portal, Dialog } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from "../../../theme/theme";
import { styleDialog, screenWidth } from "../../../styles/styles";

const Logout = ({ visible, setVisible, visibleLogout, setVisibleLogout, onConfirm }) => {

    const handleConfirm = () => {
        onConfirm();
        setVisible(false);
    };

    return (
        <Portal>
            <Dialog style={{ backgroundColor: theme.colors.white }} visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Icon color={theme.colors.primary} icon={'logout'} />
                <Dialog.Title style={styleDialog.title}>¿Seguro deseas cerrar sesión?</Dialog.Title>
                <Dialog.Actions style={{ justifyContent: 'space-between', marginTop: 10 }}>
                    <Icon.Button
                        backgroundColor={theme.colors.white}
                        color={theme.colors.primary}
                        name={'close'}
                        onPress={() => setVisible(false)}
                        iconStyle={{ marginRight: 0, paddingHorizontal: 10 }}
                    />
                    <Icon.Button
                        backgroundColor={theme.colors.primary}
                        color={theme.colors.white}
                        name={'check'}
                        onPress={handleConfirm}
                        iconStyle={{ marginRight: 0, paddingHorizontal: 30 }}
                    >
                        Confirmar
                    </Icon.Button>
                </Dialog.Actions>
            </Dialog>

            <Dialog style={{ backgroundColor: theme.colors.white }} visible={visibleLogout} onDismiss={() => setVisibleLogout(false)}>
                <Dialog.Icon color={theme.colors.primary} icon={'hand-wave'} />
                <Dialog.Title style={styleDialog.title}>{'Sesión cerrada con éxito'}</Dialog.Title>
                <Dialog.Actions style={{ marginEnd: screenWidth / 5, marginTop: 10 }}>
                    <Icon.Button
                        backgroundColor={theme.colors.primary}
                        color={theme.colors.white}
                        name={'thumb-up-outline'}
                        onPress={() => setVisibleLogout(false)}
                        iconStyle={{ marginRight: 0, paddingHorizontal: 50 }}
                    />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default Logout;
import { Portal, Dialog } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from "../../../theme/theme"
import { alerts, button_text } from "../../../../constants"
import { styleDialog, screenWidth } from "../../../styles/styles"

const Delete = ({
    visible,
    setVisible,
    handleDelete,
    visibleOk,
    setVisibleOk,
    archivar,
    navigation,
    RutaAnterior,
    goBack,
}) => {
    return (
        <>
        <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{backgroundColor:theme.colors.primary}}>
          <Dialog.Icon icon={theme.icons.deleteAlert} color={theme.colors.white}/>
          <Dialog.Title style={[styleDialog.title,{color:theme.colors.white}]}>{archivar ? alerts.archivar_question : alerts.desarchivar_question}</Dialog.Title>
          <Dialog.Actions style={styleDialog.dialogActions}>
            <Icon.Button name={theme.icons.close} backgroundColor={theme.colors.primary} color={theme.colors.white} onPress={() => setVisible(false)}>{button_text.cancel}</Icon.Button>
            <Icon.Button name={theme.icons.borrar} backgroundColor={theme.colors.white} color={theme.colors.primary}onPress={handleDelete}>{archivar ? button_text.archivar : button_text.desarchivar}
            </Icon.Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={visibleOk} onDismiss={() => setVisibleOk(false)} style={{backgroundColor:theme.colors.white}}>
          <Dialog.Icon icon={theme.icons.deleteComplete} color={theme.colors.primary}/>
          <Dialog.Title style={styleDialog.title}>{archivar ? alerts.archivado_exito : alerts.desarchivado_exito}</Dialog.Title>
          <Dialog.Actions style={{ marginEnd: screenWidth / 5, marginTop: 10 }}>
            <Icon.Button style={{paddingHorizontal:50}} name={theme.icons.ok} color={theme.colors.white} backgroundColor={theme.colors.primary} onPress={() => goBack ? ( navigation.goBack(), setVisibleOk(false)) : (navigation.navigate(RutaAnterior, { refresh: true }), setVisibleOk(false))}>{button_text.ok}</Icon.Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      </>
    )
}
export default Delete
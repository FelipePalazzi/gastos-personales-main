import { Portal, Dialog } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from "../../../theme/theme"
import { alerts } from "../../../../constants"
import { styleDialog, screenWidth } from "../../../styles/styles"

const Correcto = ({
  visible,
  setVisible,
  navigation,
  RutaAnterior,
  goBack,
  message,
}) => {
  return (
    <Portal>
      <Dialog style={{ backgroundColor: theme.colors.white, width:screenWidth/1.2 }} visible={visible} onDismiss={() => (setVisible(false) , goBack ?  navigation.goBack() : navigation.navigate(RutaAnterior, { refresh: true }))}>
        <Dialog.Title style={styleDialog.title}>{message ? message : alerts.guardado_exito}</Dialog.Title>
        <Dialog.Actions style={{marginEnd:screenWidth/5.2, marginTop:10}}>
          <Icon.Button
          backgroundColor={theme.colors.primary} color={theme.colors.white} 
            name={'cloud-check'}
            onPress={() =>(setVisible(false), goBack ? navigation.goBack() : navigation.navigate(RutaAnterior, { refresh: true }))} 
            style={{marginRight:-10,paddingHorizontal:50}}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
export default Correcto
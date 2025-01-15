import { Portal, Dialog } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text } from "react-native"
import theme from "../../../theme/theme"
import { styleDialog, screenWidth } from "../../../styles/styles"

const Correcto = ({
  visible,
  setVisible,
  navigation,
  nombreUsuario
}) => {
  return (
    <Portal>
    <Dialog style={{backgroundColor:theme.colors.white}} visible={visible} onDismiss={() => [navigation.navigate(`Drawer`), setVisible(false)]}>
      <Dialog.Icon color={theme.colors.primary}  icon={'account-check'} />
      <Dialog.Title style={styleDialog.title}>{'Inicio de sesion correcto'}</Dialog.Title>
      <Dialog.Content>
        <Text style={styleDialog.dateText}>{`Bienvenido ${nombreUsuario}!`}</Text>
      </Dialog.Content>
      <Dialog.Actions  style={{marginEnd:screenWidth/5, marginTop:10}}>
        <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white}  name={'check'} onPress={() => [navigation.navigate(`Drawer`), setVisible(false)]}  iconStyle={{marginRight:0, paddingHorizontal:50}}/>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  )
}
export default Correcto
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../../theme/theme.js';
import { View, Text, Image } from 'react-native';
import { styleComun, styleDrawer } from '../../../styles/styles.js';
import Submenu from './Submenu.jsx';
import { useAuth } from '../../../helpers/AuthContext.js';
import { useState } from 'react';
import CodigoInvitacionIngresar from '../../Invitaciones/Dialogs/CodigoInvitacionIngresar.jsx';
import { menuItems } from './submenuItems.js';
import CambioFechaDialog from '../../Comunes/Dialogs/CambioFechaDialog.jsx';

function CustomDrawerContent({ keyId, nombreKey, navigation, codigo }) {
  const { usernameLogeado } = useAuth()
  const [visibleCodigo, setVisibleCodigo] = useState(false);
  const [visibleCambio, setVisibleCambio] = useState(false);
  const handlePress = () => {
    setVisibleCodigo(false);
  };

  return (
    <>
      <DrawerContentScrollView>
        <View style={[styleDrawer.container, { backgroundColor: theme.colors.white }]}>
          <Text style={[styleComun.title, { color: theme.colors.primary }]}>Hola {usernameLogeado}!</Text>
        </View>
        <Submenu
          label="Modificacion de entidades"
          iconName="cog"
          navigation={navigation}
          keyId={keyId}
          menuItems={menuItems}
        />
        <DrawerItem
          label="Administrar usuarios"
          onPress={() => navigation.navigate('AdministrarUsuarios')}
          icon={({ }) => <Icon name="account-cog" size={theme.fontSizes.body} color={theme.colors.white} />}
          style={{ marginTop: 10 }}
          labelStyle={{ color: theme.colors.white }}
        />
        <DrawerItem
          label="Invitaciones recibidas"
          onPress={() => navigation.navigate('Invitacioneskey')}
          icon={({ }) => <Icon name="card-account-mail" size={theme.fontSizes.body} color={theme.colors.white} />}
          style={{ marginTop: 10 }}
          labelStyle={{ color: theme.colors.white }}
        />
        <DrawerItem
          label="Invitaciones enviadas"
          onPress={() => navigation.navigate('Invitacionesuser')}
          icon={({ }) => <Icon name="send-clock" size={theme.fontSizes.body} color={theme.colors.white} />}
          style={{ marginTop: 10 }}
          labelStyle={{ color: theme.colors.white }}
        />
        <DrawerItem
          label="Unirse a una cuenta"
          onPress={() => setVisibleCodigo(true)}
          icon={({ }) => <Icon name="account-plus" size={theme.fontSizes.body} color={theme.colors.white} />}
          style={{ marginTop: 10 }}
          labelStyle={{ color: theme.colors.white }}
        />
        <DrawerItem
          label="Consultar cambio"
          onPress={() => setVisibleCambio(true)}
          icon={({ }) => <Icon name="cash-multiple" size={theme.fontSizes.body} color={theme.colors.white} />}
          style={{ marginTop: 10 }}
          labelStyle={{ color: theme.colors.white }}
        />
        <DrawerItem
          label="Volver al Inicio"
          onPress={() => navigation.navigate('Login')}
          icon={({ }) => <Icon name="logout" size={theme.fontSizes.body} color={theme.colors.white} />}
          style={{ marginTop: 10 }}
          labelStyle={{ color: theme.colors.white }}
        />

        <CambioFechaDialog visible={visibleCambio} setVisible={setVisibleCambio} keyId={keyId}/>
        <CodigoInvitacionIngresar visible={visibleCodigo} handlePress={handlePress} keyName={nombreKey} />
      </DrawerContentScrollView>
      <View style={{ position: 'absolute', bottom: 0, left: 20, backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../../../../../assets/icon.png')}
          style={{ width: 30, height: 30 }}
        />
        <Text style={[styleComun.title, { color: theme.colors.white }]}>Expenzzi</Text>
        <Text style={{ marginLeft: 10, marginTop: 5, color: theme.colors.white }}>©Felipe Palazzi</Text>
      </View>
    </>
  );
}

export default CustomDrawerContent
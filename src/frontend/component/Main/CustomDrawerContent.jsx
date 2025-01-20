import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme.js';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styleComun, styleDrawer } from '../../styles/styles.js';
import Submenu from './Submenu.jsx';
import { useAuth } from '../../helpers/AuthContext.js';
import { useState } from 'react';
import CodigoInvitacionIngresar from '../Invitaciones/Dialogs/CodigoInvitacionIngresar.jsx';

function CustomDrawerContent({ keyId, nombreKey = 'Cargando...' }) {
  const navigation = useNavigation();
  const { usernameLogeado } = useAuth()
  const menuItems = [
    { label: "Categoria", entityType: "categoria", routeName: 'categoria' },
    { label: "Subcategoria", entityType: "subcategoria", routeName: 'subcategoria' },
    //{ label: "Moneda", entityType: "id_moneda_origen", routeName:'moneda'  },
    { label: "Responsable", entityType: "responsable", routeName: 'responsable' },
    { label: "Submetodo de Pago", entityType: "submetodopago", routeName: 'submetodopago' },
  ];
  const [visibleCodigo, setVisibleCodigo] = useState(false);
  const handlePress = () => {
    setVisibleCodigo(false);
};

  return (
    <DrawerContentScrollView>
      <View style={[styleDrawer.container, {backgroundColor:theme.colors.white}]}>
        <Text style={[styleComun.title, {color:theme.colors.primary}]}>Hola {usernameLogeado}!</Text>
      </View>
      <Submenu
        label="Modificacion de entidades"
        iconName="cog"
        navigation={navigation}
        keyId={keyId}
        menuItems={menuItems}
      />
      <DrawerItem
        label="Administrar Invitaciones"
        onPress={() => navigation.navigate('Invitacioneskey', { keyId: keyId })}
        icon={({ }) => <Icon name="card-account-mail" size={theme.fontSizes.body} color={theme.colors.white} />}
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

      {/* Proximamente agregar usuarios
  <DrawerItem
            label="Agregar Usuario a colaborar"
            onPress={() => navigation.navigate('Login')}
            icon={({}) => <Icon name="add" size={theme.fontSizes.body} color={theme.colors.white} />}
            style={{backgroundColor:theme.colors.pieInner, marginTop: 15}}
            labelStyle={{color:theme.colors.white}}
            />
            */}

      <DrawerItem
        label="Volver al Inicio"
        onPress={() => navigation.navigate('Login')}
        icon={({ }) => <Icon name="logout" size={theme.fontSizes.body} color={theme.colors.white} />}
        style={{ marginTop: 10 }}
        labelStyle={{ color: theme.colors.white }}
      />
<CodigoInvitacionIngresar visible={visibleCodigo} handlePress={handlePress} keyName={nombreKey} />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent
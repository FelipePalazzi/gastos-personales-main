import { useState, useEffect } from 'react';
import theme from '../../../theme/theme.js';
import CustomDrawerContent from '../Drawer/CustomDrawerContent.jsx';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTab from '../Tab_Top_Bottom/HomeTab.jsx';
import LoadingScreen from '../../Comunes/Loading/LoadingScreen.jsx';
import { styleDrawer } from '../../../styles/styles.js';
import { useRoute, useNavigation } from '@react-navigation/native';
import InvitacionesListKeys from '../../Invitaciones/InvitacionesListKeys.jsx';
import InvitacionesListUser from '../../Invitaciones/InvitacionesListUser.jsx';
import UsuariosListKey from '../../Usuarios/UsuariosListKey.jsx';
import MovimientoForm from "../../Movimientos/MovimientoForm.jsx";
import ABMKeys from "../../ABM/ABMKeys.jsx";
import ABmonedas from "../../ABM/ABmonedas.jsx";
import ABMEntidades from '../../ABM/ABMEntidades.jsx';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const route = useRoute()
  const [keyId, setKeyId] = useState(1)
  const [nombreKey, setNombreKey] = useState('Seleccione una Cuenta...')
  const [codigo, setCodigo] = useState('')
  
  const navigation = useNavigation()
  useEffect(() => {
    if (route.params?.keyId && route.params?.nombreKey) {
      setKeyId(route?.params.keyId)
      setNombreKey(route?.params.nombreKey)
      setCodigo(route?.params.codigo)
    }
  }, [route.params]);

  return (
    keyId && <Drawer.Navigator
      drawerContent={() => (
        <CustomDrawerContent keyId={keyId} nombreKey={nombreKey} navigation={navigation} codigo={codigo}/>
      )}
      screenOptions={{
        drawerStyle: styleDrawer.drawerStyle,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.white,
        drawerType:'back',
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTitleStyle: { color: theme.colors.white },
        headerTintColor: theme.colors.white,
      }}
    >
      <Drawer.Screen
        name="HomeTab"
        options={{ headerShown: false }}
      >
        {(props) => <HomeTab {...props} keyId={keyId} nombreKey={nombreKey} navigation={navigation}/> || <LoadingScreen Nombre={"Datos"} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="AdministrarUsuarios"
        options={{ headerShown: false, animation: "slide" }}
      >
        {(props) => <UsuariosListKey {...props} keyId={keyId} nombreKey={nombreKey} navigation={navigation} codigo={codigo}/> || <LoadingScreen Nombre={"Invitaciones"} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Invitacioneskey"
        options={{ headerShown: false, animation: "slide" }}
      >
        {(props) => <InvitacionesListKeys {...props} keyId={keyId} nombreKey={nombreKey} navigation={navigation} codigo={codigo}/> || <LoadingScreen Nombre={"Invitaciones"} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Invitacionesuser"
        options={{ headerShown: false, animation: "slide" }}
      >
        {(props) => <InvitacionesListUser {...props} keyId={keyId} navigation={navigation}/> || <LoadingScreen Nombre={"Invitaciones"} />}
      </Drawer.Screen>
      < Drawer.Screen
        name='GastoForm'
      component={MovimientoForm}
      options={({ route }) => ({
        headerTitle: route.params?.labelHeader
          ? route.params.labelHeader
          : 'Creación de Salidas',
        animation: "slide_from_bottom"
      })}
      initialParams={{ tipo: 'salidas', labelHeader: 'Nuevo Gasto' }}
      />
      <Drawer.Screen
        name='IngresoForm'
        component={MovimientoForm}
        options={({ route }) => ({
          headerTitle: route.params?.labelHeader
            ? route.params.labelHeader
            : 'Creación de Entradas',
          animation: "slide_from_bottom"
        })}
        initialParams={{ tipo: 'entradas', labelHeader: 'Nuevo Ingreso' }}
      />

      <Drawer.Screen
        name="ABMEntidades"
        component={ABMEntidades}
        options={({ route }) => ({
          headerTitle: route.params?.labelHeader
            ? route.params.labelHeader
            : 'Creación de Entidades',
          animation: "slide_from_bottom"
        })}
      />
      <Drawer.Screen
        name="ABMKeys"
        component={ABMKeys}
        options={({ route }) => ({
          headerTitle: route.params?.labelHeader
            ? route.params.labelHeader
            : 'Creación de Cuentas',
          animation: "slide_from_bottom"
        })}
      />
      <Drawer.Screen
        name="ABmonedas"
        component={ABmonedas}
        options={({ route }) => ({
          headerTitle: route.params?.labelHeader
            ? route.params.labelHeader
            : 'Creación de Monedas',
          animation: "slide_from_bottom"
        })}
      />
    </Drawer.Navigator>
  );
}
export default DrawerNavigator
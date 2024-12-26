import {useState, useCallback, useEffect} from 'react';
import GastoList from "./Gastos/GastosList.jsx";
import AgregarGasto from "./Gastos/GastoForm.jsx";
import IngresoList from "./Ingresos/IngresosList.jsx";
import AgregarIngreso from "./Ingresos/IngresoForm.jsx";
import Resumen from "./Resumen/Resumen.jsx";
import LoginScreen from "./Login/Login.jsx";
import Register from "./Login/Register.jsx";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../styles/theme.js';
import { View, Text } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { styleLista, styleForm } from '../styles/styles.js';
import {Picker} from '@react-native-picker/picker'
import { decodeToken } from '../utils.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGetKeys from '../hooks/useGetKeys.js';

const Tab = createMaterialTopTabNavigator();
const HomeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const keys = useGetKeys(); // Usar el hook para obtener las keys
  const [keyId, setKeyId] = useState(keys.length > 0 ? keys[0].key_id : null);

  useEffect(() => {
    if (keys.length > 0) {
      setKeyId(keys[0].key_id); // Establecer la primera key como seleccionada por defecto
    }
  }, [keys]);

  return (
    <Drawer.Navigator
      drawerContent={() => (
        <CustomDrawerContent
          keyId={keyId}
          setKeyId={setKeyId}
          keys={keys}
        />
      )}
      screenOptions={{
        drawerStyle: { backgroundColor: theme.colors.primary },
        drawerActiveTintColor: theme.colors.pieBackground,
        drawerInactiveTintColor: theme.colors.disabled,
      }}
    >
      <Drawer.Screen
        name="HomeTab"
        options={{ headerShown: false }}
      >
        {(props) => <HomeTab {...props} keyId={keyId} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}


function CustomDrawerContent({ keyId, setKeyId, keys }) {
  const navigation = useNavigation();

  const handleKeyId = (itemValue) => {
    setKeyId(itemValue); // Establece keyId en el estado
    navigation.setParams({ keyId: itemValue }); // Asegúrate de que se actualice el parámetro
  };
  

  return (
    <DrawerContentScrollView>
      <View
        style={[
          styleLista.button,
          {
            marginBottom: 0,
            backgroundColor: theme.colors.pieInner,
            paddingVertical: 26,
            marginTop: 5,
          },
        ]}
      >
        <Text style={[styleLista.textTitleTable, { color: theme.colors.white, fontSize: 20 }]}>
          Menu
        </Text>
      </View>
      <Picker
        selectedValue={keyId}
        onValueChange={handleKeyId}
        style={styleForm.picker}
        mode={theme.picker.modo}
        dropdownIconColor={theme.colors.textSecondary}
      >
        {keys.map((key) => (
          <Picker.Item key={key} label={String(key)} value={key} />
        ))}
      </Picker>
      {/* Otras opciones del menú */}
    </DrawerContentScrollView>
  );
}

function HomeTab({ keyId }) {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (keyId) {
      // Actualiza los parámetros dinámicamente
      navigation.setParams({ keyId });
    }
  }, [keyId, navigation]);

  return (
    <>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        height: 115,
        width: 55,
      }}>
        <Icon.Button
          backgroundColor={theme.colors.primary}
          name={'menu'}
          onPress={() => navigation.openDrawer()}
          size={35}
          iconStyle={{ marginTop: 38 }}
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
          borderRadius={0}
        >
          <Text style={{ color: theme.colors.white, fontSize: theme.fontSizes.ingresar }}>Menu</Text>
        </Icon.Button>
      </View>

      <Tab.Navigator
        initialRouteName="Resumen"
        screenOptions={({ route }) => ({
          tabBarIconStyle: { marginTop: 40 },
          tabBarAndroidRipple: { borderless: false, radius: 0 },
          tabBarStyle: { backgroundColor: theme.colors.primary, marginStart: 55 },
          tabBarLabelStyle: { fontSize: theme.fontSizes.ingresar },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Resumen') {
              iconName = focused ? 'stats-chart' : 'stats-chart';
            } else if (route.name === 'Gastos') {
              iconName = focused ? 'trending-down-outline' : 'trending-down-outline';
            } else if (route.name === 'Ingresos') {
              iconName = focused ? 'trending-up-outline' : 'trending-up-outline';
            }
            return <Ionicons name={iconName} size={theme.fontSizes.body} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.pieBackground,
          tabBarInactiveTintColor: theme.colors.disabled,
        })}
      >
<Tab.Screen
  name="Gastos"
  children={() => <GastoList keyId={keyId} />} // Pasar keyId como prop explícita
  options={{ tabBarLabel: 'Salidas' }}
/>

        <Tab.Screen
          name="Ingresos"
          component={IngresoList}
          options={{ tabBarLabel: 'Entradas' }}
        />
      </Tab.Navigator>
    </>
  );
}


const Main = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="GastoForm" component={AgregarGasto} />
      <HomeStack.Screen name="IngresoForm" component={AgregarIngreso} />
      <HomeStack.Screen name="Register" component={Register} />
    </HomeStack.Navigator>
  );
};

export default Main;

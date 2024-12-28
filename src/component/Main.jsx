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
import { View, Text, FlatList} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { styleLista, styleForm } from '../styles/styles.js';
import {Picker} from '@react-native-picker/picker'
import useGetKeys from '../hooks/useGetKeys.js';
import CreacionEntidades from './Creacion/CreacionEntidades.jsx';

const Tab = createMaterialTopTabNavigator();
const HomeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { getkeys, loading, fetchGetKeys } = useGetKeys(); // Usar el hook para obtener las keys
  const [keyId, setKeyId] = useState(null);

  useEffect(() => {
    const loadKeys = async () => {
      await fetchGetKeys(); // Llama a la función para obtener las keys
    };

    loadKeys();
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (getkeys.length > 0) {
      setKeyId(getkeys[0].key_id); // Establecer la primera key como seleccionada por defecto
    }
  }, [getkeys]);

  return (
    <Drawer.Navigator
      drawerContent={() => (
        <CustomDrawerContent
          keyId={keyId}
          setKeyId={setKeyId}
          keys={getkeys}
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

  const truncateLabel = (name, description, maxLength) => {
    const combined = `${name} - ${description}`;
    if (combined.length > maxLength) {
      return `${combined.slice(0, maxLength - 3)}...`; // Resta 3 para el ellipsis
    }
    return combined;
  };
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);
  const menuItems = [
    { label: "Crear Categoria", entityType: "categoriagasto" },
    { label: "Crear Tipo de Gasto", entityType: "tipogasto" },
    { label: "Crear Moneda", entityType: "monedaingreso" },
    { label: "Crear Responsable", entityType: "responsableIngreso" },
    { label: "Nueva categoria de Entrada y Salida", entityType: "keys" },
  ];

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
      <View
        style={{
            marginBottom: 0,
            backgroundColor: theme.colors.pieBackground,
            paddingVertical: 20,
            marginTop: 0,
            paddingBottom:25,
            alignItems:'center',
            justifyContent:'center'
          }}
      >
       <Text style={[styleLista.textTitleTable, { color: theme.colors.white, fontSize: 20, marginBottom:10 }]}>
          Categoria de Entradas y Salidas:
        </Text>
      <Picker
        selectedValue={keyId}
        onValueChange={handleKeyId}
        style={[styleForm.picker,{marginLeft:15, backgroundColor:theme.colors.card}]}
        mode={'dropdown'}
        dropdownIconColor={theme.colors.textSecondary}
        numberOfLines={2}
      >
        {keys.map((key, index) => (
          <Picker.Item 
            key={key.key_id} // Usa key_id como clave
             label={truncateLabel(key.Nombre, key.Descripcion, 200)} // Muestra el nombre y la descripción
            value={key.key_id} // Usa key_id como valor
            style={{backgroundColor:theme.colors.card,
              color: index % 2 === 0 ? theme.colors.pieBackground : theme.colors.pieInner // Alterna entre primary y secondary
            }}
          />
        ))}
      </Picker>
      </View>
      <DrawerItem
        label="Volver al Inicio"
        onPress={() => navigation.navigate('Login')}
        icon={({}) => <Ionicons name="log-out-outline" size={theme.fontSizes.body} color={theme.colors.white} />}
        style={{backgroundColor:theme.colors.pieInner, marginTop:10}}
        labelStyle={{color:theme.colors.white}}
      />

      <DrawerItem
        label="Opciones de Creación"
        onPress={() => setIsSubmenuVisible(!isSubmenuVisible)} // Cambiar el estado para mostrar/ocultar el submenú
        icon={() => <Ionicons name="add-circle-outline" size={theme.fontSizes.body} color={theme.colors.white} />}
        style={{ backgroundColor: theme.colors.pieInner, marginTop: 10 }}
        labelStyle={{ color: theme.colors.white }}
      />
      {isSubmenuVisible && (
        <View style={styleForm.container}>
          <FlatList
            data={menuItems}
            renderItem={({ item }) => (
              <DrawerItem
                key={item.entityType}
                label={item.label}
                onPress={() => navigation.navigate('CreacionEntidades', { entityType: item.entityType })}
                icon={() => <Ionicons name="log-out-outline" size={theme.fontSizes.body} color={theme.colors.white} />}
                style={{ backgroundColor: theme.colors.pieInner, marginTop: 10 }}
                labelStyle={{ color: theme.colors.white }}
              />
            )}
            keyExtractor={(item) => item.entityType}
          />
        </View>
      )}

  <DrawerItem
          label="Agregar Usuario a colaborar"
          onPress={() => navigation.navigate('Login')}
          icon={({}) => <Ionicons name="log-out-outline" size={theme.fontSizes.body} color={theme.colors.white} />}
          style={{backgroundColor:theme.colors.pieInner, marginTop:10}}
          labelStyle={{color:theme.colors.white}}
        />

    </DrawerContentScrollView>
  );
}

function HomeTab({ keyId }) {
  const navigation = useNavigation();

  useEffect(() => {
    if (keyId) {
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
  children={() => <GastoList keyId={keyId} />}
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
  const navigation = useNavigation();
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
      <HomeStack.Screen name="CreacionEntidades" component={CreacionEntidades} />
    </HomeStack.Navigator>
  );
};

export default Main;

import { useEffect, useState, useMemo } from 'react';
import GastoList from "../Gastos/GastosList.jsx";
import IngresoList from "../Ingresos/IngresosList.jsx";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons.js'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme.js';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { styleComun, styleDrawer } from '../../styles/styles.js';
import MovimientoList from '../Movimientos/MovimientoList.jsx';
import { createColorTransition } from '../../utils.js';
import chroma from 'chroma-js';
import { Picker } from '@react-native-picker/picker'

const { width } = Dimensions.get('window');
const Tab = createMaterialTopTabNavigator();
function HomeTab({ keyId, setKeyId, keys }) {
  const navigation = useNavigation();
  const [key, setKey] = useState()
  const handleKeyId = (itemValue) => {
    setKeyId(itemValue); // Establece keyId en el estado
    navigation.setParams({ keyId: itemValue }); // Asegúrate de que se actualice el parámetro
  };
  const truncateLabel = (name, description, maxLength) => {
    const combined = `${name}${description ? (' - ' + description) : ''}`;
    if (combined.length > maxLength) {
      return `${combined.slice(0, maxLength - 3)}...`; // Resta 3 para el ellipsis
    }
    return combined;
  };
  useEffect(() => {
    if (keyId) {
      const key = keys.find(key => key.id_key === keyId);
      setKey(key)
      navigation.setParams({ keyId });
    }
  }, [keyId, navigation]);
  const { animateTo, interpolatedColor } = useMemo(() => createColorTransition(
    [theme.colors.primaryGasto, theme.colors.primaryResumen, theme.colors.primaryIngreso], // Colores para la animación principal
    500,
  ), []);
  return (
    <>
      <Animated.View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: interpolatedColor }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              marginTop: 30, marginLeft: 10,
              backgroundColor: interpolatedColor,  // Cambiar color de fondo del botón
              borderRadius: 50, // Ajusta el radio si lo necesitas
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Animated.Text style={{ color: theme.colors.white }}>
              <Ionicons name="menu" size={40} />
            </Animated.Text>
            <Text style={{ color: theme.colors.white, fontSize: theme.fontSizes.ingresar }}>Menu</Text>

          </TouchableOpacity>
        </View>
        {key && (
          <View style={{
            color: theme.colors.white,
            width: width - 55,
            fontSize: 20,
            fontWeight: theme.fontWeights.bold,
            marginTop: 30,
          }}>
            <Picker
              selectedValue={keyId}
              onValueChange={handleKeyId}
              mode={'dialog'}
              dropdownIconColor={theme.colors.white}
              numberOfLines={2}
              style={{
                flex: 1,
                alignContent: 'center',
                fontSize: theme.fontSizes.ingresar,
                height: 40,
                marginHorizontal: 10,
                color: theme.colors.white
              }}
            >
              {keys.map((key, index) => (
                <Picker.Item
                  key={key.id_key} // Usa key_id como clave
                  label={truncateLabel(key.nombre, key.descripcion, 200)} // Muestra el nombre y la descripción
                  value={key.id_key} // Usa key_id como valor
                  style={{
                    color: index % 2 === 0 ? theme.colors.pieBackground : theme.colors.pieInner // Alterna entre primary y secondary
                  }}
                />
              ))}
            </Picker>
          </View>
        )}
      </Animated.View>


      <View style={{ position: 'absolute', zIndex: 2 }}>
        <Animated.View
          style={{
            backgroundColor: interpolatedColor, // Color de fondo animado
            position: 'absolute',
            top: Dimensions.get('window').height - 80,
            left: width / 2 - 80 / 2, // Centrado dinámico
            borderRadius: 50,
            borderWidth: 4,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 5,
            elevation: 8,
            height: 80,
            width: 80,
            justifyContent: 'center', // Centrado vertical
            alignItems: 'center', // Centrado horizontal
          }}
        >

          <TouchableOpacity
            onPress={() => navigation.jumpTo(`Resumen`)}
            activeOpacity={1}
            style={{
              height: '100%', // Ocupa toda la altura
              width: '100%',  // Ocupa toda la anchura
              justifyContent: 'center', // Centrado vertical del contenido
              alignItems: 'center', // Centrado horizontal del contenido
            }}
          >
            <Animated.Text style={{ color: theme.colors.white }}>
              <Ionicons name="stats-chart" size={40} />
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Tab.Navigator
        initialRouteName="Resumen"
        tabBarPosition='bottom'
        screenOptions={({ route }) => ({
          tabBarAndroidRipple: { borderless: false, radius: 0 },
          tabBarStyle: { backgroundColor: interpolatedColor },
          tabBarLabelStyle: { fontSize: theme.fontSizes.ingresar },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Gastos') {
              iconName = focused ? 'trending-down-outline' : 'trending-down-outline';
            } else if (route.name === 'Ingresos') {
              iconName = focused ? 'trending-up-outline' : 'trending-up-outline';
            }
            return <Ionicons name={iconName} size={theme.fontSizes.body} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.white,
          tabBarInactiveTintColor: theme.colors.white,
        })}
        screenListeners={{
          state: (e) => {
            const routeIndex = e.data.state.index;
            animateTo(routeIndex);

          },
        }}
      >
        <Tab.Screen
          name="Gastos"
          children={() => <MovimientoList keyId={keyId} routeParams={{ tipo: 'salidas' }} />}
          options={{ tabBarLabel: 'Salidas' }}
        />
        <Tab.Screen
          name="Resumen"
          children={() => <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 300 }}><Text style={{ color: theme.colors.pieInner, fontSize: theme.fontSizes.body, fontWeight: theme.fontWeights.bold }}>Proximamente Resumenes</Text></View>}
          options={{ tabBarLabel: 'Resumen' }}
        />
        <Tab.Screen
          name="Ingresos"
          children={() => <MovimientoList keyId={keyId} routeParams={{ tipo: 'entradas' }} />}
          options={{ tabBarLabel: 'Entradas' }}
        />
      </Tab.Navigator>
    </>
  );
}

export default HomeTab
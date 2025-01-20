import { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import theme from '../../theme/theme.js';
import { View, Text, TouchableOpacity } from 'react-native';
import { styleComun } from '../../styles/styles.js';
import MovimientoList from '../Movimientos/MovimientoList.jsx';
import BotonDesplazable from './BotonDesplazable.jsx';
import PickerModal from './PickerModal.jsx';

const Tab = createMaterialTopTabNavigator();
function HomeTab({ keyId, handleKeyId, keys, nombreKey='Cargando...', navigation }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
    

  return (
    <>
      <View style={{ flexDirection: 'row', backgroundColor: theme.colors.primary, paddingTop: 45, paddingBottom: 8, alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Icon name="menu" size={40} color={theme.colors.white} />

          </TouchableOpacity>
        </View>

        <View style={styleComun.keys.container}>
          <TouchableOpacity
            style={styleComun.keys.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styleComun.keys.buttonText}>
              {nombreKey}
            </Text>
            <Icon name="menu-down" size={20} color={theme.colors.white} style={{ marginLeft: 10 }} />
          </TouchableOpacity>

        </View>
      </View>
      {keys && <PickerModal keys={keys} modalVisible={modalVisible} setModalVisible={setModalVisible} handleKeyId={handleKeyId} navigation={navigation} keyId={keyId} nombreKey={nombreKey} />}

      <BotonDesplazable theme={theme} navigation={navigation} activeIndex={activeIndex} />

      <Tab.Navigator
        initialRouteName="Resumen"
        tabBarPosition='bottom'
        screenOptions={({ route }) => ({
          tabBarAndroidRipple: { borderless: false, radius: 0 },
          tabBarStyle: { backgroundColor: theme.colors.primary },
          tabBarLabelStyle: { fontSize: theme.fontSizes.ingresar },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Gastos') {
              iconName = focused ? 'trending-down' : 'trending-down';
            } else if (route.name === 'Ingresos') {
              iconName = focused ? 'trending-up' : 'trending-up';
            } else if (route.name === 'Resumen') {
              iconName = focused ? 'poll' : 'poll';
            }
            return <Icon name={iconName} size={theme.fontSizes.body} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.whiteWhite,
          tabBarInactiveTintColor: theme.colors.gray,
        })}
        screenListeners={{
          state: (e) => {
            const newIndex = e.data.state.index;
            setActiveIndex(newIndex);
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
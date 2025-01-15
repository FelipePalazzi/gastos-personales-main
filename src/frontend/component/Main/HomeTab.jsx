import { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons.js'
import theme from '../../theme/theme.js';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styleComun } from '../../styles/styles.js';
import MovimientoList from '../Movimientos/MovimientoList.jsx';
import BotonDesplazable from './BotonDesplazable.jsx';
import PickerModal from './PickerModal.jsx';

const Tab = createMaterialTopTabNavigator();
function HomeTab({ keyId, setKeyId, keys }) {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(1); 
  const [modalVisible, setModalVisible] = useState(false); 

  const [key, setKey] = useState()
  const handleKeyId = (itemValue) => {
    setKeyId(itemValue); 
    navigation.setParams({ keyId: itemValue }); 
  };

  useEffect(() => {
    if (keyId) {
      const key = keys.find(key => key.id_key === keyId);
      setKey(key)
      navigation.setParams({ keyId });
    }
  }, [keyId, navigation]);

  return (
    <>
      <View style={{ flexDirection: 'row', backgroundColor: theme.colors.primary, paddingTop:45,paddingBottom:8, alignItems: 'center'  }}>
        <View style={{ alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={40} color={theme.colors.white} />

          </TouchableOpacity>
        </View>

 <View style={styleComun.keys.container}>
      <TouchableOpacity
        style={styleComun.keys.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styleComun.keys.buttonText}>
          {key ? key.nombre : 'Selecciona una Key'}
        </Text>
        <Ionicons name="caret-down" size={14} color={theme.colors.white} style={{marginLeft:10}} />
      </TouchableOpacity>

      </View>
      </View>
  {keys && <PickerModal keys={keys} modalVisible={modalVisible} setModalVisible={setModalVisible} handleKeyId={handleKeyId}/> }
      
      <BotonDesplazable theme={theme} navigation={navigation} activeIndex={activeIndex}/>

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
              iconName = focused ? 'trending-down-outline' : 'trending-down-outline';
            } else if (route.name === 'Ingresos') {
              iconName = focused ? 'trending-up-outline' : 'trending-up-outline';
            } else if (route.name === 'Resumen') {
              iconName = focused ? 'stats-chart' : 'stats-chart';
            }
            return <Ionicons name={iconName} size={theme.fontSizes.body} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.whiteWhite,
          tabBarInactiveTintColor: theme.colors.gray,
        })}
        screenListeners={{
          state: (e) => {
            const newIndex = e.data.state.index; // Índice de la pestaña activa
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
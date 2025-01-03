import { useEffect } from 'react';
import GastoList from "../Gastos/GastosList.jsx";
import IngresoList from "../Ingresos/IngresosList.jsx";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme.js';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
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
          initialRouteName="Gastos"
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
            tabBarActiveTintColor: theme.colors.textPrimary,
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
  
  export default HomeTab
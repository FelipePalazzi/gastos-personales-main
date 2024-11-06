import  GastoList  from "./Gastos/GastosList.jsx";
import AgregarGasto from "./Gastos/GastoForm.jsx";
import  IngresoList  from "./Ingresos/IngresosList.jsx";
import AgregarIngreso from "./Ingresos/IngresoForm.jsx";
import Resumen from "./Resumen/Resumen.jsx";
import LoginScreen from "./Login/Login.jsx";
import Register from "./Login/Register.jsx";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../styles/theme.js';
import { styleForm } from '../styles/styles.js'
import { View, ActivityIndicator, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeTab() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIconStyle: {marginTop: 40 },
            tabBarAndroidRipple: { borderless: false , radius:25},
            tabBarStyle: {backgroundColor: theme.colors.primary},
            tabBarLabelStyle: { fontSize: theme.fontSizes.ingresar},
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Resumen') {
                iconName = focused ? 'stats-chart' : 'stats-chart';
              } else if (route.name ==='Gastos') {
                iconName = focused ? 'trending-down-outline' : 'trending-down-outline';
              } else if (route.name ==='Ingresos') {
                iconName = focused ? 'trending-up-outline' : 'trending-up-outline';
              }
              return <Ionicons name={iconName} size={theme.fontSizes.body} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.pieBackground,
            tabBarInactiveTintColor: theme.colors.disabled,
          })}>
          {/*<Tab.Screen name="Profile" component={LoginScreen} />*/}
          <Tab.Screen name="Resumen" component={GastoList} />
          <Tab.Screen name="Gastos" component={GastoList} />
          <Tab.Screen name="Ingresos" component={IngresoList} />
        </Tab.Navigator>

    );
  }

const Main= () => {
  const navigation = useNavigation();
      return (
        <HomeStack.Navigator screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarItemStyle: { width: 100 },
          tabBarStyle: { backgroundColor: 'powderblue' },
      }}>
       <HomeStack.Screen 
            name="Login" 
            options={{ headerShown: false }}
            component={LoginScreen} 
       />
                  <HomeStack.Screen name="HomeTab" component={HomeTab} options={{ headerShown: false }} />
                  <HomeStack.Screen name="GastoForm" component={AgregarGasto} options={{
                      headerRight: () => (
                        <Button
                        onPress={() => navigation.navigate('Login')}
                          title="Info"
                          color="#fff"
                        />
                      ),

                      contentStyle: { marginTop: 10 },
                      title: 'Formulario Gasto',
                      headerStyle: { backgroundColor: theme.colors.primary },
                      headerTitleStyle: [styleForm.loadingText, { color: theme.colors.white }],
                      headerTitleAlign: 'center'
                  }} />
                  <HomeStack.Screen name="IngresoForm" component={AgregarIngreso} />
                  <HomeStack.Screen name="Register" component={Register} />
      </HomeStack.Navigator>
    )
}

export default Main
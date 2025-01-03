import AgregarGasto from "../Gastos/GastoForm.jsx";
import AgregarIngreso from "../Ingresos/IngresoForm.jsx";
import LoginScreen from "../Login/Login.jsx";
import Register from "../Login/Register.jsx";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import theme from '../../theme/theme.js';
import { useNavigation } from '@react-navigation/native';
import CreacionEntidades from '../Creacion/CreacionEntidades.jsx';
import DrawerNavigator from "./DrawerNavigator.jsx";

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  const navigation = useNavigation();
  return (
    <HomeStack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.colors.primary }, headerTitleStyle: { color: theme.colors.white }, headerTintColor: theme.colors.white }}>
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
      <HomeStack.Screen name="GastoForm" component={AgregarGasto} options={({ route }) => ({
        headerTitle: route.params?.labelHeader
          ? route.params.labelHeader
          : 'Creación de Entidades',
      })} />
      <HomeStack.Screen name="IngresoForm" component={AgregarIngreso} />
      <HomeStack.Screen name="Register" component={Register} />
      <HomeStack.Screen name="CreacionEntidades" component={CreacionEntidades} options={({ route }) => ({
        headerTitle: route.params?.labelHeader
          ? route.params.labelHeader
          : 'Creación de Entidades',
      })} />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
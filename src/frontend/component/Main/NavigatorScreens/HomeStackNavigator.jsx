import LoginScreen from "../../Login/Login.jsx";
import Register from "../../Login/Register.jsx";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import theme from '../../../theme/theme.js';
import DrawerNavigator from "./DrawerNavigator.jsx";

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.colors.primary }, headerTitleStyle: { color: theme.colors.white }, headerTintColor: theme.colors.white }}>
      <HomeStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: "slide_from_left",
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
          animation: "slide_from_bottom"
        }}
      />
      <HomeStack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{
          animation: "slide_from_right",
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
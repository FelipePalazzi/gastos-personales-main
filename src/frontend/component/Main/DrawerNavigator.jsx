import { useState, useEffect } from 'react';
import theme from '../../theme/theme.js';
import useGetKeys from '../../hooks/useGetKeys.js';
import CustomDrawerContent from './CustomDrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTab from './HomeTab.jsx';
import LoadingScreen from '../Loading/LoadingScreen.jsx';
import { styleDrawer } from '../../styles/styles.js';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { getkeys, loading, fetchGetKeys } = useGetKeys();
  const [keyId, setKeyId] = useState(null);

  useEffect(() => {
    const loadKeys = async () => {
      await fetchGetKeys();
    };
    loadKeys();
  }, []);
  useEffect(() => {
    if (getkeys.length > 0) {
      setKeyId(getkeys[0].id_key)
    }
  }, [getkeys]);

  return (
    <Drawer.Navigator
      drawerContent={() => (
        <CustomDrawerContent
          keyId={keyId}
        />
      )}
      screenOptions={{
        drawerStyle: styleDrawer.drawerStyle,
        drawerActiveTintColor: theme.colors.pieBackground,
        drawerInactiveTintColor: theme.colors.disabled,
      }}
    >
      <Drawer.Screen
        name="HomeTab"
        options={{ headerShown: false }}
      >
        {(props) => keyId && <HomeTab {...props} keyId={keyId} setKeyId={setKeyId} keys={getkeys} /> || <LoadingScreen Nombre={"Datos"} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
export default DrawerNavigator
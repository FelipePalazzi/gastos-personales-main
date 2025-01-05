import { useState, useEffect } from 'react';
import theme from '../../theme/theme.js';
import useGetKeys from '../../hooks/useGetKeys.js';
import CustomDrawerContent from './CustomDrawerContent'; 
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTab from './HomeTab.jsx';

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
        setKeyId(getkeys[0].id_key);
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
  export default DrawerNavigator
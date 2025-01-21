import { useState, useEffect, useCallback } from 'react';
import theme from '../../theme/theme.js';
import useGetKeys from '../../hooks/useGetKeys.js';
import CustomDrawerContent from './CustomDrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTab from './HomeTab.jsx';
import LoadingScreen from '../Comunes/Loading/LoadingScreen.jsx';
import { styleDrawer } from '../../styles/styles.js';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InvitacionesListKeys from '../Invitaciones/InvitacionesListKeys.jsx';
import { useNavigate } from 'react-router-native';
import InvitacionesListUser from '../Invitaciones/InvitacionesListUser.jsx';


const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { getkeys, loading, fetchGetKeys } = useGetKeys();
  const [keyId, setKeyId] = useState(null);
  const [nombreKey, setNombreKey] = useState('Selecciona una Key');
  const navigation = useNavigate()

  useFocusEffect(
    useCallback(() => {
      const loadKeysOnFocus = async () => {
        try {
          await fetchGetKeys();
        } catch (error) {
          console.error('Error cargando las keys:', error);
          navigation.navigate('Login')
        }
      };
      loadKeysOnFocus();
    }, [])
  );

  useEffect(() => {
    const getKeyId = async () => {
      try {
        const storedKeyId = await AsyncStorage.getItem('keyId');
        if (!keyId && storedKeyId !== null) {
          setKeyId(storedKeyId);
        } else if (!storedKeyId && getkeys.length > 0) {
          const firstKey = getkeys[0];
          if (firstKey) {
            setKeyId(firstKey.id_key); 
          }
        } else if (!storedKeyId) {
          setNombreKey('Seleccione una key...');
        }
      } catch (error) {
        console.log('Error fetching keyId:', error);
      }
    };

    getKeyId();
  }, [getkeys]); 

  useEffect(() => {
    if (keyId && getkeys.length>0) {
      const key = getkeys.find((key) => Number(key.id_key) === Number(keyId));
      setNombreKey(key ? key.nombre : 'Key no encontrada. Seleccione otra');
    }
  }, [keyId, getkeys]);

  const handleKeyId = async (itemValue) => {
    setKeyId(itemValue);
    try {
      await AsyncStorage.setItem('keyId', itemValue.toString());
    } catch (error) {
      console.log('Error saving keyId:', error);
    }
    navigation.setParams({ keyId: itemValue });
  };

  return (
    <Drawer.Navigator
      drawerContent={() => (
        <CustomDrawerContent
          keyId={keyId}
          nombreKey={nombreKey}
        />
      )}
      screenOptions={{
        drawerStyle: styleDrawer.drawerStyle,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.disabled,
      }}
    >
      <Drawer.Screen
        name="HomeTab"
        options={{ headerShown: false }}
      >
        {(props) => <HomeTab {...props} keyId={keyId} handleKeyId={handleKeyId} keys={getkeys} nombreKey={nombreKey} /> || <LoadingScreen Nombre={"Datos"} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Invitacioneskey"
        options={{ headerShown: false, animation: "slide" }}
      >
        {(props) => <InvitacionesListKeys {...props} keyId={keyId} handleKeyId={handleKeyId} keys={getkeys} nombreKey={nombreKey} /> || <LoadingScreen Nombre={"Invitaciones"} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Invitacionesuser"
        options={{ headerShown: false, animation: "slide" }}
      >
        {(props) => <InvitacionesListUser {...props}/> || <LoadingScreen Nombre={"Invitaciones"} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
export default DrawerNavigator
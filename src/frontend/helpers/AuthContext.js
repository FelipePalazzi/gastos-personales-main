import React, { createContext, useState, useContext, useCallback } from 'react';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [usernameLogeado, setUsernameLogeado] = useState(null);

  const saveTokensAndUser = useCallback(async (access, refresh, username) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setUsernameLogeado(username);

    // Guardar refreshToken en Keychain
    await Keychain.setGenericPassword('refreshToken', refresh, {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      authenticationPrompt: {
        title: 'Autenticación requerida',
        subtitle: 'Inicia sesión usando tu biometría',
      },
    });

    // Guardar username en AsyncStorage
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      console.error('Error guardando el usuario:', error);
    }
  }, []);

  const clearTokensAndUser = useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUsernameLogeado(null);

    await Keychain.resetGenericPassword();
    try {
      await AsyncStorage.removeItem('username');
    } catch (error) {
      console.error('Error eliminando el usuario:', error);
    }
  }, []);

  const getSavedUser = useCallback(async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      return username || null;
    } catch (error) {
      console.error('Error recuperando el usuario:', error);
      return null;
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        console.error('No refresh token found');
        return false; 
      }
  
      const refreshToken = credentials.password;
  
      const response = await fetch(`${PAGINA_URL_ENV}/refreshTokens`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'refresh-token': refreshToken 
        },
      });
  console.log(response)
      if (!response.ok) {
        console.error('Error refreshing access token');
        return false;
      }
  
      // Obtener la respuesta como JSON, que ya contiene los tokens
      const data = await response.json();
  
      if (data.error) {
        console.error('Error: ', data.error);
        return false;
      }
  
      setAccessToken(data.accessToken); 
      setRefreshToken(data.refreshToken); 
      return true; 
  
    } catch (error) {
      console.error('Error during token refresh:', error);
      return false; 
    }
  }, []);

  
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        usernameLogeado,
        saveTokensAndUser,
        clearTokensAndUser,
        getSavedUser,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

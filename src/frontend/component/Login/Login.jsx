import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import { alerts, button_text, atributos, symbols, pagina } from '../../../constants.js';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Dialog, Portal, TextInput, } from 'react-native-paper'
import { styleComun, styleForm } from '../../styles/styles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme.js';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;
import { useAuth } from '../../helpers/AuthContext.js';
import * as Keychain from 'react-native-keychain';
import LoadingScreen from '../Comunes/Loading/LoadingScreen.jsx';
import Error from './Dialogs/Error.jsx';
import Correcto from './Dialogs/Correcto.jsx';
import Logout from './Dialogs/Logout.jsx';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visibleOK, setvisibleOK] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [visibleError, setVisibleError] = useState(false);
  const [message, setMessage] = useState([]);
  const [fingertip, setFingertip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrarse, setRegistrarse] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState([]);
  const navigation = useNavigation();
  const { accessToken, refreshAccessToken, saveTokensAndUser, clearTokensAndUser, getSavedUser } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${PAGINA_URL}${symbols.barra}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        saveTokensAndUser(accessToken, refreshToken, username);
        setNombreUsuario(username)
        setvisibleOK(true)
        setFingertip(true)
        setRegistrarse(false)
        setLoading(false)
        setUsername('')
        setPassword('')
      } else {
        const errorData = await response.text();
        setMessage(errorData)
        setVisibleError(true)
        setLoading(false)
      }
    } catch (error) {
      setVisibleError(true)
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      setLoading(true)
      clearTokensAndUser()
      setVisibleLogout(true)
      setFingertip(false)
      setLoading(false)
      setRegistrarse(true)
    } catch (error) {
      setVisibleError(true)
    }
  };


  useEffect(() => {
    handleAuthentication();
  }, []);

  const handleAuthentication = async () => {
    setLoading(true);
    setRegistrarse(true);

    const credentials = await Keychain.getGenericPassword();
    const username = await getSavedUser();

    if (!credentials || !username) {
      setFingertip(false);
      setRegistrarse(true);
      setLoading(false);
      return;
    }

    const { password: refreshToken } = credentials;

    const biometricSupported = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    setUsername('');
    setPassword('');
    setFingertip(true);
    setNombreUsuario(username);
    setRegistrarse(false);

    if (biometricSupported && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticarse con huella dactilar',
        fallbackLabel: 'Usar contraseña',
      });

      if (result.success) {
        if (!accessToken) {
          const refreshed = await refreshAccessToken();
        }
        setLoading(false);
        setMessage(null)
        navigation.navigate('Drawer');
      } else {
        setMessage(null)
        setLoading(false);
        setVisibleError(true)
      }
    } else {
      setMessage(null)
      setLoading(false);
      setVisibleError(true)
      setFingertip(false);
    }
  };


  return (
    <View style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
      {loading ? (
        <LoadingScreen Nombre={"Login"} />
      ) : (
        <View style={{ marginTop: 160, marginHorizontal: 10, backgroundColor: theme.colors.white, borderColor: theme.colors.gray, borderRadius: 5, borderWidth: 2 }}>

          <View style={{ justifyContent: 'center', paddingHorizontal: 161, marginTop: 10 }}>
            <Icon.Button backgroundColor={theme.colors.transparente} name={'account-circle'} size={30} color={theme.colors.primary} iconStyle={{ marginRight: 0 }} />
          </View>
          {fingertip && (<View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ fontSize: theme.fontSizes.body, fontWeight: theme.fontWeights.bold, color: theme.colors.primary }}>{`Bienvenido de vuelta`}</Text>
            <Text style={{ fontSize: theme.fontSizes.body, fontWeight: theme.fontWeights.bold, color: theme.colors.primary }}>{`${nombreUsuario}`}</Text>
          </View>)}
          {!fingertip && (<View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ fontSize: theme.fontSizes.body, fontWeight: theme.fontWeights.bold, color: theme.colors.primary }}>{`Inicio de Sesion`}</Text>
          </View>)}

          <View style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
            <TextInput
            textContentType='username'
              mode='outlined'
              value={username}
              onChangeText={setUsername}
              placeholder={"Ingrese nombre de usuario..."}
              style={styleComun.text_input}
              label="Nombre de Usuario"
              textColor={theme.colors.primary}
              outlineColor={theme.colors.primary}
              activeOutlineColor={theme.colors.primary}
              theme={{ colors: { onSurfaceVariant:theme.colors.primary } }}
            />
          </View>
          <View style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
            <TextInput
            textContentType='password'
              mode='outlined'
              placeholder="Ingrese contraseña..."
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              style={styleComun.text_input}
              label="Password"
              textColor={theme.colors.primary}
              outlineColor={theme.colors.primary}
              activeOutlineColor={theme.colors.primary}
              theme={{ colors: { onSurfaceVariant:theme.colors.primary } }}
              right={<TextInput.Icon color={theme.colors.primary} icon={secureTextEntry ? "eye-off" : 'eye'} onPress={() => setSecureTextEntry(!secureTextEntry)} style={{ marginTop: 30 }} />}
            />
          </View>
          <View style={{ paddingHorizontal: 10, marginBottom: 20, justifyContent: 'center' }}>
            <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={'login'} onPress={handleLogin} size={30} iconStyle={{ marginRight: 110 }}>{'Acceder'}</Icon.Button>
          </View>
          <View style={styleForm.rowButton}>
            <View style={styleForm.button}>
              <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={fingertip ? 'fingerprint' : 'fingerprint-off'} onPress={handleAuthentication} size={30} iconStyle={{ marginRight: 0 }} />
            </View>
            {registrarse && (<View style={{ paddingHorizontal: 10, marginLeft: 50, marginRight: 3, justifyContent: 'flex-start' }}>
              <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={'account-plus'} onPress={() => navigation.navigate('Register')} size={30} iconStyle={{ marginRight: 0 }} />
            </View>)}
            {!registrarse && (<View style={{ paddingHorizontal: 10, marginLeft: 50, marginRight: 3, justifyContent: 'flex-start' }}>
              <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={'logout'} onPress={logout} size={30} iconStyle={{ marginRight: 0 }} />
            </View>)}

          </View>

          <Correcto visible={visibleOK} setVisible={setvisibleOK} navigation={navigation} nombreUsuario={nombreUsuario} />

          <Logout visible={visibleLogout} setVisible={setVisibleLogout} />

          <Error visible={visibleError} setVisible={setVisibleError} message={message} />

        </View>
      )}
    </View>
  );
};

export default LoginScreen;

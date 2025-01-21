import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { symbols } from '../../../constants.js';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { TextInput, } from 'react-native-paper'
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
import { decodeTokenUsername } from '../../utils.js';
import PinInput from './PinInput.jsx'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
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
  const { accessToken, refreshToken, refreshAccessToken, saveTokensAndUser, clearTokensAndUser, getSavedUser } = useAuth();
  const [requestPin, setRequestPin] = useState(false);
  const [pin, setPin] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${PAGINA_URL}${symbols.barra}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        const username = decodeTokenUsername(accessToken)
        saveTokensAndUser(accessToken, refreshToken, username);
        setNombreUsuario(username)
        setvisibleOK(true)
        setFingertip(true)
        setRegistrarse(false)
        setLoading(false)
        setEmail('')
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
      setRequestPin(false)
      clearTokensAndUser()
      await AsyncStorage.removeItem('keyId');
      setVisibleLogout(true)
      setFingertip(false)
      setLoading(false)
      setRegistrarse(true)
    } catch (error) {
      setVisibleError(true)
    }
  };

  const handlePin = async (pin, retried = false) => {
    try {
      setLoading(true);
      const response = await fetch(`${PAGINA_URL}${symbols.barra}validarPin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'refresh-token': refreshToken,
        },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        if (response.status === 403 && !retried) {
          const tokenRefreshed = await refreshAccessToken();
          if (tokenRefreshed) {
            setLoading(false);
            return handlePin(pin, true);
          } else {
            const errorData = await response.text();
            console.error('Error al validar el PIN:', errorData.message || 'Error desconocido');
            setMessage(errorData.message || 'Error al validar el PIN.');
            setVisibleError(true);
            setLoading(false);
            return;
          }
        }
      }
      setRequestPin(false);
      setLoading(false);
      setMessage('Correcto');
      navigation.navigate('Drawer');
    } catch (error) {
      console.error('Error en la validación del PIN:', error.message || error);
      setMessage(error.message || 'Ocurrió un error al validar el PIN.');
      setVisibleError(true);
      setLoading(false);
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

    const biometricSupported = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setLoading(false);
    setRequestPin(true)
    setEmail('');
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
        setRequestPin(false)
        setLoading(false);
        setMessage(null)
        navigation.navigate('Drawer');
      }
    } else {
      setLoading(false)
      setMessage(null)
      setFingertip(false);
    }
  };

  const onValidatePin = (pin) => {
    handlePin(pin)
  }

  const renderEmailPasswordForm = () => (
    <>
      <View style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
        <TextInput
          textContentType='email'
          mode='outlined'
          value={email}
          onChangeText={setEmail}
          placeholder={"Ingrese email..."}
          style={styleComun.text_input}
          label="Email"
          textColor={theme.colors.primary}
          outlineColor={theme.colors.primary}
          activeOutlineColor={theme.colors.primary}
          theme={{ colors: { onSurfaceVariant: theme.colors.primary } }}
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
          theme={{ colors: { onSurfaceVariant: theme.colors.primary } }}
          right={<TextInput.Icon color={theme.colors.primary} icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={() => setSecureTextEntry(!secureTextEntry)} style={{ marginTop: 30 }} />}
        />
      </View>
    </>
  )

  return (
    <View style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
      {loading ? (
        <LoadingScreen Nombre={"Login"} />
      ) : (
        <View style={{ marginTop: requestPin ? 120 : 160, marginHorizontal: 10, backgroundColor: theme.colors.white, borderColor: theme.colors.gray, borderRadius: 5, borderWidth: 2 }}>

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
          {requestPin ? <PinInput onValidatePin={onValidatePin} title={'Ingresa tu PIN'}/> : renderEmailPasswordForm()}
          {!requestPin && <View style={{ paddingHorizontal: 10, marginBottom: 20, justifyContent: 'center' }}>
            <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={'login'} onPress={handleLogin} size={30} iconStyle={{ marginRight: 110 }}>{'Acceder'}</Icon.Button>
          </View>}
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

import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import { alerts, button_text, atributos, symbols, pagina } from '../../../constants.js';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Dialog, Portal, TextInput, } from 'react-native-paper'
import { styleForm } from '../../styles/styles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme.js';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;
import { useAuth } from '../../helpers/AuthContext.js';
import * as Keychain from 'react-native-keychain';

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
  const [nombreUsuario, setNombreUsuario] = useState([]);
  const navigation = useNavigation();
  const { accessToken, refreshAccessToken,saveTokensAndUser, clearTokensAndUser, getSavedUser} = useAuth();
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
        setLoading(false)
        setRegistrarse(false)
        setUsername('')
        setPassword('')
      } else {
        const errorData = await response.text();
        setMessage(errorData)
        setVisibleError(true)
        setLoading(false)
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión');
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
      console.error("Error al cerrar sesión", error);
      Alert.alert('Error', 'No se pudo cerrar la sesión');
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
    setLoading(false);
    setFingertip(false);
    setRegistrarse(true); // Muestra la opción de login
    console.log('No se encontró refresh token o usuario almacenado.');
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
        if (!refreshed) {
          throw new Error('No se pudo obtener el nuevo accessToken');
        }
      }
      setLoading(false);
      navigation.navigate('Drawer');
    } else {
      setLoading(false);
      Alert.alert('Error', 'Autenticación fallida.');
    }
  } else {
    Alert.alert('Error', 'La biometría no está soportada o no hay huellas registradas');
    setLoading(false);
    setFingertip(false);
  }
};


  return (
    <View style={{ backgroundColor: theme.colors.pieBackground, flex: 1 }}>
      {loading ? (
        <View style={{ marginTop: 160, marginHorizontal: 10, backgroundColor: theme.colors.disabled, borderColor: theme.colors.gray, borderRadius: 5, borderWidth: 2, paddingBottom: 170 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 160 }}>
            <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
            <Text style={styleForm.loadingText}>{alerts.cargando}</Text>
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 160, marginHorizontal: 10, backgroundColor: theme.colors.disabled, borderColor: theme.colors.gray, borderRadius: 5, borderWidth: 2 }}>

          <View style={{ justifyContent: 'center', paddingHorizontal: 161, marginTop: 10 }}>
            <Icon.Button backgroundColor={theme.colors.transparente} name={'account-circle'} size={30} color={theme.colors.textSecondary} iconStyle={{ marginRight: 0 }} />
          </View>
          {fingertip && (<View style={[styleForm.loadingContainer, { padding: 0, marginBottom: 15 }]}>
            <Text style={[styleForm.loadingText, { color: theme.colors.textSecondary }]}>{`Bienvenido de vuelta`}</Text>
            <Text style={[styleForm.loadingText, { color: theme.colors.textSecondary }]}>{`${nombreUsuario}`}</Text>
          </View>)}
          {!fingertip && (<View style={[styleForm.loadingContainer, { padding: 0, marginBottom: 15 }]}>
            <Text style={[styleForm.loadingText, { color: theme.colors.textSecondary }]}>{`Inicio de Sesion`}</Text>
          </View>)}
          
          <View style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
            <TextInput
              mode='outlined'
              value={username}
              onChangeText={setUsername}
              placeholder={"Nombre de usuario"}
              style={styleForm.text_input}
            />
          </View>
          <View style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
            <TextInput
              mode='outlined'
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styleForm.text_input}
            />
          </View>
          <View style={{ paddingHorizontal: 10, marginBottom: 20, justifyContent: 'center' }}>
            <Icon.Button backgroundColor={theme.colors.textSecondary} name={'login'} onPress={handleLogin} size={30} iconStyle={{ marginRight: 110 }}>{'Acceder'}</Icon.Button>
          </View>
          <View style={styleForm.rowButton}>
            <View style={styleForm.button}>
              <Icon.Button backgroundColor={fingertip && theme.colors.pieInner || theme.colors.delete} name={fingertip && 'fingerprint' || 'fingerprint-off'} onPress={handleAuthentication} size={30} iconStyle={{ marginRight: 0 }} />
            </View>
            {registrarse && (<View style={{ paddingHorizontal: 10, marginLeft: 50, justifyContent: 'flex-start' }}>
              <Icon.Button backgroundColor={theme.colors.agregar} name={'account-plus'} onPress={() => navigation.navigate('Register')} size={30} iconStyle={{ marginRight: 10 }}>{'Registrarse'}</Icon.Button>
            </View>)}
            {!registrarse && (<View style={{ paddingHorizontal: 10, marginLeft: 50, justifyContent: 'flex-start' }}>
              <Icon.Button backgroundColor={theme.colors.cancelar} name={'logout'} onPress={logout} size={30} iconStyle={{ marginRight: 0 }}>{'Cerrar sesión'}</Icon.Button>
            </View>)}

          </View>

          <Portal>
            <Dialog visible={visibleOK} onDismiss={() => [navigation.navigate(`Drawer`), setvisibleOK(false)]}>
              <Dialog.Icon icon={'account-check'} />
              <Dialog.Title style={styleForm.title}>{'Inicio de sesion correcto'}</Dialog.Title>
              <Dialog.Content>
                <Text style={styleForm.dateText}>{`Bienvenido ${nombreUsuario}!`}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Icon.Button name={'check'} onPress={() => [navigation.navigate(`Drawer`), setvisibleOK(false)]}>{'Entrar'}</Icon.Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Portal>
            <Dialog visible={visibleLogout} onDismiss={() => setVisibleLogout(false)}>
              <Dialog.Icon icon={'hand-wave'} />
              <Dialog.Title style={styleForm.title}>{'Sesion cerrada con exito'}</Dialog.Title>
              <Dialog.Actions>
                <Icon.Button name={'thumb-up-outline'} onPress={() => setVisibleLogout(false)}>{'Ok'}</Icon.Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Portal>
            <Dialog visible={visibleError} onDismiss={() => setVisibleError(false)}>
              <Dialog.Icon icon={'alert-octagon'} />
              <Dialog.Title style={styleForm.title}>{`${'Error con las credenciales'}`}</Dialog.Title>
              <Dialog.Content>
                <Text style={styleForm.dateText}>{`${message}`}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Icon.Button name={'alert-circle-check'} onPress={() => setVisibleError(false)}>{'Ok'}</Icon.Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

        </View>
      )}
    </View>
  );
};

export default LoginScreen;

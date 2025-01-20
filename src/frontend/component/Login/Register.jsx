import React, { useState, useEffect } from 'react';
import { View, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { alerts, symbols } from '../../../constants.js';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Dialog, Portal, TextInput, } from 'react-native-paper'
import { styleForm, styleComun } from '../../styles/styles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme.js';
import LoadingScreen from '../Comunes/Loading/LoadingScreen.jsx';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [visibleOK, setvisibleOK] = useState(false);
  const [visibleError, setVisibleError] = useState(false);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
    setRole('user')
    setLoading(true)
    if (password === passwordConfirm){
        const response = await fetch(`${PAGINA_URL}${symbols.barra}register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role}),
          });
          if (response.ok) {
            const responseLogin = await fetch(`${PAGINA_URL}${symbols.barra}login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
              });
              if (responseLogin.ok) {
            const data = await responseLogin.json();
            await storeTokenSecurely(data.token, username);
            setvisibleOK(true)
            setLoading(false)
        }
          } else {
            const errorData = await response.text();
            setMessage(errorData)
            setVisibleError(true)
            setLoading(false)
          }
    } else {
        setMessage('Contraseñas no coincidentes')
        setVisibleError(true)
        setLoading(false)
    }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión');
      console.error(error);
    }
  };

  const storeTokenSecurely = async (token, username) => {
    try {
      await Keychain.setGenericPassword(username, token, {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        authenticationPrompt: {
          title: 'Autenticación requerida',
          subtitle: 'Inicia sesión usando tu biometría',
        },
      });
      await AsyncStorage.setItem('userToken', token);
    } catch (e) {
      console.error("Error al almacenar el token en Keychain", e);
    }
  };

  const navigation = useNavigation();

  return (
    <View style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
      {loading ? 
            <LoadingScreen Nombre={'Registro'}/>
       : (
        <View style={{ marginTop: 160, marginHorizontal: 10, backgroundColor: theme.colors.white, borderColor: theme.colors.gray, borderRadius: 5, borderWidth: 2 }}>

        <View style={{ justifyContent: 'center', paddingHorizontal: 161, marginTop: 10 }}>
          <Icon.Button backgroundColor={theme.colors.transparente} name={'account-circle'} size={30} color={theme.colors.primary} iconStyle={{ marginRight: 0 }} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
          <Text style={{ fontSize: theme.fontSizes.body, fontWeight: theme.fontWeights.bold, color: theme.colors.primary }}>{`Registrarse`}</Text>
        </View>
          
          <View style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
            <TextInput
              mode='outlined'
              value={username}
              onChangeText={setUsername}
              placeholder={"Nombre de usuario"}
              style={styleComun.text_input}
            />
          </View>
          <View style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
            <TextInput
              mode='outlined'
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styleComun.text_input}
            />
          </View>
          <View style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
            <TextInput
              mode='outlined'
              placeholder="Confirmar Contraseña"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry
              style={styleComun.text_input}
            />
          </View>
          <View style={{ paddingHorizontal: 10, marginBottom: 20, justifyContent: 'center' }}>
            <Icon.Button backgroundColor={theme.colors.textSecondary} name={'login'} onPress={handleRegister} size={30} iconStyle={{ marginRight: 110 }}>{'Registrarse'}</Icon.Button>
          </View>
          <View style={styleForm.rowButton}>
            <View style={{ paddingHorizontal: 10, marginLeft: 130, justifyContent: 'flex-start' }}>
              <Icon.Button backgroundColor={theme.colors.agregar} name={'account-plus'} onPress={() => navigation.navigate('Login')} size={30} iconStyle={{ marginRight: 10 }}>{'Volver'}</Icon.Button>
            </View>

          </View>

          <Portal>
            <Dialog visible={visibleOK} onDismiss={() => [navigation.navigate('Login'), setvisibleOK(false)]}>
              <Dialog.Icon icon={'account-check'} />
              <Dialog.Title style={styleForm.title}>{'Registro correcto'}</Dialog.Title>
              <Dialog.Actions>
                <Icon.Button name={'check'} onPress={() => [navigation.navigate('Login'), setvisibleOK(false)]}>{'Volver'}</Icon.Button>
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

export default Register;

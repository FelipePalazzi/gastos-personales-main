import React, { useState, useEffect } from 'react';
import { View, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { alerts, symbols } from '../../../constants.js';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Dialog, Portal, TextInput, Button } from 'react-native-paper'
import { styleForm, styleComun, screenWidth } from '../../styles/styles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme.js';
import LoadingScreen from '../Comunes/Loading/LoadingScreen.jsx';
import PinRegistration from './PinRegister.jsx';
import Correcto from './Dialogs/Correcto.jsx';
import Error from './Dialogs/Error.jsx';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [visibleOK, setvisibleOK] = useState(false);
  const [visibleError, setVisibleError] = useState(false);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [pin, setPin] = useState('');
  const [pinDialogVisible, setPinDialogVisible] = useState(false);

  const handlePin = (newPin) => {
    setPin(newPin);
    setPinDialogVisible(false);
  };

  const handleRegister = async () => {
    try {
      setRole(3)

      const missingFields = [];
      if (!username) missingFields.push('Nombre de Usuario');
      if (!email) missingFields.push('Email');
      if (!emailConfirm) missingFields.push('Confirmacion del Email');
      if (!password) missingFields.push('Contraseña');
      if (!passwordConfirm) missingFields.push('Confirmacion de la Contraseña');
      if (!pin) missingFields.push('PIN');
    
      if (missingFields.length > 0) {
        const message = missingFields.map((field) => `\n\n→ ${field}`).join('\n');
        setMessage(message);
        setVisibleError(true);
        return;
      }
      setLoading(true)
      if ((password === passwordConfirm) && (email === emailConfirm)) {
        const response = await fetch(`${PAGINA_URL}${symbols.barra}register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, role, pin, email }),
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
            setLoading(false)
            setvisibleOK(true)
          }
        } else {
          const errorData = await response.text();
          setMessage(errorData)
          setVisibleError(true)
          setLoading(false)
        }
      } else {
        if (password !== passwordConfirm) setMessage('Contraseñas no coincidentes')
        if (email !== emailConfirm) setMessage((prev) => [...prev, 'Correo electrónico no coincidente'])
        setVisibleError(true)
        setLoading(false)
      }
    } catch (error) {
      setMessage(error)
      setVisibleError(true)
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

  const registerFields = [
    {
      key: 'username',
      placeholder: 'Nombre de usuario',
      value: username,
      onChangeText: setUsername,
      secureTextEntry: false,
      label: 'Nombre de usuario'
    },
    {
      key: 'password',
      placeholder: 'Contraseña',
      value: password,
      onChangeText: setPassword,
      secureTextEntry: secureTextEntry,
      label: 'Contraseña'
    },
    {
      key: 'passwordConfirm',
      placeholder: 'Confirmar Contraseña',
      value: passwordConfirm,
      onChangeText: setPasswordConfirm,
      secureTextEntry: secureConfirmTextEntry,
      label: 'Confirmación Contraseña'
    },
    {
      key: 'email',
      placeholder: 'Correo electrónico',
      value: email,
      onChangeText: setEmail,
      secureTextEntry: false,
      label: 'Email'
    },
    {
      key: 'emailConfirm',
      placeholder: 'Confirmar Correo electrónico',
      value: emailConfirm,
      onChangeText: setEmailConfirm,
      secureTextEntry: false,
      label: 'Confirmación Email'
    },
  ];

  const renderTextInput = ({ key, placeholder, value, onChangeText, secureTextEntry, label }) => (
    <View key={key} style={[styleForm.rowContainer, { paddingHorizontal: 10 }]}>
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styleComun.text_input}
        label={label}
        textColor={theme.colors.primary}
        outlineColor={theme.colors.primary}
        activeOutlineColor={theme.colors.primary}
        theme={{ colors: { onSurfaceVariant: theme.colors.primary } }}
        right={key === 'password' && <TextInput.Icon color={theme.colors.primary} icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={() => setSecureTextEntry(!secureTextEntry)} style={{ marginTop: 30 }} />
          || key === 'passwordConfirm' && <TextInput.Icon color={theme.colors.primary} icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)} style={{ marginTop: 30 }} />}
      />
    </View>
  );

  return (
    <View style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
      {loading ?
        <LoadingScreen Nombre={'Registro'} />
        : (
          <View style={{ marginTop: 80, marginHorizontal: 10, backgroundColor: theme.colors.white, borderColor: theme.colors.gray, borderRadius: 5, borderWidth: 2 }}>

            <View style={{ justifyContent: 'center', paddingHorizontal: 161, marginTop: 10 }}>
              <Icon.Button backgroundColor={theme.colors.transparente} name={'account-circle'} size={30} color={theme.colors.primary} iconStyle={{ marginRight: 0 }} />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: theme.fontSizes.body, fontWeight: theme.fontWeights.bold, color: theme.colors.primary }}>{`Registrarse`}</Text>
            </View>
            <>
              {registerFields.map((field) => renderTextInput(field))}
            </>
            <Icon.Button
              name={'dialpad'}
              backgroundColor={theme.colors.white}
              color={theme.colors.white}
              onPress={() => setPinDialogVisible(true)}
              underlayColor={theme.colors.white}
              style={{ paddingVertical: 10, marginBottom: 20, backgroundColor: theme.colors.primary, width: pin ? screenWidth / 1.5 : screenWidth / 3, marginLeft: pin ? screenWidth / 7 : screenWidth / 3.2, justifyContent: 'center' }}
            >
              {pin ? `Cambiar PIN (Actual: ${pin})` : 'Configurar PIN'}
            </Icon.Button>
            <PinRegistration pinDialogVisible={pinDialogVisible} setPinDialogVisible={setPinDialogVisible} onCompleteRegistration={handlePin} />
            <View style={{ paddingHorizontal: 10, marginBottom: 20, justifyContent: 'center' }}>
              <Icon.Button backgroundColor={theme.colors.primary} name={'account-plus'} onPress={() => handleRegister()} size={30} iconStyle={{ marginRight: 110 }}>{'Registrarse'}</Icon.Button>
            </View>
            <View style={styleForm.rowButton}>
              <View style={{ paddingHorizontal: 10, marginLeft: 130, justifyContent: 'flex-start' }}>
                <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={'keyboard-backspace'} onPress={() => navigation.navigate('Login')} size={30} iconStyle={{ marginRight: 10 }}>{'Volver'}</Icon.Button>
              </View>

            </View>

            <Correcto setVisible={setvisibleOK} visible={visibleOK} nombreUsuario={username} navigation={navigation} registro={true} />
            <Error visible={visibleError} setVisible={setVisibleError} message={message} registro={true}/>

          </View>
        )}
    </View>
  );
};

export default Register;

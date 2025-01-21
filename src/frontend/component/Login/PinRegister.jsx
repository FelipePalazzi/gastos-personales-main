import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PinInput from './PinInput.jsx';
import { ActivityIndicator, Dialog, Portal, TextInput, Button } from 'react-native-paper'
import theme from '../../theme/theme.js';


const PinRegistration = ({ pinDialogVisible, setPinDialogVisible ,onCompleteRegistration }) => {
  const [step, setStep] = useState(1); // 1: Ingresar PIN, 2: Confirmar PIN
  const [firstPin, setFirstPin] = useState('');

  const handlePinInput = (pin) => {
    if (step === 1) {
      setFirstPin(pin);
      setStep(2);
    } else if (step === 2) {
      if (pin === firstPin) {
        onCompleteRegistration(pin);
        setStep(1)
      } else {
        alert('Los PIN no coinciden. Intenta de nuevo.');
        setStep(1);
        setFirstPin('');
      }
    }
  };

  return (
    <Portal>
    <Dialog visible={pinDialogVisible} onDismiss={() => setPinDialogVisible(false)} style={{backgroundColor:theme.colors.white}}>
      <Dialog.Title style={{color:theme.colors.primary}}>{step === 1 ? 'Crea tu PIN' : 'Confirma tu PIN'}</Dialog.Title>
      <Dialog.Content>
        <PinInput onValidatePin={handlePinInput} />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setPinDialogVisible(false)}>Cerrar</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PinRegistration;

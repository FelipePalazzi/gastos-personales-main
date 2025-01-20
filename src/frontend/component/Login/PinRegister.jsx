import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PinInput from './PinInput.jsx';

const PinRegistration = ({ onCompleteRegistration }) => {
  const [step, setStep] = useState(1); // 1: Ingresar PIN, 2: Confirmar PIN
  const [firstPin, setFirstPin] = useState('');

  const handlePinInput = (pin) => {
    if (step === 1) {
      setFirstPin(pin);
      setStep(2);
    } else if (step === 2) {
      if (pin === firstPin) {
        onCompleteRegistration(pin);
      } else {
        alert('Los PIN no coinciden. Intenta de nuevo.');
        setStep(1);
        setFirstPin('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {step === 1 ? 'Crea tu PIN' : 'Confirma tu PIN'}
      </Text>
      <PinInput onValidatePin={handlePinInput} />
    </View>
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

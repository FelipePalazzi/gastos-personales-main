import React, { useState } from 'react';
import PinInput from './PinInput.jsx';
import { Dialog, Portal, Button } from 'react-native-paper'
import theme from '../../theme/theme.js';
import Error from '../Comunes/Dialogs/Error.jsx';


const PinRegistration = ({ pinDialogVisible, setPinDialogVisible ,onCompleteRegistration }) => {
  const [step, setStep] = useState(1); // 1: Ingresar PIN, 2: Confirmar PIN
  const [firstPin, setFirstPin] = useState('');
  const [message, setMessage] = useState('');
  const [visibleError, setVisibleError] = useState(false);

  const handlePinInput = (pin) => {
    if (step === 1) {
      setFirstPin(pin);
      setStep(2);
    } else if (step === 2) {
      if (pin === firstPin) {
        onCompleteRegistration(pin);
        setStep(1)
      } else {
        setMessage('Los PINs no coinciden. Intente nuevamente')
        setVisibleError(true)
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
    <Error visibleError={visibleError} setVisibleError={setVisibleError} message={message}/>
  </Portal>
  );
};

export default PinRegistration;

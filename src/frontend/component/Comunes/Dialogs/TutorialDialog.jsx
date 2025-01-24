import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import theme from "../../../theme/theme";
import { styleDialog, screenWidth } from "../../../styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TutorialDialog = ({ visible, setVisible }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (visible) {
            setCurrentStep(0);
        }
    }, [visible]);

    const steps = [
        "Para continuar se requiere que se cree una Cuenta en la parte superior.",
        "En la esquina superior derecha se encuentra el menu para gestionar las entidades de la Cuenta, ingrese en ese apartado y cree minimo una de cada una.",
        "Una vez hecho todo esta listo para agregar Salidas y Entradas en las pantallas correspondientes."
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <Portal>
            <Dialog
                style={{ backgroundColor: theme.colors.white }}
                visible={visible}
                dismissable={false}
            >
                <Dialog.Icon color={theme.colors.primary} icon={'information'} />
                <Dialog.Title style={styleDialog.title}>Tutorial</Dialog.Title>
                <Dialog.Content style={{ alignItems: 'center' }}>
                    <Text style={[styleDialog.dateText, { marginRight: 0 }]}>
                        {steps[currentStep]}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{ marginEnd: screenWidth / 5, marginTop: 10 }}>
                    {currentStep > 0 && (
                        <Button onPress={prevStep} mode="outlined" buttonColor={theme.colors.white} textColor={theme.colors.primary} style={{borderColor:theme.colors.primary}}>
                            Anterior
                        </Button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <Button onPress={nextStep} mode="contained" buttonColor={theme.colors.primary}  textColor={theme.colors.white}  style={{borderColor:theme.colors.white}}>
                            Siguiente
                        </Button>
                    ) : (
                        <Icon.Button
                            backgroundColor={theme.colors.primary}
                            color={theme.colors.white}
                            name={'check'}
                            onPress={() => (setVisible(false), AsyncStorage.setItem('tutorialShown', 'false'))}
                            iconStyle={{ marginRight: 0, paddingHorizontal: 50 }}
                        />
                    )}
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default TutorialDialog;

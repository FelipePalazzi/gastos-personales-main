import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { screenWidth } from '../../styles/styles';

const PinInput = ({ onValidatePin, title }) => {
    const [pin, setPin] = useState('');

    useEffect(() => {
        if (pin.length === 6) {
            onValidatePin(pin);
            setPin('')
        }
    }, [pin]);

    return (
        <View style={styles.pinContainer}>
            {title && <Text style={{
                fontSize: theme.fontSizes.busqueda_avanzada,
                fontWeight: 'bold',
                color: theme.colors.primary,
                marginBottom:10
            }}>{title}</Text>}
            <View style={styles.circlesContainer}>
                {Array.from({ length: 6 }, (_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.circle,
                            pin.length > i ? styles.circleFilled : styles.circleEmpty,
                        ]}
                    />
                ))}
            </View>

            <View style={styles.keypad}>
                {Array.from({ length: 9 }, (_, i) => (
                    <TouchableOpacity
                        key={i + 1}
                        style={styles.key}
                        onPress={() => setPin((prev) => (prev.length < 6 ? prev + (i + 1).toString() : prev))}
                    >
                        <Text style={styles.keyText}>{i + 1}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.key} onPress={() => setPin('')}>
                    <Text style={styles.keyText}>C</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.key}
                    onPress={() => setPin((prev) => (prev.length < 6 ? prev + '0' : prev))}
                >
                    <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.key} onPress={() => setPin((prev) => prev.slice(0, -1))}>
                    <Icon name={'close'} size={25} color={theme.colors.primary}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pinContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    circlesContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    circle: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        marginHorizontal: 5,
        borderWidth: 1,
    },
    circleEmpty: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.white,
    },
    circleFilled: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
    },
    keypad: {
        maxWidth: 250,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20
    },
    key: {
        width: 70,
        height: 70,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 35,
        borderColor: theme.colors.primary,
        borderWidth: 1,
    },
    keyText: {
        fontSize: theme.fontSizes.body,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default PinInput;

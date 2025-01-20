import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../theme/theme';
import { screenWidth } from '../../styles/styles';

const PinInput = ({ onValidatePin }) => {
    const [pin, setPin] = useState('');

    useEffect(() => {
        if (pin.length === 6) {
            onValidatePin(pin);
        }
    }, [pin]);

    return (
        <View style={styles.pinContainer}>
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
                    <Text style={styles.keyText}>←</Text>
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
        width: 15,
        height: 15,
        borderRadius: 7.5,
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
        marginBottom:20
    },
    key: {
        width: 60,
        height: 60,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 30,
        borderColor:theme.colors.primary,
        borderWidth:1,
    },
    keyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary
    },
});

export default PinInput;

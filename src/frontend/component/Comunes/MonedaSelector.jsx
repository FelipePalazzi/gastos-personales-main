import React from 'react';
import { View, Text } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import theme from '../../theme/theme.js';

const MonedaSelector = ({ selectedMoneda, onMonedaChange }) => {
  return (
    <View style={{
      alignContent: 'center',
      marginBottom: 10,
    }}>
      <Text style={{
        fontWeight: theme.fontWeights.bold,
        textAlign: 'center',
        color:theme.colors.primary
      }}>Seleccione tipo de moneda</Text>
      <SegmentedButtons
        style={{ marginVertical: 10 }}
        theme={{ colors: { secondaryContainer: theme.colors.primary } }}
        value={selectedMoneda}
        onValueChange={onMonedaChange}
        buttons={[
          {
            value: "USD",
            label: "USD",
            checkedColor: theme.colors.white,
            uncheckedColor: theme.colors.primary,
            style: { backgroundColor: selectedMoneda === 'USD' ? theme.colors.primary : theme.colors.white }
          },
          {
            value: "UYU",
            label: "UYU",
            checkedColor: theme.colors.white,
            uncheckedColor: theme.colors.primary,
            style: { backgroundColor: selectedMoneda === 'UYU' ? theme.colors.primary : theme.colors.white }
          },
          {
            value: "ARG",
            label: "ARG",
            checkedColor: theme.colors.white,
            uncheckedColor: theme.colors.primary,
            style: { backgroundColor: selectedMoneda === 'ARG' ? theme.colors.primary : theme.colors.white }
          },
        ]}
      />
    </View>
  );
};

export default MonedaSelector;
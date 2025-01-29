import React from 'react';
import { View, Text } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import theme from '../../theme/theme.js';

const MonedaSelector = ({ selectedMoneda, onMonedaChange, title }) => {
  return (
    <View style={{
      alignItems: 'center',
      marginBottom: 10,
      justifyContent:'center'
    }}>
      <Text style={{color:theme.colors.primary,fontSize:theme.fontSizes.normal}}>{title}</Text>
      <SegmentedButtons
        style={{ marginVertical: 10, marginHorizontal:30 }}
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
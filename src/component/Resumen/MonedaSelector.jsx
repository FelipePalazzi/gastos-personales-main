import React from 'react';
import { View, Text } from 'react-native';
import { styleResumen } from '../../styles/styles.js';
import {SegmentedButtons} from 'react-native-paper';
import theme from '../../styles/theme.js';

const MonedaSelector = ({ selectedMoneda, onMonedaChange }) => {
  return (
    <View style={styleResumen.monedaButton}>
      <Text style={styleResumen.textPointer}>Seleccione tipo de moneda</Text>
      <SegmentedButtons
        style={styleResumen.button}
        theme={{ colors: { secondaryContainer: theme.colors.segmented } }}
        value={selectedMoneda}
        onValueChange={onMonedaChange}
        buttons={[
          { value: 'ARG', label: 'ARG' },
          { value: 'UYU', label: 'UYU' },
          { value: 'USD', label: 'USD' },
        ]}
      />
    </View>
  );
};

export default MonedaSelector;
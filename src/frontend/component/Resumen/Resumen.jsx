import React, { useState, useEffect, useRef } from 'react';
import { View,Text , ScrollView } from 'react-native';
import { styleMovimiento, styleResumen } from '../../styles/styles.js';
import useResumen from '../../hooks/useResumen.js';
import MonedaSelector from './MonedaSelector.jsx';
import IngrGastDiaMes from './IngrGastDiaMes.jsx';
import IngrGastResponsable from './IngrGastResponsable.jsx';
import theme from '../../theme/theme.js';
import { alerts, button_text } from '../../../constants.js';
import { Searchbar, ActivityIndicator} from 'react-native-paper';
import ResponsablesSection from './ResponsablesSection.jsx';
import StackTGResponsable from './StackTGResponsable.jsx';
import BalanceResponsable from './BalanceResponsable.jsx';

const Resumen = () => {
  const [search, setSearch] = useState('');
  const [selectedMoneda, setSelectedMoneda] = useState('ARG')
  const { loading, resumen } = useResumen();

  const scrollViewRef = useRef(null) 

  const [contentOffset, setContentOffset] = useState({ y: 0 }) 

  const handleScroll = (event) => {
    setContentOffset(event.nativeEvent.contentOffset) 
  } 

  useEffect(() => {
  }, [loading, resumen]);

  return (
    <ScrollView  showsVerticalScrollIndicator={true}
    vertical
    style={styleMovimiento.scroll}
    onScroll={handleScroll}
    scrollEventThrottle={theme.scroll.desplazamiento}
    ref={scrollViewRef}
    >
    <View>
    <Searchbar
      placeholder={button_text.ingreseAño}
      style={styleMovimiento.search}
      elevation={theme.search.elevation}
      onChangeText={setSearch}
      value={search}
      inputStyle={styleMovimiento.textRowTable}
      placeholderTextColor={theme.colors.primary}
      iconColor={theme.colors.primary}
    />
    {loading  ? (
        <View style={styleMovimiento.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styleMovimiento.loadingText}>{alerts.cargando}</Text>
        </View>
      ): (
        <>
      <MonedaSelector
        selectedMoneda={selectedMoneda}
        onMonedaChange={setSelectedMoneda}
      />
      <View style={[styleMovimiento.loadingContainer,{padding:0, marginBottom:5}]}>
        <Text style={styleMovimiento.loadingText}>
            Resumenes de Ingresos y Gastos
        </Text>
      </View>
          <IngrGastDiaMes resumen={resumen} search={search} selectedMoneda={selectedMoneda} />
          <IngrGastResponsable resumen={resumen} search={search} selectedMoneda={selectedMoneda} />
          <StackTGResponsable resumen={resumen} search={search} selectedMoneda={selectedMoneda} />
          <BalanceResponsable resumen={resumen} selectedMoneda={selectedMoneda} />
        </>
      )}
    </View>
    </ScrollView>
  );
};

export default Resumen;
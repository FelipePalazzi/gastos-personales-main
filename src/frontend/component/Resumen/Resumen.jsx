import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { styleMovimiento, styleResumen } from '../../styles/styles.js';
import useResumen from '../../hooks/useResumen.js';
import MonedaSelector from '../Comunes/MonedaSelector.jsx';
import IngrGastDiaMes from './IngrGastDiaMes.jsx';
import IngrGastResponsable from './IngrGastResponsable.jsx';
import theme from '../../theme/theme.js';
import { alerts, button_text } from '../../../constants.js';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import ResponsablesSection from './ResponsablesSection.jsx';
import StackTGResponsable from './StackTGResponsable.jsx';
import BalanceResponsable from './BalancePorFecha.jsx';
import BusquedaAvanzada from '../Comunes/Busqueda/BusquedaAvanzada.jsx';

import useGastos from '../../hooks/useGastos';
import useIngresos from '../../hooks/useIngresos';
import { getAtributosSearch } from './atributosSearch.js';
import useCombinedData from '../../hooks/useCombinedData.js';
import BalancePorFecha from './BalancePorFecha.jsx';

const Resumen = ({ keyId, parentScrollEnabled, setParentScrollEnabled }) => {
  const [search, setSearch] = useState('');
  const [selectedMoneda, setSelectedMoneda] = useState('ARG')
  const scrollViewRef = useRef(null)

  const [refreshing, setRefreshing] = useState(false);

  const { gastos, loading: loadingGastos, fetchGastos } = useGastos(keyId);
  const { ingresos, loading: loadingIngresos, fetchIngresos } = useIngresos(keyId);
  useEffect(() => {
    if (!gastos.length) fetchGastos();
    if (!ingresos.length) fetchIngresos();
  }, [fetchGastos, fetchIngresos, gastos, ingresos]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGastos(`limit=150`);
    await fetchIngresos(`limit=150`);
    setRefreshing(false);
  };

  const handleApplyFilters = (filters) => {
    const query = new URLSearchParams({
      ...filters,
      limit: 40
    }).toString();
    setAppliedFilters(filters);
    fetchIngresos(query).then(
      fetchGastos(query).finally(() => setIsLoading(false)));
  };

  const { categoria, subcategoria, responsable, moneda, metodopago, submetodopago } = useCombinedData(keyId);
  const [appliedFilters, setAppliedFilters] = useState({});

  const categorias = React.useMemo(() =>
    categoria.map(item => ({
      nombre: item.categoria,
      activo: item.categoria_activo,
    })),
    [categoria]
  );

  const subcategorias = React.useMemo(() =>
    subcategoria.map(item => ({
      nombre: item.subcategoria,
      activo: item.subcategoria_activo,
    })),
    [subcategoria]
  );

  const responsables = React.useMemo(() =>
    responsable.map(item => ({
      nombre: item.responsable,
      activo: item.responsable_activo,
    })),
    [responsable]
  );

  const monedas = React.useMemo(() =>
    moneda.map(item => ({
      nombre: item.codigo_moneda,
      activo: item.moneda_activo,
    })),
    [moneda]
  );

  const metodopagos = React.useMemo(() =>
    metodopago.map(item => ({
      nombre: item.metodopago,
      activo: true,
    })),
    [metodopago]
  );

  const submetodopagos = React.useMemo(() =>
    submetodopago.map(item => ({
      nombre: item.submetodo_pago,
      activo: item.submetodo_pago_activo,
    })),
    [submetodopago]
  );

  const atributosSearch = React.useMemo(() =>
    getAtributosSearch({ categorias, subcategorias, responsables, monedas, metodopagos, submetodopagos }),
    [categorias, subcategorias, responsables, monedas, metodopagos, submetodopagos]
  );

  const [contentOffset, setContentOffset] = useState({ y: 0 })

  const handleScroll = (event) => {
    setContentOffset(event.nativeEvent.contentOffset)
  }

  return (
    <ScrollView showsVerticalScrollIndicator={true}
      vertical
      style={styleMovimiento.scroll}
      onScroll={handleScroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      scrollEventThrottle={theme.scroll.desplazamiento}
      ref={scrollViewRef}
    >
      <View>
        <BusquedaAvanzada
          onApplyFilters={handleApplyFilters}
          atributosSearch={atributosSearch}
          appliedFilters={appliedFilters}
          keyId={keyId}
        />
        <MonedaSelector
          selectedMoneda={selectedMoneda}
          onMonedaChange={setSelectedMoneda}
          title={'Moneda para visualizar todos los Resumenes:'}
        />
        <IngrGastDiaMes
          selectedMoneda={selectedMoneda}
          keyId={keyId}
          parentScrollEnabled={parentScrollEnabled}
          setParentScrollEnabled={setParentScrollEnabled}
          gastos={gastos}
          loadingGastos={loadingGastos}
          ingresos={ingresos}
          loadingIngresos={loadingIngresos}
        />
        {/*           <IngrGastResponsable resumen={resumen} search={search} selectedMoneda={selectedMoneda} />
          <StackTGResponsable resumen={resumen} search={search} selectedMoneda={selectedMoneda} />*/}
        <BalancePorFecha
          selectedMoneda={selectedMoneda}
          keyId={keyId}
          parentScrollEnabled={parentScrollEnabled}
          setParentScrollEnabled={setParentScrollEnabled}
          gastos={gastos}
          loadingGastos={loadingGastos}
          ingresos={ingresos}
          loadingIngresos={loadingIngresos}
        />
      </View>
    </ScrollView>
  );
};

export default Resumen;
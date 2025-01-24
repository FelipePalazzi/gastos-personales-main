import React, { useState, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { SegmentedButtons, Card } from 'react-native-paper';
import useGastos from '../../hooks/useGastos';
import useIngresos from '../../hooks/useIngresos';
import { months, monedaMaxValues } from '../../../constants';
import { styleResumen, screenWidth } from '../../styles/styles';
import theme from '../../theme/theme';

const IngrGastDiaMes = ({ selectedMoneda }) => {
  const { gastos, loading: loadingGastos, fetchGastos } = useGastos();
  const { ingresos, loading: loadingIngresos, fetchIngresos } = useIngresos();
  const [selectedValue, setSelectedValue] = useState('Dia');
  const [chartData, setChartData] = useState({ gastos: [], ingresos: [] });
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    // Llamar a los hooks para cargar datos si no están disponibles
    if (gastos.length) fetchGastos();
    if (ingresos.length) fetchIngresos();
  }, [fetchGastos, fetchIngresos, gastos, ingresos]);

  useEffect(() => {
    if (!loadingGastos && !loadingIngresos) {
      // Agrupar datos según "Dia" o "Mes"
      const formatKey = selectedValue === 'Dia' ? 'YYYY-MM-DD' : 'YYYY-MM';
      const gastosGrouped = groupByKey(gastos, formatKey);
      const ingresosGrouped = groupByKey(ingresos, formatKey);

      // Convertir los datos agrupados en un formato usable por LineChart
      const gastosChartData = convertToChartData(gastosGrouped, selectedMoneda);
      const ingresosChartData = convertToChartData(ingresosGrouped, selectedMoneda);

      // Calcular valor máximo
      const maxGasto = Math.max(...gastosChartData.map((item) => item.value), 0);
      const maxIngreso = Math.max(...ingresosChartData.map((item) => item.value), 0);
      setMaxValue(Math.max(maxGasto, maxIngreso) * monedaMaxValues[selectedMoneda]);

      setChartData({
        gastos: gastosChartData,
        ingresos: ingresosChartData,
      });
    }
  }, [gastos, ingresos, selectedValue, selectedMoneda, loadingGastos, loadingIngresos]);

  // Función para agrupar datos por fecha
  const groupByKey = (data, keyFormat) => {
    return data.reduce((acc, item) => {
      const dateKey = new Date(item.fecha).toISOString().slice(0, keyFormat.length);
      acc[dateKey] = (acc[dateKey] || 0) + item[`monto_${selectedMoneda.toLowerCase()}`];
      return acc;
    }, {});
  };

  // Convertir datos agrupados en el formato que acepta LineChart
  const convertToChartData = (groupedData, moneda) => {
    return Object.entries(groupedData).map(([key, value]) => ({
      value,
      date: selectedValue === 'Dia' ? key : `${months[new Date(key).getMonth()]} ${new Date(key).getFullYear()}`,
      label: selectedValue === 'Dia' ? key : `${months[new Date(key).getMonth()]}\n${new Date(key).getFullYear()}`,
    }));
  };

  if (loadingGastos || loadingIngresos) {
    return <Text>Cargando datos...</Text>;
  }

  return (
    <View style={styleResumen.viewContainer}>
      <Card style={styleResumen.titleContainer}>
        <Card.Title
          title={`Por ${selectedValue}`}
          titleStyle={styleResumen.title}
        />
        <Card.Content style={styleResumen.container}>
          <SegmentedButtons
            value={selectedValue}
            onValueChange={setSelectedValue}
            buttons={[
              { value: 'Dia', label: 'Día' },
              { value: 'Mes', label: 'Mes' },
            ]}
            style={styleResumen.button}
          />
          {chartData.gastos.length > 0 && chartData.ingresos.length > 0 ? (
            <LineChart
              data={chartData.gastos}
              data2={chartData.ingresos}
              maxValue={maxValue}
              isAnimated
              areaChart
              curved
              hideOrigin
              color1={theme.colors.primary}
              color2={theme.colors.secondary}
              width={screenWidth - 40}
              height={screenWidth - 100}
              noOfSections={4}
              yAxisTextStyle={styleResumen.ejeYstyle}
              xAxisLabelTextStyle={{ color: theme.colors.white }}
            />
          ) : (
            <Text>No hay datos para mostrar</Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

export default IngrGastDiaMes;

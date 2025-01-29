import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LineChartBicolor } from 'react-native-gifted-charts';
import { SegmentedButtons, Card, Button, Icon } from 'react-native-paper';
import { pointerConfig, lineChart, symbols, months, monedaMaxValues } from '../../../constants';
import { styleResumen, screenWidth, screenHeight } from '../../styles/styles';
import theme from '../../theme/theme';
import { formatYLabel } from '../../utils';

const useChartData = ({ gastos, ingresos, selectedValue, selectedMoneda }) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const groupByKey = (data, keyFormat) => {
    return data.reduce((acc, item) => {
      const dateKey = new Date(item.fecha).toISOString().slice(0, keyFormat.length);
      acc[dateKey] = (acc[dateKey] || 0) + item[selectedMoneda];
      return acc;
    }, {});
  };

  const convertToChartData = (gastosGrouped, ingresosGrouped) => {
    let accumulatedBalance = 0;
    const allDates = new Set([...Object.keys(gastosGrouped), ...Object.keys(ingresosGrouped)]); // Unir todas las fechas de ambos grupos

    return Array.from(allDates).sort().map((date) => {
      const gastosValue = gastosGrouped[date] || 0;
      const ingresosValue = ingresosGrouped[date] || 0;
      accumulatedBalance += ingresosValue - gastosValue; // Actualizar el balance acumulado

      return {
        value: accumulatedBalance,
        date: selectedValue === 'Dia' ? date : `${months[new Date(date).getMonth()]} ${new Date(date).getFullYear()}`,
        label: selectedValue === 'Dia' ? date : `${months[new Date(date).getMonth()]}\n${new Date(date).getFullYear()}`,
        labelTextStyle: { fontSize: 13, margin: -3, color: theme.colors.primary },
        customDataPoint: () => <View style={{height:0, width:0, borderRadius:0}} />
      };
    });
  };

  return useMemo(() => {
    const formatKey = selectedValue === 'Dia' ? 'YYYY-MM-DD' : 'YYYY-MM';
    const gastosGrouped = groupByKey(gastos, formatKey);
    const ingresosGrouped = groupByKey(ingresos, formatKey);

    const chartData = convertToChartData(gastosGrouped, ingresosGrouped).reverse();

    const maxBalance = Math.max(...chartData.map((item) => Math.abs(item.value)), 0) * monedaMaxValues[selectedMoneda];

    return {
      chartData,
      maxValue: maxBalance * monedaMaxValues[selectedMoneda], // Ajuste según moneda
    };
  }, [gastos, ingresos, selectedValue, selectedMoneda]);
};

const BalancePorFecha = ({
  gastos,
  loadingGastos,
  ingresos,
  loadingIngresos,
  selectedMoneda,
  parentScrollEnabled,
  setParentScrollEnabled,
}) => {
  const [selectedValue, setSelectedValue] = useState('Dia');
  const [card, setCard] = useState(false);

  const { chartData, maxValue } = useChartData({
    gastos,
    ingresos,
    selectedValue,
    selectedMoneda,
  });

  if (loadingGastos || loadingIngresos) {
    return <View style={styleResumen.loadingContainer}><Text style={styleResumen.loadingText}>Cargando datos...</Text></View>;
  }

  const renderDot = (color) => (
    <View style={[styleResumen.renderDot, { backgroundColor: color }]} />
  );

  const monthToIndex = Object.entries(months).reduce((acc, [key, value]) => {
    acc[value] = parseInt(key) - 1; // Resta 1 porque los índices de los meses van de 0 a 11
    return acc;
  }, {});
  
  // Convierte las fechas a objetos Date
  const fechas = chartData.map((item) => {
    if (selectedValue === "Dia") {
      return new Date(item.date); // Fecha estándar
    } else if (selectedValue === "Mes") {
      const [monthName, year] = item.date.split(" "); // Divide en mes y año
      const monthIndex = monthToIndex[monthName]; // Obtén el índice del mes
      return new Date(year, monthIndex, 1); // Construye la fecha con el primer día del mes
    }
    return null;
  });

  const fechaMasAntigua = new Date(Math.min(...fechas));
  const fechaMasReciente = new Date(Math.max(...fechas));

  const rangoFechas = selectedValue === 'Dia'
  ? `${fechaMasAntigua.toLocaleDateString()} al ${fechaMasReciente.toLocaleDateString()}`
  : `${months[fechaMasAntigua.getMonth() + 1]} ${fechaMasAntigua.getFullYear()} al ${months[fechaMasReciente.getMonth() + 1]} ${fechaMasReciente.getFullYear()}`;

  const balanceUltimaFecha = chartData.length ? chartData[0].value : 0;

  return (
    <View style={[styleResumen.viewContainer, { marginTop: 10 }]}>
      {chartData.length ? (
        <Card style={styleResumen.titleContainer}>
          <TouchableOpacity onPress={() => (setCard(!card), setParentScrollEnabled(true))}>
            <Card.Title
              title={`Balance por ${selectedValue}`}
              titleStyle={styleResumen.title}
              right={() => (
                <Icon
                  source={card ? theme.icons.arriba : theme.icons.abajo}
                  size={theme.fontSizes.body}
                  color={theme.colors.white}
                />
              )}
              rightStyle={styleResumen.rightCardTitle}
            />
          </TouchableOpacity>

          {card && (
            <Card.Content style={styleResumen.container}>
              <SegmentedButtons
                value={selectedValue}
                onValueChange={setSelectedValue}
                buttons={[
                  {
                    value: 'Dia',
                    label: 'Día',
                    checkedColor: theme.colors.white,
                    uncheckedColor: theme.colors.primary,
                    style: {
                      backgroundColor: selectedValue === 'Dia' ? theme.colors.primary : theme.colors.white,
                    },
                  },
                  {
                    value: 'Mes',
                    label: 'Mes',
                    checkedColor: theme.colors.white,
                    uncheckedColor: theme.colors.primary,
                    style: {
                      backgroundColor: selectedValue === 'Mes' ? theme.colors.primary : theme.colors.white,
                    },
                  },
                ]}
                style={styleResumen.button}
              />
              <Button
                onPress={() => setParentScrollEnabled(!parentScrollEnabled)}
                mode="contained"
                style={{
                  margin: 10,
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                  marginHorizontal: 50,
                }}
              >
                {!parentScrollEnabled ? 'Desactivar Desplazamiento del gráfico' : 'Activar Desplazamiento del gráfico'}
              </Button>
              <LineChartBicolor
                data={chartData}
                maxValue={maxValue}
                formatYLabel={(value) => (value ? formatYLabel(value, selectedMoneda) : '0')}
                areaChart
                rotateLabel
                adjustToWidth={true}
                animationDuration={lineChart.animacionDuration}
                xAxisTextNumberOfLines={lineChart.xAxisTextNumberOfLines}
                width={screenWidth * 0.75}
                height={screenWidth *0.4}
                initialSpacing={lineChart.initialSpacing}
                endSpacing={lineChart.initialSpacing}
                spacing={lineChart.spacing}
                thickness={lineChart.thickness}
                startOpacity={lineChart.startOpacity}
                startOpacityNegative={lineChart.startOpacity}
                endOpacity={lineChart.endOpacity}
                endOpacityNegative={lineChart.endOpacity}
                noOfSections={lineChart.noOfSections-3}
                yAxisThickness={lineChart.ejesThickness}
                xAxisThickness={lineChart.ejesThickness}
                verticalLinesColor={theme.colors.primary}
                colorNegative={theme.colors.salidas}
                color={theme.colors.entradas}
                startFillColorNegative={theme.colors.salidas}
                startFillColor={theme.colors.entradas}
                endFillColorNegative={theme.colors.salidas}
                endFillColor={theme.colors.entradas}
                rulesColor={theme.colors.primary}
                backgroundColor={theme.colors.gray}
                yAxisTextStyle={styleResumen.ejeYstyle}
                focusEnabled={true}
                scrollable
              />
              <View style={[styleResumen.containerLegend, { flexWrap: 'nowrap', justifyContent: 'space-evenly', marginTop: 20 , flexDirection:'column', alignItems:'center'}]}>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  {renderDot(theme.colors.primary)}
                  <Text style={{ color: theme.colors.primary }}>Balance del {rangoFechas}</Text>
                </View>
                <View>
                <Text style={{ color: theme.colors.primary }}>{selectedMoneda}$ {formatYLabel(balanceUltimaFecha, selectedMoneda)}</Text>
                </View>
              </View>
            </Card.Content>
          )}
        </Card>
      ) : (
        <Text style={[styleResumen.title, { color: theme.colors.white }]}>No hay datos</Text>
      )}
    </View>
  );
};

export default BalancePorFecha;

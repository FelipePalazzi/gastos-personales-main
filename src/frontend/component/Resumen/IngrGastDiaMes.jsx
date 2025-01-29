import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { SegmentedButtons, Card, Button, Portal, Icon } from 'react-native-paper';
import { pointerConfig, lineChart, symbols, atributos, months, monedaMaxValues } from '../../../constants';
import { styleResumen, screenWidth, styleLoading, screenHeight } from '../../styles/styles';
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

  const convertToChartData = (groupedData) => {
    return Object.entries(groupedData).map(([key, value]) => ({
      value,
      date: selectedValue === 'Dia' ? key : `${months[new Date(key).getMonth()]} ${new Date(key).getFullYear()}`,
      label: selectedValue === 'Dia' ? key : `${months[new Date(key).getMonth()]}\n${new Date(key).getFullYear()}`,
      labelTextStyle: { fontSize: 13, margin: -3, color: theme.colors.primary },
      customDataPoint: () => <View style={styleResumen.datapoint} />,
    }));
  };

  return useMemo(() => {
    const formatKey = selectedValue === 'Dia' ? 'YYYY-MM-DD' : 'YYYY-MM';
    const gastosGrouped = groupByKey(gastos, formatKey);
    const ingresosGrouped = groupByKey(ingresos, formatKey);

    const gastosChartData = convertToChartData(gastosGrouped);
    const ingresosChartData = convertToChartData(ingresosGrouped);

    const maxGasto = Math.max(...gastosChartData.map((item) => item.value), 0);
    const maxIngreso = Math.max(...ingresosChartData.map((item) => item.value), 0);

    return {
      chartData: {
        gastos: gastosChartData,
        ingresos: ingresosChartData,
      },
      maxValue: Math.max(maxGasto, maxIngreso) * monedaMaxValues[selectedMoneda],
    };
  }, [gastos, ingresos, selectedValue, selectedMoneda]);
};

const IngrGastDiaMes = ({
  gastos,
  loadingGastos,
  ingresos,
  loadingIngresos,
  selectedMoneda,
  parentScrollEnabled,
  setParentScrollEnabled
}) => {

  const [selectedValue, setSelectedValue] = useState('Dia');
  const [card, setCard] = useState(false);



  const { chartData, maxValue } = useChartData({ gastos, ingresos, selectedValue, selectedMoneda });

  if (loadingGastos || loadingIngresos) {
    return <View style={styleLoading.loadingContainer}><Text style={styleLoading.loadingText}>Cargando datos...</Text></View>;
  }

  const renderDot = color => {
    return (
      <View
        style={[styleResumen.renderDot, { backgroundColor: color, }]}
      />
    );
  };

  return (
    <View style={[styleResumen.viewContainer, { marginTop: 10 }]}>
      {chartData.gastos.length || chartData.ingresos.length ? (
        <Card style={styleResumen.titleContainer}>
          <TouchableOpacity onPress={() => (setCard(!card), setParentScrollEnabled(true))}>
            <Card.Title
              title={`Por ${selectedValue}`}
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
                    style: { backgroundColor: selectedValue === 'Dia' ? theme.colors.primary : theme.colors.white },
                  },
                  {
                    value: 'Mes',
                    label: 'Mes',
                    checkedColor: theme.colors.white,
                    uncheckedColor: theme.colors.primary,
                    style: { backgroundColor: selectedValue === 'Mes' ? theme.colors.primary : theme.colors.white },
                  },
                ]}
                style={styleResumen.button}
              />
              <Button
                onPress={() => setParentScrollEnabled(!parentScrollEnabled)}
                mode="contained"
                style={{ margin: 10, backgroundColor: theme.colors.primary, color: theme.colors.white, marginHorizontal: 50 }}
              >
                {!parentScrollEnabled ? 'Desactivar Desplazamiento del gráfico' : 'Activar desplazamiento del gráfico'}
                </Button>
              <LineChart
                data={chartData.gastos}
                data2={chartData.ingresos}
                maxValue={maxValue}
                formatYLabel={(value) => value ? formatYLabel(value, selectedMoneda) : '0'}
                isAnimated
                areaChart
                curved
                rotateLabel
                showVerticalLines
                adjustToWidth={true}
                hideOrigin
                animationDuration={lineChart.animacionDuration}
                xAxisTextNumberOfLines={lineChart.xAxisTextNumberOfLines}
                width={screenWidth * 0.75}
                height={screenWidth - 130}
                initialSpacing={lineChart.initialSpacing}
                endSpacing={lineChart.initialSpacing}
                spacing={lineChart.spacing}
                thickness={lineChart.thickness}
                startOpacity={lineChart.startOpacity}
                endOpacity={lineChart.endOpacity}
                noOfSections={lineChart.noOfSections}
                yAxisThickness={lineChart.ejesThickness}
                xAxisThickness={lineChart.ejesThickness}
                verticalLinesColor={theme.colors.primary}
                color1={theme.colors.salidas}
                color2={theme.colors.entradas}
                startFillColor1={theme.colors.salidas}
                startFillColor2={theme.colors.entradas}
                endFillColor1={theme.colors.salidas}
                endFillColor2={theme.colors.entradas}
                rulesColor={theme.colors.primary}
                backgroundColor={theme.colors.gray}
                yAxisTextStyle={styleResumen.ejeYstyle}
                focusEnabled={true}
                scrollable
                pointerConfig={{
                  hidePointer1: true,
                  hidePointer2: true,
                  pointerStripHeight: screenWidth - 130,
                  strokeDashArray: pointerConfig.strokeDashArray,
                  pointerStripColor: theme.colors.primary,
                  pointerStripWidth: pointerConfig.pointerStripWidth,
                  pointerColor: theme.colors.white,
                  radius: pointerConfig.radius,
                  pointerLabelWidth: pointerConfig.pointerLabelWidth,
                  pointerLabelHeight: screenWidth - 130,
                  activatePointersOnLongPress: true,
                  autoAdjustPointerLabelPosition: false,
                  shiftPointerLabelX: 0,
                  pointerLabelComponent: items => (
                    <Portal>
                      <View
                        style={{
                          position: 'absolute',
                          zIndex: 999,
                          top: screenHeight / 2,
                          left: screenWidth / 2
                        }}
                      >
                        <View style={styleResumen.fechaContainerPointer}>
                          <Text style={styleResumen.fechaPointer}>{items[0].date}</Text>
                        </View>
                        <View style={styleResumen.containerPointer}>
                          <Text style={styleResumen.titlePointer}>Salidas:</Text>
                          <Text style={styleResumen.textPointer}>
                            {items[0]?.value ? (selectedMoneda + symbols.peso + items[0]?.value.toFixed(0)) : 0}
                          </Text>
                          <Text style={styleResumen.titlePointer}>Entradas:</Text>
                          <Text style={styleResumen.textPointer}>
                            {items[1]?.value ? (selectedMoneda + symbols.peso + items[1]?.value.toFixed(0)) : 0}
                          </Text>
                        </View>
                      </View>
                    </Portal>
                  ),
                }}
              />
              <View style={[styleResumen.containerLegend, { flexWrap: 'nowrap', justifyContent: 'space-evenly', marginTop: 20 }]}>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  {renderDot(theme.colors.salidas)}
                  <Text style={{ color: theme.colors.primary }}>
                    Salidas
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  {renderDot(theme.colors.entradas)}
                  <Text style={{ color: theme.colors.primary }}>
                    Entradas
                  </Text>
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

export default IngrGastDiaMes;


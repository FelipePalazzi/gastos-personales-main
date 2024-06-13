import { View, Text, Dimensions, StyleSheet,Alert } from "react-native";
import { useState, useMemo, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import theme from "../theme";
import { Searchbar, Tooltip, Portal,Dialog } from 'react-native-paper';
import { filterData } from '../utils';
import useResumen from "../hooks/useResumen";
import * as React from 'react';
import { DataTable } from 'react-native-paper';
const CHART_WIDTH = Dimensions.get("window").width;
const CHART_HEIGHT = 220;

const Resumen = () => {
  const [search, setSearch] = useState('');
  const [chartData, setChartData] = useState(null);
  const { loading, data } = useResumen();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipValue, setTooltipValue] = useState('');
  const [tooltipColor, setTooltipColor] = useState('');

  const handleDataPointClick = ({ value, dataset, getColor }) => {
    const color = getColor();
    setTooltipVisible(true);
    setTooltipValue(value);
    setTooltipColor(color);
  };

  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);

useEffect(() => {
    if (!loading && data) {
      const months = data.map(item => item.month);
      const gastoAR = data.map(item => parseInt(item["GASTO AR"]));
      const ingresoAR = data.map(item => parseInt(item["INGRESO AR"]));
  
      const chartData = {
        labels: months,
        datasets: [
          {
            data: gastoAR,
            color: (opacity = 1) => `rgba(193, 59, 26, ${opacity})`, // Rojo
          },
          {
            data: ingresoAR,
            color: (opacity = 1) => `rgba(19, 126, 63, ${opacity})`, // Verde
          }

        ],
        legend: ["Gastos", "Ingresos"]
      };
  
      setChartData(chartData);

    }
  }, [loading, data, search]);

  const chartConfig = {
    backgroundGradientFrom: "#5D7370",
    backgroundGradientFromOpacity: 0.2,
    backgroundGradientTo: "#befffdcc",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(23, 68, 66, ${opacity})`, 
    useShadowColorFromDataset: true ,
    decimalPlaces:0,
    };
  return (
    <View>
      <Searchbar
        placeholder="Filtrar"
        style={styles.search}
        elevation={theme.search.elevation}
        onChangeText={setSearch}
        value={search}
      /> 
      {chartData && (
          <LineChart
          data={chartData}
          width={CHART_WIDTH-35}
          height={256}

          chartConfig={chartConfig}
          bezier
          fromZero
          style={{
            marginVertical: 8,
            paddingLeft: 16, // Agrega un padding izquierdo para dar espacio a los valores de la escala Y
            borderRadius: 16,
            minWidth: 300 
          }}
          onDataPointClick={handleDataPointClick}
        
      />
      
    )}
    
      {loading && <Text>Loading...</Text>}
    </View>
  ); 
}; 

const styles = StyleSheet.create({
  search: {
    paddingBottom: 1,
    backgroundColor: theme.colors.search,
  }, title: {
    textAlign: 'center',
  },
});

export default Resumen;
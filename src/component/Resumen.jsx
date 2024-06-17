import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect, useRef } from "react";
import theme from "../styles/theme";
import { Searchbar, Portal } from 'react-native-paper';
import useResumen from "../hooks/useResumen";
import * as React from 'react';
import { LineChart } from "react-native-gifted-charts";
import { filterData } from '../utils';

const CHART_WIDTH = Dimensions.get("window").width;

const Resumen = () => {
  const [search, setSearch] = useState('');
  const [areaChartData, setAreaChartData] = useState(null);
  const [areaChartData2, setAreaChartData2] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const { loading, resumen } = useResumen();
  const [months0, setMonths0] = useState({});

  const months = {
    '1': 'Ene',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Abr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Ago',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dic',
  };

  useEffect(() => {
    if (!loading && resumen && resumen[2]) {
      
    const data = resumen[2];

    const filteredData = filterData(data, search,'','','year');

    const monthsObj = {};
    filteredData.forEach(item => {
      if (!monthsObj[item.month]) {
        monthsObj[item.month] = true;
      }
    });
    setMonths0(monthsObj);
    const maxGastoAr = Math.max(...filteredData.map(item => parseInt(item["GASTO AR"])));
    const maxIngresoAr = Math.max(...filteredData.map(item => parseInt(item["INGRESO AR"])));
    const maxValue = Math.max(maxGastoAr, maxIngresoAr);
    setMaxValue(maxValue + 10000);
  
    const areaChartData = filteredData.map((item, index) => ({
      value: parseInt(item["GASTO AR"] || 0),
      date: `${item.day} ${months[item.month]}`, 
      label: `${search.length!== 4? `${item.day} ${months[item.month]}\n${item.year}` : `${item.day} ${months[item.month]}`}`,
      labelTextStyle: { fontSize: 13,margin:-8},
      customDataPoint: customDataPoint,
    }));
    const areaChartData2 = filteredData.map((item2, index) => ({
      value: parseInt(item2["INGRESO AR"] || 0),
      date: `${item2.day} ${months[item2.month]}`, 
      label: `${search.length!== 4? `${item2.day} ${months[item2.month]}\n${item2.year}` : `${item2.day} ${months[item2.month]}`}`,
      customDataPoint: customDataPoint,
    }));
      setAreaChartData(areaChartData);
      setAreaChartData2(areaChartData2);
    }
  }, [loading, resumen, search]);

  const customDataPoint = () => {
    return (
        <View
        style={{
            width: 8,
            height: 8,
            marginBottom:5,
            backgroundColor: 'white',
            borderWidth: 1.5,
            borderRadius: 10,
            borderColor: theme.colors.primary,
        }}
        />
    );
};

const months2 = Object.keys(months0).map(month => months[month]);

const ref = useRef(null);

const showOrHidePointer = (ind) => {
  const month = months2[ind];
  const firstDateIndex = areaChartData.findIndex(item => item.date.includes(month));
  if (firstDateIndex!== -1) {
    ref.current?.scrollTo({ x: firstDateIndex * 50 });
  }
};


return (
  <View>
    <Searchbar
      placeholder="Ingrese Año"
      style={{
        margin: 20,
        backgroundColor: theme.colors.search,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      elevation={theme.search.elevation}
      onChangeText={setSearch}
      value={search}
    />
    
    {areaChartData && areaChartData2 && (
      <View
        style={{
          paddingBottom: 25,
          paddingTop:10,
          paddingLeft: 20,
          margin: 10,
          backgroundColor: theme.colors.table,
        }}
      >
        <Text style={styles.title}>
          {`Ingresos y Gastos por Mes`}
          {search.length === 4 && search.match(/^\d{4}$/)? ` ${search}` : ''}
        </Text>
        <View style={{ flexDirection: 'row', marginLeft: CHART_WIDTH / 7, marginBottom:10 }}>
              {search.length === 4 ? (
                <>
                  {months2.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          padding: 15,
                          margin: 4,
                          backgroundColor: theme.colors.primary, 
                          borderRadius: 8,
                        }}
                        onPress={() => showOrHidePointer(index)}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : null}
            </View>
        <LineChart
          formatYLabel={(value) => {
            if (value > 1000) {
              return `$${(value / 1000).toFixed(0)}k`;
            } else {
              return `$${value}`;
            }
          }}
          scrollRef={ref}
          isAnimated
          animationDuration={1500}
          areaChart
          curved
          rotateLabel
          xAxisTextNumberOfLines={2}
          data={areaChartData}
          data2={areaChartData2}
          width={CHART_WIDTH - 95}
          height={220}
          showVerticalLines
          initialSpacing={10}
          verticalLinesColor="rgba(14,164,164,0.5)"
          spacing={50}
          color1={theme.colors.delete}
          color2={theme.colors.agregar}
          startFillColor1={theme.colors.delete}
          startFillColor2={theme.colors.agregar}
          endFillColor1={theme.colors.white}
          endFillColor2={theme.colors.white}
          thickness={2}
          startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          noOfSections={5}
          maxValue={maxValue}
          yAxisThickness={0}
          rulesColor="rgba(14,164,164,0.5)"
          yAxisTextStyle={{ color: theme.colors.textPrimary }}
          xAxisColor="lightgray"
          yAxisColor="lightgray"
          pointerConfig={{
            dataPointLabelShiftX: 10,
            dataPointLabelShiftY: 20,
            pointerStripHeight: 250,
            strokeDashArray: [2, 5],
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            pointerVanishDelay: 2000,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items) => {
              return (
                <Portal>
                  <View
                    style={{
                      position: 'absolute',
                      top: 360,
                      left: 150,
                      height: 90,
                      width: 100,
                      justifyContent: 'center',
                      marginTop: -30,
                      marginLeft: -40,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.textPrimary,
                        fontSize: 14,
                        marginBottom: 6,
                        textAlign: 'center',
                      }}
                    >
                      {items[0].date}
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        borderRadius: 16,
                        backgroundColor: theme.colors.card,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.colors.textPrimary,
                          fontSize: 14,
                          fontWeight: 800,
                        }}
                      >
                        {'Gasto'}
                      </Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        {'$' + items[0].value + '.0'}
                      </Text>
                      <Text
                        style={{
                          color: theme.colors.textPrimary,
                          fontSize: 14,
                          fontWeight: 800,
                        }}
                      >
                        {'Ingreso'}
                      </Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        {'$' + items[1].value + '.0'}
                      </Text>
                    </View>
                  </View>
                </Portal>
              );
            },
          }}
        />
      </View>
    )}
    {loading && <Text>Loading...</Text>}
  </View>
);
}
const styles = StyleSheet.create({
  search: {
    margin: 20,
    backgroundColor: theme.colors.search, 
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom:20,
    fontWeight:'800',
    fontSize:20,

    
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
  },
});


export default Resumen;
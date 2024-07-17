import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { styleResumen, screenWidth } from '../../styles/styles.js';
import { months, monedaMaxValues } from '../../constants.js';
import { filterData, formatYLabel} from '../../utils.js';
import { BarChart } from 'react-native-gifted-charts';
import theme from '../../styles/theme.js';
import { atributos, barChart} from '../../constants.js';
import { SegmentedButtons, Card, Icon } from 'react-native-paper';
import ResponsablesSection from './ResponsablesSection.jsx';

const IngrGastResponsable = ({ resumen, search, selectedMoneda })=> {
  const [stackData, setStackData] = useState(null);
  const [maxFilteredValue, setMaxFilteredValue] = useState(0);
  const [card, setCard] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth2, setSelectedMonth2] = useState('4');
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueMonths, setUniqueMonths] = useState([]);  
  const [filteredStackData, setFilteredStackData] = useState([]);
  const [tempFilteredStackData, setTempFilteredStackData] = useState([]);
  const [monthsWithData, setMonthsWithData] = useState([]);
  const [selectedYearRef, setSelectedYearRef] = useState(selectedYear);
  const [impares, setImpares] = useState([]);
  const [pares, setPares] = useState([]);

  useEffect(() => {
    const defaultYear = uniqueYears[0];
    const defaultMonth = uniqueMonths[0];
    setSelectedYear(defaultYear);
    setSelectedMonth2(defaultMonth);
  }, [resumen, uniqueYears, uniqueMonths]);

  useEffect(() => {
    const data = resumen[3];
    const filteredData = filterData(data, search,'','','year');

    const uniqueYears = [...new Set(filteredData.map(item => item.year))];
    const uniqueMonths = [...new Set(filteredData.map(item => item.month))];
    setUniqueYears(uniqueYears);
    setUniqueMonths(uniqueMonths);
    if (uniqueYears.length === 1) {
      setSelectedYear(uniqueYears[0]);
      setSelectedMonth2(uniqueMonths[0]);
    } else if (search.includes(uniqueYears[0])) { 
      setSelectedYear(uniqueYears[0]);
      setSelectedMonth2(uniqueMonths[0]);
    }

    const stackData = filteredData.flatMap((item3, index) => [
        {
          value: parseInt(item3[`${atributos.gastoResumen} ${selectedMoneda}`] || 0),
          year: item3.year,
          month: months[item3.month],
          frontColor: theme.colors.gasto,
          spacing: 10,
          labelWidth: 50,
          labelTextStyle: styleResumen.labels,
          label: item3.nombre,
        },
        {
          value: parseInt(item3[`${atributos.ingresoResumen} ${selectedMoneda}`] || 0),
          year: item3.year,
          month: months[item3.month],
          frontColor: theme.colors.ingreso,
          spacing:8,
          labelTextStyle: {color:theme.colors.transparente},
          label: item3.nombre,
        },
      ]);

        setStackData(stackData)

  }, [resumen, search, selectedMoneda]);

  useEffect(() => {
    setSelectedYearRef(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (resumen[3] && stackData) {
      const filteredData = stackData.filter(item => item.year === selectedYearRef && item.month === months[selectedMonth2]);
      setTempFilteredStackData(filteredData);
      if (filteredData.length > 0) {
        const maxFilteredValue = Math.max(...filteredData.map(item => item.value));
        setMaxFilteredValue(maxFilteredValue * monedaMaxValues[selectedMoneda]);
      }
      const availableMonths = [...new Set(stackData.filter(item => item.year === selectedYearRef).map(item => item.month))];
      setMonthsWithData(availableMonths);

      const impares = filteredData.filter((item, index) => index % 2 !== 0);
      const pares = filteredData.filter((item, index) => index % 2 === 0);
      setImpares(impares);
      setPares(pares);
    }
  }, [resumen, selectedYearRef, selectedMonth2, stackData]);

  useEffect(() => {
    setFilteredStackData(tempFilteredStackData);
  }, [tempFilteredStackData]);

  useEffect(() => {
    if ( resumen[3] && stackData) {
    const availableMonths = [...new Set(stackData.filter(item => item.year === selectedYear).map(item => item.month))];
      if (availableMonths.length > 0) {
        const firstMonthWithData = Object.keys(months).find(key => months[key] === availableMonths[0]);
        setSelectedMonth2(firstMonthWithData);
      }
    }
  }, [selectedYear, resumen, stackData]);

  return (
    <View style={styleResumen.viewContainer}>
    {stackData && (
        <View>
          {((search.length >= 0 && search.length < 4)   || (search.length === 4 && search.match(/^\d{4}$/) && (stackData.some(item => item.value === 0)))) ? (
    <Card style={styleResumen.titleContainer} >
      <TouchableOpacity onPress={() => setCard(!card)}>
          <Card.Title
            title={`Por ${atributos.responsable}s ${search.length === 4 && search.match(/^\d{4}$/)? search : ''}`}
            titleStyle={styleResumen.title}
            right={(props) => <Icon source={card? theme.icons.arriba : theme.icons.abajo} size={theme.fontSizes.body} color={theme.colors.white} />}
            rightStyle={styleResumen.rightCardTitle}
          />
        </TouchableOpacity>
      
            {card && (  
            <Card.Content style={styleResumen.container}>
              <View style={styleResumen.Containerbutton}>
              {search.length !== 4 ? (
              <SegmentedButtons
                style={styleResumen.button}
                theme={{ colors: { secondaryContainer: theme.colors.segmented, onSecondaryContainer:theme.colors.pieBackground, onSurface:theme.colors.white  } }}
                value={selectedYear}
                onValueChange={(year) => setSelectedYear(year)}
                buttons={uniqueYears.filter(year => stackData.some(item => item.year === year)).map((year) => ({
                  value: year,
                  label: year,
                }))}
              />
              ) : <></>}
                </View>
                <View style={styleResumen.Containerbutton}>
                <SegmentedButtons
                    style={styleResumen.button}
                    theme={{ colors: { secondaryContainer: theme.colors.segmented, onSecondaryContainer:theme.colors.pieBackground, onSurface:theme.colors.white } }}
                    value={selectedMonth2}
                    onValueChange={(month) => setSelectedMonth2(month)}
                    buttons={monthsWithData.map(month => ({ value: Object.keys(months).find(key => months[key] === month), label: month }))}
                  />
              </View>
              <View>
            {stackData && (
                <BarChart
                key={filteredStackData.map(item => item.id).join(',')}
                data={filteredStackData}
                width={screenWidth - 120}
                height={screenWidth - 120}
                barWidth={barChart.barWidth}
                isAnimated
                formatYLabel={(value) => formatYLabel(value, selectedMoneda)}
                spacing={barChart.spacing}
                noOfSections={barChart.noOfSections}
                initialSpacing={barChart.initialSpacing}
                rulesColor= {theme.colors.pieBackground}
                yAxisTextStyle= {styleResumen.ejeYstyle}
                backgroundColor={theme.colors.pieInner}
                yAxisThickness={barChart.ejesThickness}
                xAxisThickness={barChart.ejesThickness}
                barBorderRadius={barChart.barBorderRadius}
                leftShiftForLastIndexTooltip={50}
                maxValue={maxFilteredValue}
                autoShiftLabels
                hideOrigin
                renderTooltip={(item, index) => {
                    return (
                      <View style={styleResumen.tooltipBarChart}>
                        <Text style={styleResumen.textLegend}>{item.frontColor===theme.colors.gasto && atributos.gasto || atributos.ingreso}</Text>
                        <Text style={styleResumen.pieCenterDescription}>{selectedMoneda}${item.value}</Text>
                      </View>
                    );
                  }}
                />
            )}
        </View>
        {stackData && (
        <View>
            <ResponsablesSection data={pares} selectedMoneda={selectedMoneda} title={atributos.gasto} selectedMonth={months[selectedMonth2]} selectedYear={selectedYear}/>
            <ResponsablesSection data={impares} selectedMoneda={selectedMoneda} title={atributos.ingreso} selectedMonth={months[selectedMonth2]} selectedYear={selectedYear}/>
        </View>
        )}
      </Card.Content>
      )}
        </Card>
          ) : (<></>)}
        </View>
          )}
        </View>
  );
};

export default IngrGastResponsable;
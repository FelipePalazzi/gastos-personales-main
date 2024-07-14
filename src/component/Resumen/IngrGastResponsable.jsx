import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { styleResumen, screenWidth } from '../../styles/styles.js';
import { months, monedaMaxValues } from '../../constants.js';
import { filterData, formatYLabel} from '../../utils.js';
import { BarChart } from 'react-native-gifted-charts';
import theme from '../../styles/theme.js';
import { atributos, symbols} from '../../constants.js';
import { SegmentedButtons, Card, Icon } from 'react-native-paper';

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
          frontColor: '#006DFF',
          gradientColor: '#009FFF',
          spacing: 10,
          labelWidth: 50,
          label: item3.nombre,
        },
        {
          value: parseInt(item3[`${atributos.ingresoResumen} ${selectedMoneda}`] || 0),
          year: item3.year,
          month: months[item3.month],
          frontColor: '#33CC33',
          gradientColor: '#66FF66',
          spacing:8,
        },
      ]);

        setStackData(stackData)
        setMaxFilteredValue(maxFilteredValue + monedaMaxValues[selectedMoneda]);

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
        setMaxFilteredValue(maxFilteredValue);
      }
      const availableMonths = [...new Set(stackData.filter(item => item.year === selectedYearRef).map(item => item.month))];
      setMonthsWithData(availableMonths);
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
    <View>
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
                theme={{ colors: { secondaryContainer: theme.colors.segmented } }}
                value={selectedYear}
                onValueChange={(year) => setSelectedYear(year)}
                buttons={uniqueYears.filter(year => stackData.some(item => item.year === year)).map((year) => ({
                  value: year,
                  label: year,
                }))}
              />
              ) : 
              <Text>Año: {search}</Text>}
                </View>
                <View style={styleResumen.Containerbutton}>
                <SegmentedButtons
                    style={styleResumen.button}
                    theme={{ colors: { secondaryContainer: theme.colors.segmented } }}
                    value={selectedMonth2}
                    onValueChange={(month) => setSelectedMonth2(month)}
                    buttons={monthsWithData.map(month => ({ value: Object.keys(months).find(key => months[key] === month), label: month }))}
                  />
              </View>
              <View>
        <Text> ${selectedMoneda}</Text>
            {stackData && (
                <BarChart
                key={filteredStackData.map(item => item.id).join(',')}
                data={filteredStackData}
                width={screenWidth - 40}
                barWidth={25}
                formatYLabel={(value) => formatYLabel(value, selectedMoneda)}
                spacing={30}
                hideRules
                yAxisThickness={0}
                xAxisThickness={0}
                barBorderRadius={4}
                maxValue={maxFilteredValue}
                initialSpacing={20}
                />
            )}
        </View>
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
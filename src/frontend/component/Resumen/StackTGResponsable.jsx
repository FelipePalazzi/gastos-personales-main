import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { styleResumen, screenWidth } from '../../styles/styles.js';
import { months, monedaMaxValues, symbols } from '../../../constants.js';
import { filterData, formatYLabel, getColor} from '../../utils.js';
import { BarChart } from 'react-native-gifted-charts';
import theme from '../../theme/theme.js';
import { atributos, barChart} from '../../../constants.js';
import { SegmentedButtons, Card, Icon } from 'react-native-paper';
import ResponsablesSection from './ResponsablesSection.jsx';

const StackTGResponsable = ({ resumen, search, selectedMoneda })=> {
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

  useEffect(() => {
    const defaultYear = uniqueYears[0];
    const defaultMonth = uniqueMonths[0];
    setSelectedYear(defaultYear);
    setSelectedMonth2(defaultMonth);
  }, [resumen, uniqueYears, uniqueMonths]);

  useEffect(() => {
    const data = resumen[3];
    const datagasto = resumen [4]
    const filteredData = filterData(data, search,'','','year');
    const filteredDatagasto = filterData(datagasto, search,'','','year');
    const uniqueYears = [...new Set(filteredDatagasto.map(item => item.year))];
    const uniqueMonths = [...new Set(filteredDatagasto.map(item => item.month))];
    setUniqueYears(uniqueYears);
    setUniqueMonths(uniqueMonths);
    if (uniqueYears.length === 1) {
      setSelectedYear(uniqueYears[0]);
      setSelectedMonth2(uniqueMonths[0]);
    } else if (search.includes(uniqueYears[0])) { 
      setSelectedYear(uniqueYears[0]);
      setSelectedMonth2(uniqueMonths[0]);
    }
    
    const stackedData = filteredData.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.label === item.nombre && i.month === months[item.month] && i.year === item.year);
        if (!existingItem) {
          const newGastoItem = {
            spacing: 10,
            labelTextStyle: [styleResumen.labels,{width:70}],
            label: item.nombre,
            month: months[item.month],
            year: item.year,
            borderTopLeftRadius:5,
            borderTopRightRadius:5,
            stacks: [
              {
                value: 0,
              },
            ],
          };
          acc.push(newGastoItem);
        }
      
        const ingresoBar = {
          label: `${item.nombre} ${atributos.primary}`,
          labelTextStyle: {color:theme.colors.transparente},
          spacing: 8,
          month: months[item.month],
          year: item.year,
          stacks: [
            {
              value: parseInt(item[`${atributos.ingresoResumen} ${selectedMoneda}`] || 0),
              color: theme.colors.primary,
            },
          ],
        };
        acc.push(ingresoBar);
      
        return acc;
      }, []);
      
      filteredDatagasto.forEach((item) => {
        const existingItem = stackedData.find((i) => i.label === item.nombre && i.month === months[item.month] && i.year === item.year);
        if (existingItem) {
          const gastoBar = existingItem.stacks.find((s) => s.label === atributos.gasto);
          if (!gastoBar) {
            existingItem.stacks.push({
              value: 0,
            });
          }
          existingItem.stacks.push({
            value: parseInt(item[`${atributos.gastoResumen} ${selectedMoneda}`] || 0),
            color: getColor(item.tipogasto),
            label: item.tipogasto,
          });
        }
      });
      setStackData(stackedData);

  }, [resumen, search, selectedMoneda]);

  useEffect(() => {
    setSelectedYearRef(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (resumen[3] && resumen[4] && stackData) {
      const filteredData = stackData.filter(item => item.year === selectedYearRef && item.month === months[selectedMonth2]);

      let maxValue = 0;
      filteredData.forEach(item => {
        const maxStackValue = Math.max(...item.stacks.map(stack => stack.value));
        maxValue = Math.max(maxValue, maxStackValue);
      });
      setMaxFilteredValue(maxValue * monedaMaxValues[selectedMoneda]);
      setTempFilteredStackData(filteredData);
      
      const availableMonths = [...new Set(stackData.filter(item => item.year === selectedYearRef).map(item => item.month))];
      setMonthsWithData(availableMonths);

      const groupedGastos = filteredData.reduce((acc, item) => {
        item.stacks.forEach((stack) => {
          if (stack.value > 0 && stack.label !== atributos.primary && stack.label !==undefined) {
            const tipogasto = stack.label;
            const existingTipogasto = acc[tipogasto];
            if (existingTipogasto) {
              existingTipogasto.value += stack.value;
            } else {
              acc[tipogasto] = { value: stack.value, label: tipogasto };
            }
          }
        });
        return acc;
      }, {});
      
      const imparesTransformed = Object.entries(groupedGastos)
        .map(([key, value]) => ({ label: key, value: value.value }));
      setImpares(imparesTransformed);
    }
  }, [resumen, selectedYearRef, selectedMonth2, stackData]);


  useEffect(() => {
    setFilteredStackData(tempFilteredStackData);
  }, [tempFilteredStackData]);

  useEffect(() => {
    if ( resumen[3] && resumen[4] && stackData) {
    const availableMonths = [...new Set(stackData.filter(item => item.year === selectedYear).map(item => item.month))];
      if (availableMonths.length > 0) {
        const firstMonthWithData = Object.keys(months).find(key => months[key] === availableMonths[0]);
        setSelectedMonth2(firstMonthWithData);
      }
    }
  }, [selectedYear, resumen, stackData]);

  const renderDot = color => {
    return (
      <View
        style={[styleResumen.renderDot,{backgroundColor: color,}]}
      />
    );
  };
  
  const renderSquare = color => {
    return (
      <View
        style={[styleResumen.renderSquare,{backgroundColor: color,}]}
      />
    );
  };

  const renderGastosLegendComponent = () => {
    const hasGastos = filteredStackData.some(item => item.stacks.some(stack => stack.value > 0 && !item.label.includes(atributos.primary)));
  
    if (!hasGastos) return null;
  
    return (
      <View style={styleResumen.viewContainerResponsableSection}>
        <Text style={styleResumen.title}>{atributos.gasto}</Text>
        <View style={styleResumen.containerLegend}>
          {filteredStackData.flatMap(item => {
            return item.stacks.filter(stack => stack.value > 0 && !item.label.includes(atributos.primary)).map(stack => (
                <View style={styleResumen.containerLegendText}>
                  {renderDot(stack.color)}
                  <Text style={styleResumen.textLegend}>
                    {item.label} {stack.label}: {symbols.peso}{stack.value}
                  </Text>
                </View>
            ));
          })}
        </View>
      </View>
    );
  };
  
  const renderIngresosLegendComponent = () => {
    const hasIngresos = filteredStackData.some(item => item.stacks.some(stack => stack.value > 0 && item.label.includes(atributos.primary)));
  
    if (!hasIngresos) return null;
  
    return (
      <View style={styleResumen.viewContainerResponsableSection}>
        <Text style={styleResumen.title}>{atributos.primary}</Text>
        <View style={styleResumen.containerLegend}>
          {filteredStackData.flatMap(item => {
            return item.stacks.filter(stack => stack.value > 0 && item.label.includes(atributos.primary)).map(stack => (
                <View style={styleResumen.containerLegendText}>
                  {renderSquare(stack.color)}
                  <Text style={styleResumen.textLegend}>
                    {item.label} {stack.label}: {symbols.peso}{stack.value}
                  </Text>
                </View>
            ));
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styleResumen.viewContainer}>
    {stackData && (
        <View>
          {((search.length >= 0 && search.length < 4)   || (search.length === 4 && search.match(/^\d{4}$/) && (stackData.some(item => item.stacks.some(stack => stack.value === 0))))) ? (
    <Card style={styleResumen.titleContainer} >
      <TouchableOpacity onPress={() => setCard(!card)}>
          <Card.Title
            title={`Por ${atributos.tipo_gasto}s ${search.length === 4 && search.match(/^\d{4}$/)? search : ''}`}
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
                theme={{ colors: { secondaryContainer: theme.colors.primary, onSecondaryContainer:theme.colors.pieBackground, onSurface:theme.colors.white  } }}
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
                    theme={{ colors: { secondaryContainer: theme.colors.primary, onSecondaryContainer:theme.colors.pieBackground, onSurface:theme.colors.white } }}
                    value={selectedMonth2}
                    onValueChange={(month) => setSelectedMonth2(month)}
                    buttons={monthsWithData.map(month => ({ value: Object.keys(months).find(key => months[key] === month), label: month }))}
                  />
              </View>
              <View>
              {stackData && filteredStackData && filteredStackData.some(item => item.year === selectedYear) && (
              <BarChart
                key={filteredStackData.map(item => item.id).join(',')}
                stackData={filteredStackData}
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
                leftShiftForLastIndexTooltip={50}
                maxValue={maxFilteredValue}
                autoShiftLabels
                disableScroll
                hideOrigin
                renderTooltip={(item, index) => {
                    return (
                      <View style={styleResumen.tooltipBarChart}>
                        <Text style={styleResumen.textLegend}>{item.spacing===10 && atributos.gasto || atributos.primary}</Text>
                      </View>
                    );
                  }}
                />
            )}
                    </View>
        {renderGastosLegendComponent()}
        {renderIngresosLegendComponent()}
        {stackData && impares && impares.length > 0 && (
        <View>
            <ResponsablesSection data={impares} selectedMoneda={selectedMoneda} title={atributos.tipo_gasto} selectedMonth={months[selectedMonth2]} selectedYear={selectedYear}/>
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

export default StackTGResponsable;
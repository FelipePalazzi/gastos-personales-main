import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, PanResponder} from 'react-native';
import { styleResumen, screenWidth } from '../../styles/styles.js';
import { months, monedaMaxValues } from '../../constants.js';
import { filterData, formatYLabel} from '../../utils.js';
import { LineChart } from 'react-native-gifted-charts';
import theme from '../../styles/theme.js';
import { lineChart, pointerConfig, alerts, atributos, symbols} from '../../constants.js';
import { SegmentedButtons, Card, Icon } from 'react-native-paper';

const IngrGastDiaMes = ({ resumen, search, selectedMoneda }) => {
  const [areaChartData, setAreaChartData] = useState(null);
  const [areaChartData2, setAreaChartData2] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const [months0, setMonths0] = useState({});
  const [selectedValue, setSelectedValue] = useState('Dia');
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [card, setCard] = useState(false)

  const handleValueChange = (value) => {
    setSelectedValue(value);
    showOrHidePointer(0);
  };

  useEffect(() => {
    const data = resumen[selectedValue === 'Dia'? 2 : 1];
    const filteredData = filterData(data, search,'','','year');

    const monthsObj = {};
      filteredData.forEach(item => {
        if (!monthsObj[item.month]) {
          monthsObj[item.month] = true;
        }
      });
      setMonths0(monthsObj);

      const maxGastoAr = Math.max(...filteredData.map(item => parseInt(item[`${atributos.gastoResumen} ${selectedMoneda}`])));
      const maxIngresoAr = Math.max(...filteredData.map(item => parseInt(item[`${atributos.ingresoResumen} ${selectedMoneda}`])));
      const maxValue = Math.max(maxGastoAr, maxIngresoAr);     
      setMaxValue(maxValue + monedaMaxValues[selectedMoneda]);

      const areaChartData = filteredData.map((item, index) => ({
        value: parseInt(item[`${atributos.gastoResumen} ${selectedMoneda}`] || 0),
        date: selectedValue === 'Dia' ? `${item.day} ${months[item.month]}` : months[item.month],
        label: selectedValue === 'Dia' ? `${search.length!== 4? `${item.day} ${months[item.month]}\n${item.year}` : `${item.day} ${months[item.month]}`}` : `${months[item.month]}\n${item.year}`,
        labelTextStyle: { fontSize: 13,margin:-8},
        customDataPoint: customDataPoint,
      }));
      const areaChartData2 = filteredData.map((item2, index) => ({
        value: parseInt(item2[`${atributos.ingresoResumen} ${selectedMoneda}`] || 0),
        date: selectedValue === 'Dia' ? `${item2.day} ${months[item2.month]}` : months[item2.month],
        label: selectedValue === 'Dia' ? `${search.length!== 4? `${item2.day} ${months[item2.month]}\n${item2.year}` : `${item2.day} ${months[item2.month]}`}` : `${months[item2.month]}\n${item2.year}`,
        customDataPoint: customDataPoint,
      }));

      setAreaChartData(areaChartData);
      setAreaChartData2(areaChartData2);

  }, [resumen, search, selectedValue, selectedMoneda]);

const months2 = useMemo(() => Object.keys(months0).map(month => months[month]), [months0]);

const ref = useRef(null);

const showOrHidePointer = useCallback((ind) => {
  const month = months2[ind];
  setSelectedMonth(month);
  const firstDateIndex = areaChartData.findIndex(item => item.date.includes(month));
  if (firstDateIndex !== -1) {
    ref.current?.scrollTo({ x: firstDateIndex * 50 });
  }
}, [areaChartData, months2]);

const customDataPoint = useCallback(() => (
  <View style={styleResumen.datapoint} />
), []);

const position = useRef({ x: 0, y: 0 }).current;
const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });

const deviceWidth = screenWidth;

const panResponder = useRef(
   PanResponder.create({
     onStartShouldSetPanResponder: () => true,
     onMoveShouldSetPanResponder: () => true,
     onPanResponderGrant: (evt, gestureState) => {
       // The touch has started
       position.x = gestureState.x0;
       position.y = gestureState.y0;
       setTouchPosition({ x: gestureState.x0, y: gestureState.y0 });
     },
     onPanResponderMove: (evt, gestureState) => {
       // The touch is moving
       position.x = gestureState.moveX;
       position.y = gestureState.moveY;
       setTouchPosition({ x: gestureState.moveX, y: gestureState.moveY });
     },
     onPanResponderRelease: (evt, gestureState) => {
       // The touch has ended
       position.x = gestureState.moveX;
       position.y = gestureState.moveY;
       setTouchPosition({ x: gestureState.moveX, y: gestureState.moveY });
     },
   }),
 ).current;

  return (
    <View>
    {areaChartData && areaChartData2 && (
        <View>
          {((search.length >= 0 && search.length < 4)   || (search.length === 4 && search.match(/^\d{4}$/) && (areaChartData.some(item => item.value === 0) || areaChartData2.some(item2 => item2.value === 0)))) ? (
            <Card style={styleResumen.titleContainer} >
      
      <TouchableOpacity onPress={() => setCard(!card)}>
          <Card.Title
            title={`Por ${selectedValue} ${search.length === 4 && search.match(/^\d{4}$/)? search : ''}`}
            titleStyle={styleResumen.title}
            right={(props) => <Icon source={card? theme.icons.arriba : theme.icons.abajo} size={theme.fontSizes.body} color={theme.colors.white} />}
            rightStyle={styleResumen.rightCardTitle}
          />
        </TouchableOpacity>
      
            {card && (  <Card.Content style={styleResumen.container}>
      
              <SegmentedButtons
                style={styleResumen.button}
                theme={{ colors: { secondaryContainer: theme.colors.segmented } }}
                value={selectedValue}
                onValueChange={handleValueChange}
                buttons={[
                  {
                    value: 'Dia', label: 'Dia',
                  },
                  { value: 'Mes', label: 'Mes' },
                ]}
              />
              <View style={styleResumen.Containerbutton}>
                {search.length === 4 && selectedValue === 'Dia' ? (
                  <SegmentedButtons
                    style={styleResumen.button}
                    theme={{ colors: { secondaryContainer: theme.colors.segmented } }}
                    value={selectedMonth}
                    onValueChange={(month) => showOrHidePointer(months2.indexOf(month))}
                    buttons={months2.map((item, index) => ({
                      value: item,
                      label: item,
                    }))}
                  />
                ) : null}
              </View>
              <View
           {...panResponder.panHandlers}
           style={{}}
       >
        <Text> ${selectedMoneda}</Text>
              <LineChart
                onScroll={(event) => {
                  const x = event.nativeEvent.contentOffset.x+10;
                  const graphWidth = lineChart.width;
                  const monthWidth = graphWidth / (months2.length*0.2);
                  const visibleMonthIndex = Math.floor(x / monthWidth);
                  const visibleMonth = months2[visibleMonthIndex];
                  setSelectedMonth(visibleMonth);
                }}    
                formatYLabel={(value) => formatYLabel(value, selectedMoneda)}
                scrollRef={ref}
                data={areaChartData}
                data2={areaChartData2}
                maxValue={maxValue}
                isAnimated
                areaChart
                curved
                rotateLabel
                showVerticalLines
                animationDuration={lineChart.animacionDuration}
                xAxisTextNumberOfLines={lineChart.xAxisTextNumberOfLines}
                width={screenWidth-95}
                height={lineChart.height}
                initialSpacing={lineChart.initialSpacing}
                spacing={lineChart.spacing}
                thickness={lineChart.thickness}
                startOpacity={lineChart.startOpacity}
                endOpacity={lineChart.endOpacity}
                noOfSections={lineChart.noOfSections}
                yAxisThickness={lineChart.yAxisThickness}
                xAxisThickness={lineChart.xAxisThickness}
                verticalLinesColor={theme.colors.primary}
                color1={theme.colors.gasto}
                color2={theme.colors.agregar}
                startFillColor1={theme.colors.gasto}
                startFillColor2={theme.colors.agregar}
                endFillColor1={theme.colors.white}
                endFillColor2={theme.colors.white}
                rulesColor={theme.colors.primary}
                yAxisTextStyle={styleResumen.ejeYstyle}
                focusEnabled={true}
                pointerConfig={{
                  hidePointer1: true,
                  hidePointer2: true,
                  pointerStripHeight: pointerConfig.pointerStripHeight,
                  strokeDashArray: pointerConfig.strokeDashArray,
                  pointerStripColor: theme.colors.edit,
                  pointerStripWidth: pointerConfig.pointerStripWidth,
                  pointerColor: theme.colors.gray,
                  radius: pointerConfig.radius,
                  pointerLabelWidth: pointerConfig.pointerLabelWidth,
                  pointerLabelHeight: pointerConfig.pointerLabelHeight,
                  activatePointersOnLongPress: true,
                  autoAdjustPointerLabelPosition: false,
                  shiftPointerLabelX: touchPosition.x < deviceWidth / 4 ? 40 : touchPosition.x > deviceWidth * 0.6 ? -40  : 0 ,
                  pointerLabelComponent: items => {
                    return (
                        <View style={styleResumen.pointer}>
                          <View style={styleResumen.fechaContainerPointer}> 
                          <Text style={styleResumen.fechaPointer}>
                            {items[0].date}
                          </Text>
                          </View>
                          <View style={styleResumen.containerPointer}>
                            <Text style={styleResumen.titlePointer}>
                              {atributos.gasto}
                            </Text>
                            <Text style={styleResumen.textPointer}>
                              {selectedMoneda + symbols.peso + items[0].value}
                            </Text>
                            <Text style={styleResumen.titlePointer}>
                              {atributos.ingreso}
                            </Text>
                            <Text style={styleResumen.textPointer}>
                              {selectedMoneda + symbols.peso + items[1].value}
                            </Text>
                          </View>
                        </View>
           
                    );
                 },
                }}
              />
      </View>
      </Card.Content>
      )}
        </Card>
          ) : (
            <View style={[styleResumen.titleContainer, {backgroundColor:theme.colors.gasto}]}>
            <Text style={[styleResumen.title, {marginBottom:15},{marginHorizontal:20}, {color: theme.colors.white}]}>{`${alerts.noData}${' para el año '}${search}`}</Text>
            </View>
          )}
        </View>
          )}
 </View>
  );
};

export default IngrGastDiaMes;
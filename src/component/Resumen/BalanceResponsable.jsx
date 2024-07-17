import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, PanResponder} from 'react-native';
import { styleResumen, screenWidth } from '../../styles/styles.js';
import { months, monedaMaxValues } from '../../constants.js';
import { filterData, formatYLabel} from '../../utils.js';
import { LineChartBicolor } from 'react-native-gifted-charts';
import theme from '../../styles/theme.js';
import { lineChart, pointerConfig, alerts, atributos, symbols} from '../../constants.js';
import { SegmentedButtons, Card, Icon } from 'react-native-paper';

const BalanceResponsable = ({ resumen, search, selectedMoneda }) => {
  const [areaChartData, setAreaChartData] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const [months0, setMonths0] = useState({});
  const [selectedResponsable, setSelectedResponsable] = useState('1');
  const [card, setCard] = useState(false)

  const handleValueChange = (value) => {
    setSelectedResponsable(value);
    showOrHidePointer(0);
  };

  useEffect(() => {
    const data = resumen[5,selectedResponsable];
    const filteredData = filterData(data, search,'','','year');

    const monthsObj = {};
      filteredData.forEach(item => {
        if (!monthsObj[item.month]) {
          monthsObj[item.month] = true;
        }
      });
      setMonths0(monthsObj);

      const maxValue = Math.max(...filteredData.map(item => parseInt(item[`${atributos.balanceResumen} ${selectedMoneda}`])));
      setMaxValue(maxValue * monedaMaxValues[selectedMoneda]);

      const areaChartData = filteredData.map((item, index) => ({
        value: parseInt(item[`${atributos.balanceResumen} ${selectedMoneda}`] || 0),
        date: `${item.day} ${months[item.month]}`,
        label: `${search.length!== 4? `${item.day} ${months[item.month]}\n${item.year}` : `${item.day} ${months[item.month]}`}`,
        labelTextStyle: { fontSize: 13,margin:-8, color: theme.colors.white},
        customDataPoint: customDataPoint,
      }));

      setAreaChartData(areaChartData);

  }, [resumen, search, selectedResponsable, selectedMoneda]);

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
    <View style={[styleResumen.viewContainer, {marginTop:10}]}>
    {areaChartData && (
        <View>
          {((search.length >= 0 && search.length < 4)   || (search.length === 4 && search.match(/^\d{4}$/) && (areaChartData.some(item => item.value === 0)))) ? (
            <Card style={styleResumen.titleContainer} >
      
      <TouchableOpacity onPress={() => setCard(!card)}>
          <Card.Title
            title={`Balance por ${atributos.responsable} ${search.length === 4 && search.match(/^\d{4}$/)? search : ''}`}
            titleStyle={styleResumen.title}
            right={(props) => <Icon source={card? theme.icons.arriba : theme.icons.abajo} size={theme.fontSizes.body} color={theme.colors.white} />}
            rightStyle={styleResumen.rightCardTitle}
          />
        </TouchableOpacity>
      
            {card && (  <Card.Content style={styleResumen.container}>
      
              <SegmentedButtons
                style={styleResumen.button}
                theme={{ colors: { secondaryContainer: theme.colors.segmented, onSecondaryContainer:theme.colors.pieBackground, onSurface:theme.colors.white } }}
                value={selectedResponsable}
                onValueChange={handleValueChange}
                buttons={[
                  {
                    value: '1', label: 'Fernanda',
                  },
                  { value: '2', label: 'Gaston' },
                ]}
              />
              <View
           {...panResponder.panHandlers}
           style={{}}
       >
              <LineChartBicolor
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
                maxValue={maxValue}
                isAnimated
                areaChart
                rotateLabel
                showVerticalLines
                adjustToWidth
                hideOrigin
                animationDuration={lineChart.animacionDuration}
                xAxisTextNumberOfLines={lineChart.xAxisTextNumberOfLines}
                width={screenWidth-95}
                height={screenWidth - 150}
                initialSpacing={lineChart.initialSpacing}
                spacing={lineChart.spacing}
                thickness={lineChart.thickness}
                startOpacity={lineChart.startOpacity}
                endOpacity={lineChart.endOpacity}
                noOfSections={lineChart.noOfSections}
                yAxisThickness={lineChart.ejesThickness}
                xAxisThickness={lineChart.ejesThickness}
                verticalLinesColor={theme.colors.primary}
                colorNegative={theme.colors.gasto}
                color={theme.colors.ingreso}
                startFillColorNegative={theme.colors.gasto}
                startFillColor={theme.colors.ingreso}
                endFillColorNegative={theme.colors.gasto}
                endFillColor={theme.colors.ingreso}
                rulesColor={theme.colors.pieBackground}
                backgroundColor={theme.colors.pieInner}
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
          ) : (<></>)}
        </View>
          )}
 </View>
  );
};

export default BalanceResponsable;
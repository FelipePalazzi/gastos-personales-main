import { View, Text, TouchableOpacity, ScrollView, PanResponder} from "react-native";
import { useState, useEffect, useRef} from "react";
import  {styleResumen, styleLista, screenWidth} from "../styles/styles.js";
import { Searchbar, ActivityIndicator,SegmentedButtons, Card, Icon } from 'react-native-paper';
import useResumen from "../hooks/useResumen";
import { LineChart, BarChart } from "react-native-gifted-charts";
import { filterData } from '../utils';
import theme from "../styles/theme.js";
import { lineChart, pointerConfig, alerts, atributos, symbols, button_text} from "../constants.js";

const Resumen = () => {
  const [search, setSearch] = useState('');
  const [areaChartData, setAreaChartData] = useState(null);
  const [areaChartData2, setAreaChartData2] = useState(null);
  const [stackData, setStackData] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const [maxFilteredValue, setMaxFilteredValue] = useState(0);
  const { loading, resumen } = useResumen();
  const [months0, setMonths0] = useState({});
  const [card, setCard] = useState(false)
  const [card2, setCard2] = useState(false)
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedMoneda, setSelectedMoneda] = useState('ARG');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth2, setSelectedMonth2] = useState('4');
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueMonths, setUniqueMonths] = useState([]);  
  const [filteredStackData, setFilteredStackData] = useState([]);
  const [tempFilteredStackData, setTempFilteredStackData] = useState([]);
  const [monthsWithData, setMonthsWithData] = useState([]);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    showOrHidePointer(0);
  };
  const handleMonedaChange = (value) => {
    setSelectedMoneda(value);
    showOrHidePointer(0);
  };

  const scrollViewRef = useRef(null) 

  const [contentOffset, setContentOffset] = useState({ y: 0 }) 

  const handleScroll = (event) => {
    setContentOffset(event.nativeEvent.contentOffset) 
  } 

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
    const defaultYear = uniqueYears[0];
    const defaultMonth = uniqueMonths[0];
    setSelectedYear(defaultYear);
    setSelectedMonth2(defaultMonth);
  }, []);

  useEffect(() => {
    if (!loading && resumen && resumen[2] && resumen[3]) {

      const data = resumen[selectedValue === 'Dia'? 2 : selectedValue === 'Mes' ? 1 : 3];

      const filteredData = filterData(data, search,'','','year');
  
      const uniqueYears = [...new Set(filteredData.map(item => item.year))];
      const uniqueMonths = [...new Set(filteredData.map(item => item.month))];
      setUniqueYears(uniqueYears);
      setUniqueMonths(uniqueMonths);

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
        setAreaChartData(areaChartData);
        setAreaChartData2(areaChartData2);

        if (selectedMoneda === "ARG") {
          setMaxValue(maxValue + 10000);
          setMaxFilteredValue(maxFilteredValue + 10000);
        } else if (selectedMoneda === "UYU") {
          setMaxValue(maxValue + 5000);
          setMaxFilteredValue(maxFilteredValue + 5000);
        } else if (selectedMoneda === "USD") {
          setMaxValue(maxValue + 100);
          setMaxFilteredValue(maxFilteredValue + 100);
        }
      }

    }, [loading, resumen, search, selectedValue, selectedMoneda]);

    useEffect(() => {
      if (!loading && resumen && resumen[2] && resumen[3] && stackData) {
        const filteredData = stackData.filter(item => item.year === selectedYear && item.month === months[selectedMonth2]);
        setTempFilteredStackData(filteredData);
        if (filteredData.length > 0) {
          const maxFilteredValue = Math.max(...filteredData.map(item => item.value));
          setMaxFilteredValue(maxFilteredValue);
        }
        const availableMonths = [...new Set(stackData.filter(item => item.year === selectedYear).map(item => item.month))];
        setMonthsWithData(availableMonths);
      }
    }, [selectedYear, selectedMonth2, stackData]);
  
    useEffect(() => {
      setFilteredStackData(tempFilteredStackData);
    }, [tempFilteredStackData]);
    
  const customDataPoint = () => {
    return (
        <View style={styleResumen.datapoint}/>
    );
};

const months2 = Object.keys(months0).map(month => months[month]);

const ref = useRef(null);

const showOrHidePointer = (ind) => {
  const month = months2[ind];
  setSelectedMonth(month)
  const firstDateIndex = areaChartData.findIndex(item => item.date.includes(month));
  if (firstDateIndex!== -1) {
    ref.current?.scrollTo({ x: firstDateIndex * 50 });
  }

};

const formatYLabel = (value) => {
  if (value > 1000 && selectedMoneda === 'ARG') {
    return `${symbols.peso}${(value / 1000).toFixed(0)}${symbols.mil}`;
  } else if (selectedMoneda==='ARG'){
    return `${symbols.peso}${value}`;
  } else if (value > 1000 && selectedMoneda === 'UYU') {
    return `${symbols.peso}${(value / 1000).toFixed(0)}${symbols.mil}`;
  } else if (selectedMoneda==='UYU'){
    return `${symbols.peso}${value}`;
  } else if (value > 1000 && selectedMoneda === 'USD') {
    return `${symbols.peso}${(value / 1000).toFixed(1)}${symbols.mil}`;
  } else if (selectedMoneda==='USD'){
    return `${symbols.peso}${value}`;
  }
};

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
  <ScrollView  showsVerticalScrollIndicator={true}
  vertical
  style={styleLista.scroll}
  onScroll={handleScroll}
  scrollEventThrottle={theme.scroll.desplazamiento}
  ref={scrollViewRef}
  >
  <View>

    <Searchbar
      placeholder={button_text.ingreseAño}
      style={styleLista.search}
      elevation={theme.search.elevation}
      onChangeText={setSearch}
      value={search}
      inputStyle={styleLista.textRowTable}
      placeholderTextColor={theme.colors.textPrimary}
      iconColor={theme.colors.textPrimary}
    />
    {loading  &&(
        <View style={styleLista.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styleLista.loadingText}>{alerts.cargando}</Text>
        </View>
      )}
    {areaChartData && areaChartData2 && (
  <View>
    {((search.length >= 0 && search.length < 4)   || (search.length === 4 && search.match(/^\d{4}$/) && (areaChartData.some(item => item.value === 0) || areaChartData2.some(item2 => item2.value === 0)))) ? (
      <>
      <View style={styleResumen.monedaButton}>
        <Text style={styleResumen.textPointer}>Seleccione tipo de moneda</Text>
        <SegmentedButtons
          style={styleResumen.button}
          theme={{ colors: { secondaryContainer: theme.colors.segmented } }}
          value={selectedMoneda}
          onValueChange={handleMonedaChange}
          buttons={[
            {
              value: 'ARG', label: 'ARG',
            },
            { value: 'UYU', label: 'UYU' ,
          },
          { value: 'USD', label: 'USD' ,
        }
          ]}
        />
        </View>
      <Card style={styleResumen.titleContainer} >

<TouchableOpacity onPress={() => setCard(!card)}>
    <Card.Title
      title={`${atributos.ingreso}${symbols.and}${atributos.gasto} por ${selectedValue} ${search.length === 4 && search.match(/^\d{4}$/)? search : ''}`}
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

          formatYLabel={formatYLabel}
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
      </>
    ) : (
      <View style={[styleResumen.titleContainer, {backgroundColor:theme.colors.gasto}]}>
      <Text style={[styleResumen.title, {marginBottom:15},{marginHorizontal:20}, {color: theme.colors.white}]}>{`${alerts.noData}${' para el año '}${search}`}</Text>
      </View>
    )}
  </View>
    )}


{stackData && (
  <View>
    {((search.length >= 0 && search.length < 4)   || (search.length === 4 && search.match(/^\d{4}$/) && (stackData.some(item => item.value === 0)))) ? (
      <>
      <View style={styleResumen.monedaButton}></View>
      <Card style={styleResumen.titleContainer} >

<TouchableOpacity onPress={() => setCard2(!card2)}>
    <Card.Title
      title={`${atributos.ingreso}${symbols.and}${atributos.gasto} por ${atributos.responsable} ${search.length === 4 && search.match(/^\d{4}$/)? search : ''}`}
      titleStyle={styleResumen.title}
      right={(props) => <Icon source={card2? theme.icons.arriba : theme.icons.abajo} size={theme.fontSizes.body} color={theme.colors.white} />}
      rightStyle={styleResumen.rightCardTitle}
    />
  </TouchableOpacity>

      {card2 && (  
      <Card.Content style={styleResumen.container}>
        <View style={styleResumen.Containerbutton}>
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
      </>
    ) : (<></>)}
  </View>
    )}
  </View>
  </ScrollView>
)}

export default Resumen;
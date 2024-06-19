import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect, useRef } from "react";
import  {styleResumen, styleLista} from "../styles/styles.js";
import { Searchbar, Portal, ActivityIndicator,SegmentedButtons } from 'react-native-paper';
import useResumen from "../hooks/useResumen";
import { LineChart } from "react-native-gifted-charts";
import { filterData } from '../utils';
import theme from "../styles/theme.js";
import { lineChart, pointerConfig, alerts, atributos, symbols} from "../constants.js";

const Resumen = () => {
  const [search, setSearch] = useState('');
  const [areaChartData, setAreaChartData] = useState(null);
  const [areaChartData2, setAreaChartData2] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const { loading, resumen } = useResumen();
  const [months0, setMonths0] = useState({});

  const [selectedValue, setSelectedValue] = useState('Dia');

  const handleValueChange = (value) => {
    setSelectedValue(value);
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
    if (!loading && resumen && resumen[2]) {

      const data = resumen[selectedValue === 'Dia'? 2 : 1];

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
        date: selectedValue === 'Dia' ? `${item.day} ${months[item.month]}` : months[item.month],
        label: selectedValue === 'Dia' ? `${search.length!== 4? `${item.day} ${months[item.month]}\n${item.year}` : `${item.day} ${months[item.month]}`}` : `${months[item.month]}\n${item.year}`,
        labelTextStyle: { fontSize: 13,margin:-8},
        customDataPoint: customDataPoint,
      }));
      const areaChartData2 = filteredData.map((item2, index) => ({
        value: parseInt(item2["INGRESO AR"] || 0),
        date: selectedValue === 'Dia' ? `${item2.day} ${months[item2.month]}` : months[item2.month],
        label: selectedValue === 'Dia' ? `${search.length!== 4? `${item2.day} ${months[item2.month]}\n${item2.year}` : `${item2.day} ${months[item2.month]}`}` : `${months[item2.month]}\n${item2.year}`,
        customDataPoint: customDataPoint,
      }));
        setAreaChartData(areaChartData);
        setAreaChartData2(areaChartData2);
    }
  }, [loading, resumen, search, selectedValue]);

  const customDataPoint = () => {
    return (
        <View style={styleResumen.datapoint}/>
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

const formatYLabel = (value) => {
  if (value > 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  } else {
    return `$${value}`;
  }
};

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
      placeholder="Ingrese Año"
      style={styleLista.search}
      elevation={theme.search.elevation}
      onChangeText={setSearch}
      value={search}
    />
    {loading  &&(
        <View style={styleLista.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styleLista.loadingText}>{alerts.cargando}</Text>
        </View>
      )}
    {areaChartData && areaChartData2 && (
      <View style={styleResumen.container}>
        <Text style={styleResumen.title}>
          {`${atributos.ingreso}${symbols.and}${atributos.gasto} por ${selectedValue}`}
          {search.length === 4 && search.match(/^\d{4}$/)? ` ${search}` : ''}
        </Text>
        <SegmentedButtons
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
                <>
                  {months2.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styleResumen.button}
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
          width={lineChart.width}
          height={lineChart.height}
          initialSpacing={lineChart.initialSpacing}
          spacing={lineChart.spacing}
          thickness={lineChart.thickness}
          startOpacity={lineChart.startOpacity}
          endOpacity={lineChart.endOpacity}
          noOfSections={lineChart.noOfSections}
          yAxisThickness={lineChart.yAxisThickness}
          verticalLinesColor={theme.colors.primary}
          color1={theme.colors.delete}
          color2={theme.colors.agregar}
          startFillColor1={theme.colors.delete}
          startFillColor2={theme.colors.agregar}
          endFillColor1={theme.colors.white}
          endFillColor2={theme.colors.white}
          rulesColor={theme.colors.primary}
          yAxisTextStyle={styleResumen.ejeYstyle}
          pointerConfig={{
            dataPointLabelShiftX: pointerConfig.dataPointLabelShiftX,
            dataPointLabelShiftY: pointerConfig.dataPointLabelShiftY,
            pointerStripHeight: pointerConfig.pointerStripHeight,
            strokeDashArray: pointerConfig.strokeDashArray,
            pointerStripColor: theme.colors.gray,
            pointerStripWidth: pointerConfig.pointerStripWidth,
            pointerColor: theme.colors.gray,
            radius: pointerConfig.radius,
            pointerLabelWidth: pointerConfig.pointerLabelWidth,
            pointerLabelHeight: pointerConfig.pointerLabelHeight,
            activatePointersOnLongPress: pointerConfig.activatePointersOnLongPress,
            pointerVanishDelay: pointerConfig.pointerVanishDelay,
            autoAdjustPointerLabelPosition: pointerConfig.autoAdjustPointerLabelPosition,
            pointerLabelComponent: (items) => {
              return (
                <Portal>
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
                        {symbols.peso + items[0].value}
                      </Text>
                      <Text style={styleResumen.titlePointer}>
                        {atributos.ingreso}
                      </Text>
                      <Text style={styleResumen.textPointer}>
                        {symbols.peso + items[1].value}
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
  </View>
  </ScrollView>
)}

export default Resumen;
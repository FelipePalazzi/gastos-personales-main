import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, PanResponder} from 'react-native';
import { styleResumen, screenWidth } from '../../styles/styles.js';
import { months, monedaMaxValues } from '../../../constants.js';
import { filterData, formatYLabel} from '../../utils.js';
import { LineChartBicolor } from 'react-native-gifted-charts';
import theme from '../../theme/theme.js';
import { lineChart, pointerConfig, alerts, atributos, symbols} from '../../../constants.js';
import { SegmentedButtons, Card, Icon } from 'react-native-paper';
import useResponsableIngreso from '../../hooks/useResponsable.js';

const BalanceResponsable = ({ resumen, selectedMoneda }) => {
  const [areaChartData, setAreaChartData] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const [selectedResponsable, setSelectedResponsable] = useState(1);
  const [card, setCard] = useState(false)
  const {responsableIngresos} = useResponsableIngreso()

  const handleValueChange = (value) => {
    setSelectedResponsable(value);
  };
  const buttons = responsableIngresos.map((responsable) => ({
    value: responsable.id,
    label: responsable.nombre,
    labelStyle:{fontSize:13}
  }));

  const responsableLabel = responsableIngresos.find((responsable) => responsable.id === selectedResponsable)?.nombre;

  useEffect(() => {

    const filteredData = resumen[`5,${selectedResponsable}`];

      const maxValue = Math.max(...filteredData.map(item => Math.abs(parseInt(item[`${atributos.balanceResumen} ${selectedMoneda}`]))));
      setMaxValue(maxValue * monedaMaxValues[selectedMoneda]);

      let lastMonthShown = null;

      const areaChartData = filteredData.map((item, index) => {
        const month = months[item.month];
        const year = item.year;
        const date = `${item.day} ${month} ${item.year}`;
        let label = '';
        let labelTextStyle = styleResumen.labelStyleBalance ;
        let showVerticalLine= false;
        
        if (lastMonthShown !== month) {
          label = `${month} ${year}`;
          lastMonthShown = month;
          showVerticalLine = true;
        } else {
          label = undefined;
        }
      
        return {
          value: parseInt(item[`${atributos.balanceResumen} ${selectedMoneda}`] || 0),
          date,
          label,
          labelTextStyle,
          showVerticalLine,
          hideDataPoint: true,
          verticalLineColor:theme.colors.pieBackground,
          verticalLineThickness:0.7,
        };
      });

      setAreaChartData(areaChartData);

  }, [resumen, selectedResponsable, selectedMoneda]);

const ref = useRef(null);

  return (
    <View style={styleResumen.viewContainer}>
    {areaChartData && (
        <View>
            <Card style={styleResumen.titleContainer} >
      
      <TouchableOpacity onPress={() => setCard(!card)}>
          <Card.Title
            title={`Balance por ${atributos.responsable}`}
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
                buttons={buttons}
              />
        {areaChartData.length > 1 ? (
        <View style={styleResumen.containerBalance}>
              <LineChartBicolor  
                formatYLabel={(value) => formatYLabel(value, selectedMoneda)}
                scrollRef={ref}
                data={areaChartData}
                maxValue={maxValue}
                scrollToEnd
                isAnimated
                areaChart
                adjustToWidth
                animationDuration={lineChart.animacionDuration}
                xAxisTextNumberOfLines={lineChart.xAxisTextNumberOfLines}
                width={screenWidth-95}
                yAxisExtraHeight={screenWidth-320}
                initialSpacing={lineChart.initialSpacing}
                endSpacing={lineChart.initialSpacing}
                spacing={lineChart.spacing-30}
                startOpacity={lineChart.startOpacity}
                endOpacity={lineChart.endOpacity}
                startOpacityNegatvie={lineChart.startOpacity}
                endOpacityNegative={lineChart.endOpacity}
                noOfSections={lineChart.noOfSections}
                noOfSectionsBelowXAxis={lineChart.noOfSections}
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
              />
                    <View>
                    <Text style={styleResumen.title}>
                        {atributos.responsable} actual: {responsableLabel}
                    </Text>
                    <Text style={styleResumen.title}>
                        {areaChartData.length > 0 ? 
                        `Balance Actual al: ${areaChartData[areaChartData.length - 1].date}` 
                        : ''}
                    </Text>
                    <Text style={[styleResumen.title, { color: areaChartData[areaChartData.length - 1].value > 0 ? theme.colors.ingreso : theme.colors.gasto }]}>
                    {areaChartData.length > 0 ? 
                        `${selectedMoneda} ${formatYLabel(areaChartData[areaChartData.length - 1].value, selectedMoneda)}` 
                        : ''}
                    </Text>
                    </View>
              </View>
              ) : (
                <View>
                  <Text style={styleResumen.title}>{alerts.errorLineChart}</Text>
                </View>
              )}
      </Card.Content>
      )}
        </Card>
        </View>
          )}
 </View>
  );
};

export default BalanceResponsable;
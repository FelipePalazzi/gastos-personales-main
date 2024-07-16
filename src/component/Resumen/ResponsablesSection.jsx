import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styleResumen } from '../../styles/styles.js';
import theme from '../../styles/theme.js';
import { pieChart, symbols} from '../../constants.js';
import { PieChart } from "react-native-gifted-charts";
import { getColor } from '../../utils.js';

const ResponsablesSection = ({ data, selectedMoneda, title, selectedMonth, selectedYear}) => {
    if (!data) return null; 

    const filteredData = data.filter(item => item.value !== 0);

    const total = filteredData.reduce((acc, current) => acc + current.value, 0);
    const [selectedIndex, setSelectedIndex] = useState(null);
  
    const pieData = useMemo(() => {
      return filteredData.map((item, index) => ({
        value: item.value,
        percentage: ((item.value / total) * 100).toFixed(2),
        color: getColor(item.label),
        label: item.label,
        focused: index === selectedIndex,
      }));
    }, [filteredData, selectedIndex, total]);

      useEffect(() => {
        const maxPercentage = Math.max(...pieData.map((item) => parseFloat(item.percentage)));
        const maxIndex = pieData.findIndex((item) => parseFloat(item.percentage) === maxPercentage);
        if (maxIndex !== -1) {
          setSelectedIndex(maxIndex);
        }
      }, [data]);
    
      const handlePress = (index) => {
        setSelectedIndex(index);
      };
    
const renderDot = color => {
  return (
    <View
      style={[styleResumen.renderDot,{backgroundColor: color,}]}
    />
  );
};

const renderLegendComponent = () => {
    return (
        <View style={styleResumen.containerLegend}>
        {pieData.map((item, index) => (
          <TouchableOpacity key={item.label} onPress={() => handlePress(index)}>
            <View
              style={styleResumen.containerLegendText}>
              {renderDot(item.color)}
              <Text style={styleResumen.textLegend}>
                {item.label}: {item.percentage}%
                </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const displayTitle = pieData.length > 0 
  ? `${title} ${symbols.peso}${selectedMoneda} ${selectedMonth} ${selectedYear}`
  : `No hay ${title} ${symbols.peso}${selectedMoneda} para ${selectedMonth} ${selectedYear}`;

return (
  <View
    style={styleResumen.containerResponsableSection}>
    <View
      style={styleResumen.viewContainerResponsableSection}>
      <Text style={styleResumen.title}>
      {displayTitle}
      </Text>
      <View style={styleResumen.viewPieChart}>
      <PieChart
            data={pieData}
            donut
            showGradient
            gradientCenterColor ={theme.colors.cell}
            sectionAutoFocus
            focusOnPress
            toggleFocusOnPress={false}
            radius={pieChart.radius}
            innerRadius={pieChart.innerRadius}
            innerCircleColor={theme.colors.pieInner}
            onPress={(item, index) => handlePress(index)}
            centerLabelComponent={() => {
              if (selectedIndex !== -1 && selectedIndex < pieData.length) {
                return (
                  <View style={styleResumen.viewCentrado}>
                    <Text style={styleResumen.pieCenter}>
                      {((pieData[selectedIndex].value / total) * 100).toFixed(2)}%
                    </Text>
                    <Text style={styleResumen.pieCenterDescription}>
                      {pieData[selectedIndex].label}
                    </Text>
                  </View>
                );
              }
              return null;
            }}
          />
      </View>
      {renderLegendComponent()}
    </View>
  </View>);
}

export default ResponsablesSection;
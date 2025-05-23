import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Path, Circle } from 'react-native-svg';
import { theme } from '../../utils/theme';

interface DataPoint {
  x: Date;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  color: string;
  maxValue?: number;
}

export function LineChart({ data, color, maxValue = 10 }: LineChartProps) {
  if (!data.length) return null;

  const width = Dimensions.get('window').width - 64;
  const height = 150;
  const padding = 20;

  const normalizedData = data.map(point => ({
    x: (point.x.getTime() - data[0].x.getTime()) / (data[data.length - 1].x.getTime() - data[0].x.getTime()),
    y: point.y / maxValue,
  }));

  const points = normalizedData.map(point => ({
    x: padding + point.x * (width - 2 * padding),
    y: padding + (1 - point.y) * (height - 2 * padding),
  }));

  const path = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    return `${acc} L ${point.x} ${point.y}`;
  }, '');

  return (
    <View style={styles.container}>
      <Svg height={height} width={width}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((y, i) => (
          <Line
            key={i}
            x1={padding}
            y1={padding + y * (height - 2 * padding)}
            x2={width - padding}
            y2={padding + y * (height - 2 * padding)}
            stroke={theme.colors.border}
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        ))}
        
        {/* Chart line */}
        <Path
          d={path}
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <Circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
          />
        ))}
      </Svg>
      
      <View style={styles.xAxis}>
        {data.map((point, i) => (
          <Text key={i} style={styles.label}>
            {`${point.x.getMonth() + 1}/${point.x.getDate()}`}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { FilterButtons } from './FilterButtons';
import { LineChart } from '../charts/LineChart';
import { useWellnessData } from '../../hooks/useWellnessData';
import { theme } from '../../utils/theme';

type TimeRange = 'day' | 'week' | 'month';

export function WellnessTrends() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const { trendData, loading } = useWellnessData(timeRange);

  if (loading) {
    return (
      <Card>
        <Text style={styles.title}>Loading trends...</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={styles.title}>Wellness Trends</Text>
      <FilterButtons
        selectedRange={timeRange}
        onRangeChange={setTimeRange}
      />
      
      <View style={styles.chartContainer}>
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
            <Text style={styles.legendText}>Mood</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
            <Text style={styles.legendText}>Sleep</Text>
          </View>
        </View>

        {/* Charts */}
        <LineChart
          data={trendData.mood}
          color={theme.colors.primary}
        />
        <LineChart
          data={trendData.sleep}
          color={theme.colors.secondary}
        />
      </View>

      <Text style={styles.description}>
        Track your daily mood and sleep patterns over time
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
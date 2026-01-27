import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/constants/colors";
import type { WeatherData } from "./weather-types";
import { LineChart } from 'react-native-chart-kit';

type WeatherChartProps = {
  weather: WeatherData | null;
  tab: string;
};

export default function WeatherChart({ weather, tab }: WeatherChartProps) {
  if (tab !== "Today" || !weather) return null;

  const today = new Date(weather.current.time);

  const points = weather.hourly.time
    .map((t, index) => ({ time: t instanceof Date ? t : new Date(t), index }))
    .filter(({ time }) => time.getDate() === today.getDate());

  if (!points || points.length === 0) return null;

  const temps = points.map(({ index }) => Number(weather.hourly.temperature_2m[index]))
    .filter(t => !isNaN(t) && isFinite(t));

  if (!temps || temps.length === 0) return null;

  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const pad = Math.max(1, (max - min) * 0.1);
  const yMin = min - pad;
  const yMax = max + pad;

  const labelValues = points.map(({ time }) => time.toLocaleTimeString([], { hour: '2-digit' }));
  // reduce label density: only show up to 6 labels
  const maxLabels = Math.min(6, labelValues.length);
  const labels = labelValues.length <= maxLabels 
    ? labelValues 
    : labelValues.map((v, i) => {
        const step = Math.ceil(labelValues.length / maxLabels);
        return i % step === 0 ? v : '';
      });

  const data = {
    labels,
    datasets: [{ data: points.map(({ index }) => Number(weather.hourly.temperature_2m[index])) }]
  };

  const windowW = Dimensions.get('window').width;
  const chartWidth = windowW - 60; // Account for padding and y-axis label
  const chartHeight = 180;

  const chartConfig = {
    backgroundGradientFrom: 'rgba(0, 0, 0, 0.02)',
    backgroundGradientTo: 'rgba(0, 0, 0, 0.02)',
    color: (opacity = 1) => `rgba(34, 87, 152, ${opacity})`,
    labelColor: () => Colors.darkBlue,
    decimalPlaces: 0,
    propsForDots: { r: '3', strokeWidth: '0' },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today — Hourly Temperature</Text>

      <View style={styles.chartWrapper}>
        <View style={styles.yAxisLabelContainer}>
          <Text style={[styles.yAxisLabel, { transform: [{ rotate: '-90deg' }] }]}>
            Temperature (°C)
          </Text>
        </View>
        
        <View style={styles.chartContainer}>
          <LineChart
            data={data}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            withVerticalLines={false}
            fromZero={false}
            yAxisSuffix="°C"
            yAxisInterval={1}
            style={styles.chart}
            formatYLabel={(y) => `${Math.round(Number(y))}`}
            segments={4}
            verticalLabelRotation={0}
          />
          
          <Text style={styles.xAxisLabel}>Time of Day</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    paddingVertical: 8,
    alignItems: 'center',
  },
  header: { 
    textAlign: 'center', 
    color: Colors.darkBlue, 
    marginBottom: 12, 
    fontSize: 16,
    fontWeight: 'bold'
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  yAxisLabelContainer: {
    width: 20,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  yAxisLabel: {
    color: Colors.darkBlue,
    fontSize: 12,
    fontWeight: '600',
    width: 180,
    textAlign: 'center',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
  },
  xAxisLabel: {
    textAlign: 'center',
    color: Colors.darkBlue,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
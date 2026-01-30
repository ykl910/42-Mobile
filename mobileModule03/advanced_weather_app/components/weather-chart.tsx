import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/constants/colors";
import type { WeatherData } from "./weather-types";
import { LineChart } from 'react-native-chart-kit';
import { useEffect, useState } from "react";

type WeatherChartProps = {
  weather: WeatherData | null;
  tab: string;
};

export default function WeatherChart({ weather, tab }: WeatherChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!weather) return null;

  let points;
  let tempsHour;
  let tempsDayMax;
  let tempsDayMin;
  let min;
  let max;

  if (tab === "Today") {
    const today = new Date(weather.current.time);
    points = weather.hourly.time
      .map((t, index) => ({ time: t instanceof Date ? t : new Date(t), index }))
      .filter(({ time }) => time.getDate() === today.getDate());
    if (!points || points.length === 0) return null;
    tempsHour = points.map(({ index }) => Number(weather.hourly.temperature_2m[index]))
      .filter(t => !isNaN(t) && isFinite(t));
    if (!tempsHour || tempsHour.length === 0) return null;
    min = Math.min(...tempsHour);
    max = Math.max(...tempsHour);

  } else if (tab === "Weekly") {
    points = weather.daily.time
      .map((t, index) => ({time: t instanceof Date ? t: new Date(t), index}))
    if (!points || points.length === 0) return null;
    tempsDayMax = points.map(({ index }) => Number(weather.daily.temperature_2m_max[index]))
      .filter(t => !isNaN(t) && isFinite(t));
    tempsDayMin = points.map(({ index }) => Number(weather.daily.temperature_2m_min[index]))
      .filter(t => !isNaN(t) && isFinite(t));
    if (!tempsDayMax || tempsDayMax.length === 0) return null;
    if (!tempsDayMin || tempsDayMin.length === 0) return null;
    min = Math.min(...tempsDayMax);
    max = Math.max(...tempsDayMax);
  }

  const labelValues = points!.map(({ time }) => (tab === 'Today' ? time.toLocaleTimeString([], { hour: '2-digit' }) :
                                                                   time.toLocaleDateString([], { day: "2-digit", month: "2-digit" })));
  const maxLabels = Math.min(8, labelValues.length);
  const labels = labelValues.length <= maxLabels 
    ? labelValues 
    : labelValues.map((v, i) => {
        const step = Math.ceil(labelValues.length / maxLabels);
        return i % step === 0 ? v : '';
      });

  let data;
  if (tab === "Today") {
    data = {
      labels,
      datasets: [{ data: points!.map(({ index }) => Number(weather.hourly.temperature_2m[index])) }]
    };
  } else if (tab === "Weekly") {
      data = {
        labels,
        datasets: [{ data: points!.map(({ index }) => Number(weather.daily.temperature_2m_max[index])), color: () => Colors.coral, strokeWidth: 2 },
                  { data: points!.map(({ index }) => Number(weather.daily.temperature_2m_min[index])), color: () => Colors.lavender, strokeWidth: 2 },],
                  legend: ["Max temp", "Min temp"]};
  }

  const windowW = Dimensions.get('window').width;
  const chartWidth = windowW - 60;
  const chartHeight = 250;

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0.3,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0.3,
    color: (opacity = 0.5) => `rgba(34, 87, 152, ${opacity})`,
    labelColor: () => Colors.darkBlue,
    decimalPlaces: 0,
    propsForDots: { r: '3', strokeWidth: '0' },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.xAxisLabel, { fontSize : 16, color: Colors.charcoal }]}>{tab === 'Today' ? "Today Temperature" : "Weekly Temperature" }</Text>
      <View style={styles.chartWrapper}>
        <View style={styles.yAxisLabelContainer}>
          <Text style={[styles.yAxisLabel, mounted && { transform: [{ rotate: '-90deg' }] }]}>
            Temperature (°C)
          </Text>
        </View>
        
        <View style={styles.chartContainer}>
          <LineChart
            data={data!}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            withVerticalLines={true}
            fromZero={false}
            yAxisSuffix="°C"
            yAxisInterval={1}
            style={styles.chart}
            formatYLabel={(y) => `${Math.round(Number(y))}`}
            segments={4}
            verticalLabelRotation={0}
          />
          <Text style={styles.xAxisLabel}>{tab === 'Today' ? "Time of Day" : "Day of week" }</Text>
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
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  yAxisLabelContainer: {
    width: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    backgroundColor: 'transparent',
  },
  chart: {
    marginVertical: 0,
    padding: 8,
    borderRadius: 16
  },
  xAxisLabel: {
    textAlign: 'center',
    color: Colors.darkBlue,
    fontSize: 12,
    fontWeight: '600',
  },
});
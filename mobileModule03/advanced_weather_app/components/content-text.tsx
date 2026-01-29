import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/colors";
import { useSearch } from "@/context/search-context";
import { fetchWeatherApi } from "openmeteo";
import type { WeatherData } from "./weather-types";
import { useState, useEffect } from "react";
import { getWeatherDescription, getWeatherIconName } from "./utils";
import TodayWeather from "./today-weather";
import WeeklyWeather from "./weekly-weather";
import CurrentlyWeather from "./currently-weather";

type ContentTextProps = {
  tab: string;
};

export default function ContentText({ tab }: ContentTextProps) {
  const { query, geoloc, currentLoc, error, setError } = useSearch();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      if (geoloc === 'denied' || !geoloc) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        const coords = geoloc.split(',').map(s => parseFloat(s.trim()));
        const params = {
          latitude: coords[0],
          longitude: coords[1],
          daily: ["temperature_2m_min", "temperature_2m_max", "weather_code"],
          hourly: ["temperature_2m", "wind_speed_10m", "weather_code"],
          current: ["temperature_2m", "wind_speed_10m", "weather_code"],
          timezone: "auto"
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const current = response.current()!;
        const hourly = response.hourly()!;
        const daily = response.daily()!;

        const data: WeatherData = {
          current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: current.variables(0)!.value(),
            wind_speed_10m: current.variables(1)!.value(),
            weather_code: current.variables(2)!.value(),
          },
          hourly: {
            time: Array.from(
              { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
              (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m: hourly.variables(0)!.valuesArray()!,
            wind_speed_10m: hourly.variables(1)!.valuesArray()!,
            weather_code: hourly.variables(2)!.valuesArray()!,
          },
          daily: {
            time: Array.from(
              { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() }, 
              (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m_min: daily.variables(0)!.valuesArray()!,
            temperature_2m_max: daily.variables(1)!.valuesArray()!,
            weather_code: daily.variables(2)!.valuesArray()!,
          },
        };

        setWeatherData(data);
      } catch (err) {
        setError('fetchError');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [geoloc, query]);

  if (geoloc === 'denied') {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.title]}>Geolocation is not available, please enable it in your app settings</Text>
      </View>
    );
  }

  if (error == 'noResult') {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.title]}>Could not find any result for the supplied address or coordinates</Text>
      </View>
    );
  }

  if (error == 'fetchError') {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.title]}>Your service connection is lost, please check your internet connection or try again</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.title]}>Error: {error || 'No weather data available'}</Text>
      </View>
    );
  }

  const locationParts = [currentLoc.name, currentLoc.region, currentLoc.country].filter(Boolean);
  const locationText = locationParts.join(', ') || 'Current Location';

  return (
    <>
      {tab === 'Currently' && (
        <CurrentlyWeather
          weatherData={weatherData}
          locationText={locationText}
          getWeatherDescription={getWeatherDescription}
          getWeatherIconName={getWeatherIconName}
        />
      )}
      {tab === 'Today' && (
        <TodayWeather
          weatherData={weatherData}
          locationText={locationText}
          getWeatherDescription={getWeatherDescription}
        />
      )}
      {tab === 'Weekly' && (
        <WeeklyWeather
          weatherData={weatherData}
          locationText={locationText}
          getWeatherDescription={getWeatherDescription}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: Colors.darkBlue,
    textAlign: 'center',
  },
  textSecondary: {
    color: Colors.charcoal,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacedItem: {
    marginVertical: 30,
  },
  large: {
    fontSize: 60,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  list: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
});

import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/colors";
import { useSearch } from "@/context/search-context";
import { fetchWeatherApi } from "openmeteo";
import { useState, useEffect } from "react";

type ContentTextProps = {
  tab: string;
};

type WeatherData = {
  current: {
    time: Date;
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  hourly: {
    time: Date[];
    temperature_2m: Float32Array;
    wind_speed_10m: Float32Array;
    weather_code: Float32Array;
  };
  daily: {
    time: Date[];
    temperature_2m_min: Float32Array;
    temperature_2m_max: Float32Array;
    weather_code: Float32Array;
  };
};

const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherCodes[code] || "Unknown";
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

  const renderCurrently = () => {
    const locationParts = [currentLoc.name, currentLoc.region, currentLoc.country].filter(Boolean);
    const locationText = locationParts.join(', ') || 'Current Location';
    
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.title]}>{locationText}</Text>
        <Text style={styles.textSecondary}>{geoloc}</Text>
        
        <Text style={[styles.text, styles.large]}>{Math.round(weatherData.current.temperature_2m)}°C</Text>
        <Text style={[styles.text, styles.title]}>{getWeatherDescription(weatherData.current.weather_code)}</Text>
        <Text style={styles.textSecondary}>Wind: {Math.round(weatherData.current.wind_speed_10m)} km/h</Text>
      </View>
    );
  };

  const renderToday = () => {
    const today = new Date();
    const todayHours = weatherData.hourly.time
      .map((time, index) => ({ time, index }))
      .filter(({ time }) => time.getDate() === today.getDate());

    const locationParts = [currentLoc.name, currentLoc.region, currentLoc.country].filter(Boolean);
    const locationText = locationParts.join(', ') || 'Current Location';

    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={[styles.text, styles.title]}>{locationText}</Text>
          <Text style={[styles.textSecondary]}>{geoloc}</Text>
          
          <View style={styles.list}>
            {todayHours.map(({ time, index }) => (
              <View key={index} style={styles.card}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={[styles.text, styles.title]}>
                  {Math.round(weatherData.hourly.temperature_2m[index])}°C
                </Text>
                <Text style={styles.textSecondary}>
                  {getWeatherDescription(weatherData.hourly.weather_code[index])}
                </Text>
                <Text style={styles.textSecondary}>
                  Wind: {Math.round(weatherData.hourly.wind_speed_10m[index])} km/h
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderWeekly = () => {
    const locationParts = [currentLoc.name, currentLoc.region, currentLoc.country].filter(Boolean);
    const locationText = locationParts.join(', ') || 'Current Location';
    
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={[styles.text, styles.title]}>{locationText}</Text>
          <Text style={styles.textSecondary}>{geoloc}</Text>
          
          <View style={styles.list}>
            {weatherData.daily.time.map((time, index) => (
              <View key={index} style={styles.card}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>
                  {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
                <Text style={[styles.text, styles.title]}>
                  {Math.round(weatherData.daily.temperature_2m_min[index])}°C - {Math.round(weatherData.daily.temperature_2m_max[index])}°C
                </Text>
                <Text style={styles.textSecondary}>
                  {getWeatherDescription(weatherData.daily.weather_code[index])}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      {tab === 'Currently' && renderCurrently()}
      {tab === 'Today' && renderToday()}
      {tab === 'Weekly' && renderWeekly()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  text: {
    color: Colors.darkBlue,
  },
  textSecondary: {
    color: '#7FA1C3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  large: {
    fontSize: 60,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  card: {
    backgroundColor: 'rgba(127, 161, 195, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
});

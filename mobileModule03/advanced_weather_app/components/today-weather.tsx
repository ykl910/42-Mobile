import React from "react";
import { View, Text, ScrollView } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from "@/constants/colors";
import WeatherChart from "./weather-chart";
import type { WeatherData } from "./weather-types";

interface TodayWeatherProps {
  weatherData: WeatherData;
  locationText: string;
  getWeatherDescription: (code: number) => string;
}

const TodayWeather: React.FC<TodayWeatherProps> = ({ weatherData, locationText, getWeatherDescription }) => {
  const today = new Date();
  const todayHours = weatherData.hourly.time
    .map((time, index) => ({ time, index }))
    .filter(({ time }) => time.getDate() === today.getDate());

  return (
    <View style={{ alignItems: 'center', padding: 20, backgroundColor: 'transparent' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 20, color: Colors.darkBlue, textAlign: 'center' }}>{locationText}</Text>
      <WeatherChart weather={weatherData} tab={"Today"} />
      <ScrollView horizontal={true}>
        <View style={{ width: '100%', marginTop: 20, flexDirection: 'row' }}>
          {todayHours.map(({ time, index }) => (
            <View key={index} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', padding: 10, borderRadius: 10, margin: 5 }}>
              <Text style={{ color: Colors.darkBlue, textAlign: 'center', fontWeight: 'bold' }}>
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={{ color: Colors.darkBlue, textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginVertical: 10 }}>
                {Math.round(weatherData.hourly.temperature_2m[index])}°C
              </Text>
              <Text style={{ color: Colors.charcoal, textAlign: 'center' }}>
                {getWeatherDescription(weatherData.hourly.weather_code[index])}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="weather-windy" size={16} color={Colors.charcoal} style={{ marginRight: 6 }} />
                <Text style={{ color: Colors.charcoal, textAlign: 'center' }}>{Math.round(weatherData.hourly.wind_speed_10m[index])} km/h</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TodayWeather;

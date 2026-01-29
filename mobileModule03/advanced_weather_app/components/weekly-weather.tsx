import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Colors } from "@/constants/colors";
import WeatherChart from "./weather-chart";
import type { WeatherData } from "./weather-types";

interface WeeklyWeatherProps {
  weatherData: WeatherData;
  locationText: string;
  getWeatherDescription: (code: number) => string;
}

const WeeklyWeather: React.FC<WeeklyWeatherProps> = ({ weatherData, locationText, getWeatherDescription }) => (
  <View style={{ alignItems: 'center', padding: 20, backgroundColor: 'transparent' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: Colors.darkBlue, textAlign: 'center' }}>{locationText}</Text>
    <WeatherChart weather={weatherData} tab={"Weekly"} />
    <ScrollView horizontal={true}>
      <View style={{ width: '100%', marginTop: 20, flexDirection: 'row' }}>
        {weatherData.daily.time.map((time, index) => (
          <View key={index} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', padding: 10, borderRadius: 10, margin: 5 }}>
            <Text style={{ color: Colors.darkBlue, textAlign: 'center', fontWeight: 'bold' }}>
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
            <Text style={{ color: Colors.darkBlue, textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginVertical: 10 }}>
              {Math.round(weatherData.daily.temperature_2m_min[index])}°C - {Math.round(weatherData.daily.temperature_2m_max[index])}°C
            </Text>
            <Text style={{ color: Colors.charcoal, textAlign: 'center' }}>
              {getWeatherDescription(weatherData.daily.weather_code[index])}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

export default WeeklyWeather;

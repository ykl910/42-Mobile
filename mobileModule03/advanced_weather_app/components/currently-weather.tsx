import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from "@/constants/colors";
import type { WeatherData } from "./weather-types";

interface CurrentlyWeatherProps {
  weatherData: WeatherData;
  locationText: string;
  getWeatherDescription: (code: number) => string;
  getWeatherIconName: (code: number) => string;
  windSpeedUnit?: string;
}

export default function CurrentlyWeather({ weatherData, locationText, getWeatherDescription, getWeatherIconName, windSpeedUnit = 'km/h'}: CurrentlyWeatherProps) {
	return (
		<View style={{ alignItems: 'center', padding: 20, backgroundColor: 'transparent' }}>
			<Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: Colors.darkBlue, textAlign: 'center' }}>{locationText}</Text>
			<Text style={{ fontSize: 60, fontWeight: 'bold', marginVertical: 10, color: Colors.darkBlue, textAlign: 'center' }}>{Math.round(weatherData.current.temperature_2m)}°C</Text>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<Ionicons
				name={getWeatherIconName(weatherData.current.weather_code)}
				size={24}
				color={Colors.darkBlue}
				style={{ marginRight: 8 }}
			/>
			<Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: Colors.darkBlue, textAlign: 'center' }}>{getWeatherDescription(weatherData.current.weather_code)}</Text>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<MaterialCommunityIcons name="weather-windy" size={18} color={Colors.charcoal} style={{ marginRight: 8 }} />
			<Text style={{ color: Colors.charcoal, textAlign: 'center' }}>{Math.round(weatherData.current.wind_speed_10m)} {windSpeedUnit}</Text>
			</View>
		</View>	
	);
}


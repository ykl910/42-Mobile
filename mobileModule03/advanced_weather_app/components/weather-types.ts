export type WeatherData = {
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

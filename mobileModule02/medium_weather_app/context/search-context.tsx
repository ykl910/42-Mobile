import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export type Suggestions = {
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface GeocodeResult {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface GeocodeResponse {
  results?: GeocodeResult[];
}

type SearchContextType = {
  query: string;
  setQuery: (query: string) => void;
  geoloc: string;
  setGeoloc: (geoloc: string) => void;
  currentLoc: Suggestions;
  setCurrentLoc: (currentLoc: Suggestions) => void;
  getLocation: () => void;
  suggestions: Suggestions[];
  setSuggestions: (suggestions: Suggestions[]) => void;
  fetchCitySuggestions: (query: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [geoloc, setGeoloc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestions[]>([]);
  const [currentLoc, setCurrentLoc] = useState<Suggestions>({
    name: '',
    region: '',
    country: '',
    latitude: 0,
    longitude: 0
  });

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const { coords } = await Location.getCurrentPositionAsync();
      setGeoloc(`${coords.latitude}, ${coords.longitude}`);
      setError('');
      setSuggestions([]);
      setQuery('');
      setCurrentLoc({
        name: '',
        region: '',
        country: '',
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    }
    else if (status === 'denied') {
      setGeoloc("denied");
    }
  };

  const fetchCitySuggestions = async (query: string) => {
    if (query === '') {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`;
      const res = await fetch(url);
      const data: GeocodeResponse = await res.json();
      if (data.results && data.results.length > 0) {
        const transformed = data.results.map(item => ({
          name: item.name,
          region: item.admin1 || '',
          country: item.country,
          latitude: item.latitude,
          longitude: item.longitude
        }));
        setError('');
        setSuggestions(transformed);
      } else {
        setError('noResult');
        setSuggestions([]);
      }
    } catch (error) {
      setError('fetchError');
      setSuggestions([]);
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <SearchContext.Provider value={{ query, setQuery, geoloc, setGeoloc, error, setError, currentLoc, setCurrentLoc, getLocation, suggestions, setSuggestions, fetchCitySuggestions }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}

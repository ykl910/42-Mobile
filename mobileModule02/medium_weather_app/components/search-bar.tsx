import { TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { Suggestions, useSearch } from "@/context/search-context";
import { useEffect } from "react";
import SuggestionsList from "@/components/suggestions-list";


export default function SearchBar() {
  const { query, setQuery, setGeoloc, getLocation, suggestions, setSuggestions, fetchCitySuggestions, setCurrentLoc } = useSearch();

  const handleSelectCity = (suggestions: Suggestions) => {
    setGeoloc(`${suggestions.latitude}, ${suggestions.longitude}`);
    setCurrentLoc(suggestions);
    setQuery('');
    setSuggestions([]);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        fetchCitySuggestions(query);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.lightCream} style={styles.searchIcon} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor={Colors.lightCream}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => setSuggestions([])}
          style={styles.textInput}
        />
      </View>
      <View style={styles.divider} />
      <TouchableOpacity
        onPress={getLocation}
        style={styles.geoSearch}
      >
        <Ionicons name="location" size={24} color={Colors.lightCream} />
      </TouchableOpacity>
      {suggestions.length > 0 && (
        <SuggestionsList
          suggestions={suggestions}
          onSelect={handleSelectCity}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: "center",
    height: 50,
    backgroundColor: Colors.darkBlue,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkBlue,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
    padding: 10,
    color: Colors.lightCream
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.lightCream,
  },
  geoSearch: {
    backgroundColor: Colors.darkBlue,
    padding: 10,
  }
});

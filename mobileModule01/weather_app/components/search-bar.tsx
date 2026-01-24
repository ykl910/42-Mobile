import { TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { useSearch } from "@/context/search-context";

export default function SearchBar() {
  const { query, setQuery, geoloc, setGeoloc } = useSearch();
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.lightCream} style={styles.searchIcon} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor={Colors.lightCream}
          value={query}
          onChangeText={setQuery}
          style={styles.textInput}
        />
      </View>
      <View style={styles.divider} />
      <TouchableOpacity
        onPress={() => (geoloc === '' ? setGeoloc("Geolocation") : setGeoloc(''))}
        style={styles.geoSearch}
      >
        <Ionicons name="location" size={24} color={Colors.lightCream} />
      </TouchableOpacity>
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

import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Colors } from "@/constants/colors";
import { Suggestions } from "@/context/search-context";

type SuggestionsListProps = {
  suggestions: Suggestions[];
  onSelect: (suggestion: Suggestions) => void;
};

export default function SuggestionsList({ suggestions, onSelect }: SuggestionsListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => `${item.name}-${item.latitude}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.suggestionItem}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.text}>
              {item.name}{item.region ? `, ${item.region}` : ''}, {item.country}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.darkBlue,
    maxHeight: 200,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightCream + '33',
  },
  text: {
    color: Colors.lightCream,
    fontSize: 16,
  },
});

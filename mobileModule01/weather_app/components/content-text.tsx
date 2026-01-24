import { Text, View, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { useSearch } from "@/context/search-context";

type ContentTextProps = {
  tab: string;
};

export default function ContentText({ tab }: ContentTextProps) {
  const { query, geoloc } = useSearch();
  
  return (
    <View style={styles.content}>
      <Text style={styles.text}>{tab} {query} {geoloc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.darkBlue,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

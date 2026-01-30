import { View, StyleSheet } from "react-native";
import SearchBar from '@/components/search-bar';
import ContentText from "@/components/content-text";
import BackgroundWrapper from "@/components/background-wrapper";

export default function Today() {
  return (
      <View style={styles.container}>
        <ContentText tab='Today' />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});
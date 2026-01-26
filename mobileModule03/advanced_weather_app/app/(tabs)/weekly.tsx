import { View, StyleSheet } from "react-native";
import SearchBar from '@/components/search-bar';
import ContentText from "@/components/content-text";
import BackgroundWrapper from "@/components/background-wrapper";

export default function Weekly() {
  return (
	<BackgroundWrapper>
	  <View style={styles.container}>
		<SearchBar />
		<ContentText tab='Weekly' />
	  </View>
	</BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: 'transparent'
  }
});
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import SearchBar from '@/components/search-bar';
import ContentText from "@/components/content-text";

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
	backgroundColor: Colors.lightCream,
  },
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

import { Text, View } from "react-native";
import { TextButton } from "@/components/text-button";
import { blue } from "react-native-reanimated/lib/typescript/Colors";
export default function Index() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<TextButton
				widgetText="Baozi"
				buttonText="Click me"
				onPress={() => console.log("Button pressed")}
			/>
		</View>
	);
}

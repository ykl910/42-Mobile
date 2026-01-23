import { Text, View } from "react-native";
import { TextButton } from "@/components/text-button";
import { useState } from "react";

export default function Index() {
	const [text, setText] = useState("Baozi");

	const handlePress = () => {
		if (text == "Baozi")
			setText("Hello World!");
		else
			setText("Baozi")
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<TextButton
				widgetText={text}
				buttonText="Click me"
				onPress={handlePress}
			/>
		</View>
	);
}

import { Pressable, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

type ButtonProps = {
	text: string;
	onPress: () => void;
};

export function Button({ text, onPress }: ButtonProps) {
	return (
		<Pressable
			style={({ pressed }) => ({
				backgroundColor: pressed ? Colors.mediumBlue : Colors.lightBlue,
				padding: 20,
				flex: 1,
				margin: 5,
				alignItems: "center",
				justifyContent: "center",
				opacity: pressed ? 0.7 : 1,
			})}
			onPress={onPress}
		>
			<Text style={{ color: Colors.darkBlue, fontSize: 24 }}>{text}</Text>
		</Pressable>
	);
}

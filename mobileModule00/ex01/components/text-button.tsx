import { Colors } from "@/constants/colors";
import { Pressable, Text, View } from "react-native";

type TextButtonProps = {
	widgetText: string;
	buttonText: string;
	onPress: () => void;
};

export function TextButton({ widgetText, buttonText, onPress }: TextButtonProps) {
	return (
		<View style={{ alignItems: "center" }}>
			<View
				style={{
					backgroundColor: Colors.darkBlue,
					borderRadius: 8,
					padding: 8,
					margin: 5,
				}}
			>
				<Text style={{ fontSize: 30, color: Colors.lightCream }}>{widgetText}</Text>
			</View>

			<Pressable
				style={({ pressed }) => ({
					backgroundColor: pressed ? Colors.darkGrey : Colors.lightGrey,
					borderRadius: 15,
					padding: 8,
					opacity: pressed ? 0.7 : 1,
				})}
				onPress={onPress}
			>
				<Text style={{ color: Colors.darkBlue }}>{buttonText}</Text>
			</Pressable>
		</View>
	);
}

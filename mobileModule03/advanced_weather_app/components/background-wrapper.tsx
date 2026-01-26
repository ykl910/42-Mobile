import { ImageBackground, StyleSheet } from "react-native";
import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <ImageBackground
      source={require("../assets/images/weather_app_bg.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
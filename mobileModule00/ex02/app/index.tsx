import { Text, View, StyleSheet } from "react-native";
import { Button } from "@/components/button";
import { Colors } from "@/constants/colors";

export default function Index() {
  return (
    <View style={styles.container}>

      <View style={styles.display}>
        <Text style={styles.expression}>0</Text>
        <Text style={styles.result}>0</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <Button text="AC" onPress={() => console.log("AC")} />
          <Button text="C" onPress={() => console.log("C")} />
          <Button text="/" onPress={() => console.log("/")} />
          <Button text="*" onPress={() => console.log("*")} />
        </View>

        <View style={styles.row}>
          <Button text="7" onPress={() => console.log("7")} />
          <Button text="8" onPress={() => console.log("8")} />
          <Button text="9" onPress={() => console.log("9")} />
          <Button text="-" onPress={() => console.log("-")} />
        </View>

        <View style={styles.row}>
          <Button text="4" onPress={() => console.log("4")} />
          <Button text="5" onPress={() => console.log("5")} />
          <Button text="6" onPress={() => console.log("6")} />
          <Button text="+" onPress={() => console.log("+")} />
        </View>

        <View style={styles.row}>
          <Button text="1" onPress={() => console.log("1")} />
          <Button text="2" onPress={() => console.log("2")} />
          <Button text="3" onPress={() => console.log("3")} />
          <Button text="=" onPress={() => console.log("=")} />
        </View>

        <View style={styles.row}>
          <Button text="0" onPress={() => console.log("0")} />
          <Button text="." onPress={() => console.log(".")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  display: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  expression: {
    fontSize: 40,
    color: "#fff",
    marginBottom: 10,
  },
  result: {
    fontSize: 60,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 2,
    justifyContent: "space-evenly",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: Colors.lightBlue
  },
});


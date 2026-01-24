import { Text, View, StyleSheet } from "react-native";
import { Button } from "@/components/button";
import { Colors } from "@/constants/colors";
import { useState } from "react";

export default function Index() {

  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');

  const operators = ['+','-','/','*']
  const handleNumber = (input: string) => {
    if (expression === '0') {
      setExpression(input);
    } else {
      const parts = expression.split(/[+\-*/]/);
      const currentNumber = parts[parts.length - 1];
      // Prevent leading zero
      if (currentNumber === '0' && input !== '0') {
        setExpression(expression.slice(0, -1) + input);
      } else if (currentNumber === '0' && input === '0') {
        // Don't add another zero if current number is just "0"
        return;
      } else {
        setExpression(expression + input);
      }
    }
  }

  const handleOper = (input: string) => {
    if (operators.includes(input) && !operators.includes(expression.slice(-1)))
      setExpression(expression+input);
  }

  const handleClean = (input: string) => {
    if (input == "AC") {
      setExpression('0');
      setResult('0');      
    }
    else {
      const newEx = expression.slice(0,-1);
      setExpression(newEx === '' ? '0' : newEx);
    }
  }

  const handleDot = () => {
    const parts = expression.split(/[+\-*/]/);
    const currentNumber = parts[parts.length - 1];
    if (!currentNumber.includes('.')) {
      setExpression(expression + '.');
    }
  }

  const handleEqual = () => {
    try {
      const res = eval(expression);
      if (!isFinite(res))
        setResult('Error');
      else
        setResult(res.toString());
    } catch (error) {
      setResult('Error');
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.display}>
        <Text style={styles.expression}>{expression}</Text>
        <Text style={styles.result}>{result}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <Button text="AC" onPress={() => handleClean("AC")} />
          <Button text="C" onPress={() => handleClean("C")} />
          <Button text="/" onPress={() => handleOper('/')} />
          <Button text="*" onPress={() => handleOper('*')} />
        </View>

        <View style={styles.row}>
          <Button text="7" onPress={() => handleNumber('7')} />
          <Button text="8" onPress={() => handleNumber('8')} />
          <Button text="9" onPress={() => handleNumber('9')} />
          <Button text="-" onPress={() => handleOper('-')} />
        </View>

        <View style={styles.row}>
          <Button text="4" onPress={() => handleNumber('4')} />
          <Button text="5" onPress={() => handleNumber('5')} />
          <Button text="6" onPress={() => handleNumber('6')} />
          <Button text="+" onPress={() => handleOper('+')} />
        </View>

        <View style={styles.row}>
          <Button text="1" onPress={() => handleNumber('1')} />
          <Button text="2" onPress={() => handleNumber('2')} />
          <Button text="3" onPress={() => handleNumber('3')} />
          <Button text="=" onPress={() => handleEqual()} />
        </View>

        <View style={styles.row}>
          <Button text="0" onPress={() => handleNumber('0')} />
          <Button text="." onPress={() => handleDot()} />
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
    fontSize: 50,
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


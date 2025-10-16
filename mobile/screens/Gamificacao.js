import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Gamificacao() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Tela de Gamificação 🎮</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFCF5",
  },
  texto: {
    fontSize: 20,
    color: "#6A4C93",
    fontWeight: "bold",
  },
});

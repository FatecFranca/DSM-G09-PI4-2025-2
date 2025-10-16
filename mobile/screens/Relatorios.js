// screens/Relatorios.js
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function Relatorios() {
  const dados = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    datasets: [
      { data: [55, 63, 68, 59, 70], strokeWidth: 2 },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatórios</Text>
      <Text style={styles.subtitulo}>Histórico semanal de ruído (dB)</Text>
      <LineChart
        data={dados}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisSuffix="dB"
        chartConfig={{
          backgroundGradientFrom: "#FBFCF5",
          backgroundGradientTo: "#FBFCF5",
          color: () => "#6A4C93",
          labelColor: () => "#333",
        }}
        bezier
        style={styles.grafico}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#8AC926", marginBottom: 10 },
  subtitulo: { fontSize: 16, marginBottom: 10 },
  grafico: { borderRadius: 10 },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import HeaderPadrao from "../components/HeaderPadrao";

const screenWidth = Dimensions.get("window").width;

export default function Relatorios({ navigation }) {
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [dadosSom, setDadosSom] = useState([]);

  //  Busca as salas cadastradas no MongoDB
  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await api.get("/salas");
        setSalas(response.data);
      } catch (error) {
        console.error("Erro ao buscar salas:", error.message);
      }
    };
    fetchSalas();
  }, []);

  // Dados simulados até integração com backend de sensores
  useEffect(() => {
    const dadosFake = Array.from({ length: 20 }, (_, i) => ({
      hora: `${i + 1}h`,
      valor: Math.floor(Math.random() * 90) + 40,
    }));
    setDadosSom(dadosFake);
  }, []);

  //  Cálculos principais
  const valores = dadosSom.map((d) => d.valor);
  const media = valores.length
    ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1)
    : 0;
  const pico = valores.length ? Math.max(...valores) : 0;
  const tempoCritico = valores.length
    ? ((valores.filter((v) => v > 75).length / valores.length) * 100).toFixed(1)
    : 0;
  const indiceSilencio = valores.length
    ? ((valores.filter((v) => v < 55).length / valores.length) * 100).toFixed(1)
    : 0;

  //  Dados para gráficos
  const lineData = {
    labels: dadosSom.map((d) => d.hora),
    datasets: [
      {
        data: dadosSom.map((d) => d.valor),
        color: () => "#6A4C93",
      },
    ],
  };

  const barData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    datasets: [{ data: [60, 68, 72, 65, 80] }],
  };

  const pieData = [
    {
      name: "Ideal (<60dB)",
      population: 45,
      color: "#8AC926",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
    {
      name: "Atenção (60–75dB)",
      population: 35,
      color: "#FFCA3A",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
    {
      name: "Crítico (>75dB)",
      population: 20,
      color: "#FF595E",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
  ];

  const boxData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    datasets: [
      {
        data: [50, 65, 80, 55, 90],
        color: () => "#6A4C93",
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho padrão */}
      <HeaderPadrao titulo="Relatórios" />

      {/* Scroll total da tela */}
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Picker para selecionar sala/turma */}
        <Text style={styles.label}>Selecionar sala/turma:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={salaSelecionada}
            style={styles.picker}
            onValueChange={(valor) => setSalaSelecionada(valor)}
          >
            <Picker.Item label="Selecione uma sala" value="" />
            {salas.map((s) => (
              <Picker.Item key={s._id} label={s.nome} value={s._id} />
            ))}
          </Picker>
        </View>

        {/* Indicadores principais */}
        <View style={styles.cardGrid}>
          <View style={[styles.card, { borderLeftColor: "#8AC926" }]}>
            <Text style={styles.cardTitulo}>🔊 Nível Médio</Text>
            <Text style={styles.cardValor}>{media} dB</Text>
            <Text style={styles.cardInfo}>
              Ideal &lt; 60 / Atenção 60–75 / Crítico &gt; 75
            </Text>
          </View>
          <View style={[styles.card, { borderLeftColor: "#FFCA3A" }]}>
            <Text style={styles.cardTitulo}>📈 Pico Máximo</Text>
            <Text style={styles.cardValor}>{pico} dB</Text>
            <Text style={styles.cardInfo}>Maior ruído captado</Text>
          </View>
          <View style={[styles.card, { borderLeftColor: "#FF595E" }]}>
            <Text style={styles.cardTitulo}>🕒 Tempo Crítico</Text>
            <Text style={styles.cardValor}>{tempoCritico}%</Text>
            <Text style={styles.cardInfo}>Tempo &gt; 75 dB</Text>
          </View>
          <View style={[styles.card, { borderLeftColor: "#6A4C93" }]}>
            <Text style={styles.cardTitulo}>🤫 Índice Silêncio</Text>
            <Text style={styles.cardValor}>{indiceSilencio}%</Text>
            <Text style={styles.cardInfo}>Tempo &lt; 55 dB</Text>
          </View>
        </View>

        {/* Gráfico de linha */}
        <Text style={styles.graficoTitulo}>📉 Variação de Ruído (Tempo x dB)</Text>
        <LineChart
          data={lineData}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=" dB"
          chartConfig={chartConfig}
          bezier
          style={styles.grafico}
        />

        {/* Gráfico de barras */}
        <Text style={styles.graficoTitulo}>📊 Médias Diárias (Simulado)</Text>
        <BarChart
          data={barData}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=" dB"
          chartConfig={chartConfig}
          style={styles.grafico}
        />

        {/* Gráfico de pizza */}
        <Text style={styles.graficoTitulo}>🧩 Distribuição dos Níveis</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />

        {/* Boxplot/colunas verticais */}
        <Text style={styles.graficoTitulo}>📦 Variação Diária (Min, Média, Máx)</Text>
        <BarChart
          data={boxData}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=" dB"
          chartConfig={chartConfig}
          style={styles.grafico}
        />
      </ScrollView>

      {/* Botão voltar fixo */}
      <TouchableOpacity
        style={styles.voltarBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
      </TouchableOpacity>
    </View>
  );
}

// Configurações visuais padrão dos gráficos
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#FBFCF5",
  backgroundGradientTo: "#FBFCF5",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(106, 76, 147, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "4", strokeWidth: "1", stroke: "#6A4C93" },
};

/*  Estilos */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFCF5" },
  label: {
    fontSize: 14,
    color: "#6A4C93",
    fontWeight: "bold",
    marginTop: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    width: "90%",
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: { width: "100%", height: 45 },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "90%",
  },
  card: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 10,
    borderRadius: 12,
    borderLeftWidth: 6,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitulo: { fontWeight: "bold", fontSize: 14, color: "#333" },
  cardValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6A4C93",
    marginVertical: 4,
  },
  cardInfo: { fontSize: 11, color: "#777" },
  graficoTitulo: {
    fontSize: 15,
    color: "#6A4C93",
    fontWeight: "bold",
    marginTop: 15,
  },
  grafico: { borderRadius: 12, marginVertical: 8 },
  voltarBtn: { position: "absolute", bottom: 20, right: 20 },
});

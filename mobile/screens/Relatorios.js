import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, BarChart} from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import HeaderPadrao from "../components/HeaderPadrao";
import { PieChart } from "react-native-gifted-charts" 

const screenWidth = Dimensions.get("window").width;

export default function Relatorios({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [dadosSom, setDadosSom] = useState([]);
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [loading, setLoading] = useState(false);


  // Buscar salas
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

  // Recuperar usuário
  useEffect(() => {
    AsyncStorage.getItem("usuario").then((nome) => {
      if (nome) setUsuario(nome);
    });
  }, []);

  // Buscar histórico real
  useEffect(() => {
    if (!salaSelecionada) return;

    const buscarHistorico = async () => {
      try {
        const response = await api.get(`/sensores/historico/${salaSelecionada}`);
        setDadosSom(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar histórico da sala:", error.message);
      }
    };

    buscarHistorico();
  }, [salaSelecionada]);

useEffect(() => {
  if (!salaSelecionada) return;

  const buscarHistorico = async () => {
    try {
      setLoading(true); // LIGA O LOADING
      const response = await api.get(`/sensores/historico/${salaSelecionada}`);
      setDadosSom(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar histórico da sala:", error.message);
    } finally {
      setLoading(false); // DESLIGA O LOADING
    }
  };

  buscarHistorico();
}, [salaSelecionada]);


  // ========= Cálculos (iguais ao FRONT) ========= //

  const valores = dadosSom.map((d) => d.db);
  const hasData = valores.length > 0; 

  const media = hasData
    ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)
    : 0;

  const pico = hasData ? Math.max(...valores) : 0;

  const tempoCritico = hasData
    ? Math.round((valores.filter((v) => v > 60).length / valores.length) * 100)
    : 0;

  const indiceSilencio = hasData
    ? Math.round((valores.filter((v) => v < 55).length / valores.length) * 100)
    : 0;

  const variancia = hasData
    ? valores.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) /
      valores.length
    : 0;

  const desvioPadrao = hasData
    ? Math.round((Math.sqrt(variancia) / media) * 100)
    : 0;

  // ========= Últimas 20 capturas ========= //
  const ultimos20 = dadosSom
    .slice(-20)
    .map((d, i) => ({ indice: i + 1, valor: d.db }));

  // ========= Distribuição - CORRIGIDA PARA PieChart gifted-charts ========= //
  let distribuicao = hasData
    ? [
    {
      name: "Ideal (<55)",
      value: valores.filter((v) => v < 55).length, 
      color: "#8AC926",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
    {
      name: "Atenção (55–60)",
      value: valores.filter((v) => v >= 55 && v <= 60).length, 
      color: "#FFCA3A",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
    {
      name: "Crítico (>60)",
      value: valores.filter((v) => v > 60).length, 
      color: "#FF595E",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
  ]
  : [];


// Se todos os valores de 'distribuicao' forem zero ou não houver dados → substitui por 1 slice seguro (Sem dados)
const soma = distribuicao.reduce((t, x) => t + x.value, 0);

if (!hasData || soma === 0) {
  distribuicao = [
    {
      name: "Sem dados",
      value: 1, 
      color: "#AAAAAA",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
  ];
}

  // ========= Agrupamento semanal ========= //
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const agrupado = {};

  dadosSom.forEach((d) => {
    const dia = diasSemana[new Date(d.criadoEm).getDay()];
    if (!agrupado[dia]) agrupado[dia] = [];
    agrupado[dia].push(d.db);
  });

  const diasUteis = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const variacaoSemanal = diasUteis.map((dia) => {
    const arr = agrupado[dia] || [];
    return {
      dia,
      min: arr.length ? Math.min(...arr) : 0,
      med: arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0,
      max: arr.length ? Math.max(...arr) : 0,
    };
  });

  // Dados de fallback para BarChart e LineChart quando não há dados reais
  const fallbackLineData = {
    labels: ["N/A"],
    datasets: [{ data: [0], color: () => "#CCCCCC" }]
  };

  const fallbackBarData = {
    labels: ["N/A"],
    datasets: [{ data: [0], color: () => "#CCCCCC" }]
  };


  // Função para gerar dados de LineChart
  const lineChartData = ultimos20.length > 0 ? {
    labels: ultimos20.map((x) => x.indice.toString()),
    datasets: [
      {
        data: ultimos20.map((x) => x.valor),
        color: () => "#6A4C93",
      },
    ]
  } : fallbackLineData;

  // Função para gerar dados de BarChart
  const barChartData = variacaoSemanal.some(d => d.med > 0) ? {
    labels: variacaoSemanal.map((x) => x.dia),
    datasets: [
      {
        data: variacaoSemanal.map((x) => x.min),
        color: () => "#8AC926",
      },
      {
        data: variacaoSemanal.map((x) => x.med),
        color: () => "#FFCA3A",
      },
      {
        data: variacaoSemanal.map((x) => x.max),
        color: () => "#FF595E",
      },
    ],
  } : fallbackBarData;


  // ========= Layout ========= //

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.container}>

        <HeaderPadrao titulo="Relatórios" onMenuPress={() => setMenuVisivel(true)} />
        <Text style={styles.usuario}>{usuario}</Text>

        {/* MENU */}
        <Modal transparent visible={menuVisivel} animationType="fade">
          <View style={styles.menuFundo}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setMenuVisivel(false)} />
            <View style={styles.menuContainer}>
              {["Login", "SalaAmbiente", "Gamificacao", "Relatorios", "Cadastro", "Configuracoes"].map((tela, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setMenuVisivel(false);
                    navigation.navigate(tela);
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuTexto}>
                    {tela === "Login" ? "🏠 Home" :
                     tela === "SalaAmbiente" ? "▶️ Sala Ambiente" :
                     tela === "Gamificacao" ? "🎮 Gamificação" :
                     tela === "Relatorios" ? "📊 Relatórios" :
                     tela === "Cadastro" ? "🧾 Cadastro" :
                     "⚙️ Configurações"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* CONTEÚDO */}
          <Text style={styles.label}>Selecionar sala/turma:</Text>
          <Dropdown
            style={styles.dropdown}
            data={salas.map((s) => ({ label: s.nome, value: s.nome }))}
            labelField="label"
            valueField="value"
            placeholder="Selecione uma sala"
            value={salaSelecionada}
            onChange={(item) => setSalaSelecionada(item.value)}
          />

            {loading ? ( // <-- Renderização condicional do loading
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6A4C93" />
                        <Text style={styles.loadingText}>Carregando dados da sala...</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>

          {/* CARDS */}
          <View style={styles.cardGrid}>

            <View style={[styles.card, { borderLeftColor: "#8AC926" }]}>
              <Text style={styles.cardTitulo}>🔊 Nível Médio</Text>
              <Text style={styles.cardValor}>{media} dB</Text>
            </View>

            <View style={[styles.card, { borderLeftColor: "#FFCA3A" }]}>
              <Text style={styles.cardTitulo}>📈 Pico Máximo</Text>
              <Text style={styles.cardValor}>{pico} dB</Text>
            </View>

            <View style={[styles.card, { borderLeftColor: "#FF595E" }]}>
              <Text style={styles.cardTitulo}>🕒 Tempo Crítico</Text>
              <Text style={styles.cardValor}>{tempoCritico}%</Text>
            </View>

            <View style={[styles.card, { borderLeftColor: "#6A4C93" }]}>
              <Text style={styles.cardTitulo}>🤫 Índice de Silêncio</Text>
              <Text style={styles.cardValor}>{indiceSilencio}%</Text>
            </View>

            <View style={[styles.card, { borderLeftColor: "#6A4C93" }]}>
              <Text style={styles.cardTitulo}>📊 Desvio Padrão</Text>
              <Text style={styles.cardValor}>{desvioPadrao}%</Text>
            </View>

          </View>

          {/* GRÁFICO 1 – últimas 20 */}
          <Text style={styles.graficoTitulo}>📉 Últimas 20 Capturas</Text>
          <LineChart
            data={lineChartData} 
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.grafico}
          />

          {/* GRÁFICO 2 – pizza */}
          <Text style={styles.graficoTitulo}>🎯 Distribuição dos Níveis</Text>
          <PieChart
          data={distribuicao}
          width={screenWidth - 40}
          height={220}

          // showLegend={true} para melhor visualização da distribuição
          showText={true}
          showLegend={true}
          sectionAutoFocus
          backgroundColor="transparent"
          radius={100}
          centerLabelComponent={() => (
            <View style={{justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontSize: 20, color: '#6A4C93', fontWeight: 'bold'}}>
                {valores.length}
              </Text>
              <Text style={{fontSize: 12, color: '#333'}}>Total</Text>
            </View>
          )}
          style={styles.grafico}
        />

          {/* GRÁFICO 3 – semanal */}
          <Text style={styles.graficoTitulo}>Variação Diária (Min / Méd / Máx)</Text>
          <BarChart
            data={barChartData} 
            width={screenWidth - 40}
            height={250}
            chartConfig={chartConfig}
            style={styles.grafico}
          />

        </ScrollView>
)}
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
        </TouchableOpacity>

      </View>  
    </SafeAreaView>
  );
}

// GRÁFICOS 
const chartConfig = {
  backgroundColor: "#FFFFFF",
  backgroundGradientFrom: "#FBFCF5",
  backgroundGradientTo: "#FBFCF5",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(106, 76, 147, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`,
  propsForDots: { r: "4", strokeWidth: "1", stroke: "#6A4C93" },
};

// ESTILOS
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFCF5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FBFCF5",
  },
  usuario: {
    position: "absolute",
    top: 80,
    right: 25,
    fontSize: 12,
    color: "#6A4C93",
    fontStyle: "italic",
  },
  menuFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 15,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
 menuItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
menuTexto: { fontSize: 16, color: "#6A4C93" },
  label: {
    fontSize: 14,
    color: "#6A4C93",
    fontWeight: "bold",
    marginTop: 15,
  },
dropdown: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    height: 45,
    paddingHorizontal: 10,
    elevation: 2,
  },
  cardGrid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFF",
    width: "48%",
    padding: 10,
    borderRadius: 12,
    borderLeftWidth: 6,
    marginBottom: 10,
    elevation: 3,
  },
  cardTitulo: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  cardValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6A4C93",
    marginVertical: 4,
  },
  graficoTitulo: {
    fontSize: 15,
    color: "#6A4C93",
    fontWeight: "bold",
    marginTop: 15,
  },
  grafico: {
    marginVertical: 8,
    borderRadius: 12,
    alignSelf: 'center', 
  },
  voltarBtn: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6A4C93",
    fontWeight: "600",
  }
});
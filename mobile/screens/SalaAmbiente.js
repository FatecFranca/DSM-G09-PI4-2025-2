import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import HeaderPadrao from "../components/HeaderPadrao";
import api from "../services/api";
import { Dropdown } from "react-native-element-dropdown";
import { LineChart } from "react-native-chart-kit";

export default function SalaAmbiente({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [salas, setSalas] = useState([]);
  const [turma, setTurma] = useState("");

  const [capturando, setCapturando] = useState(false);
  const [nivelRuido, setNivelRuido] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState([]);

  const [animBarras] = useState(new Animated.Value(0));
  const [menuVisivel, setMenuVisivel] = useState(false);

  const safeNumber = (n) => {
  if (n === null || n === undefined) return 0;
  if (typeof n !== "number") n = Number(n);
  if (!isFinite(n)) return 0;
  return n;
};


  // Carrega usuário logado
  useEffect(() => {
    AsyncStorage.getItem("usuario").then((nome) => {
      if (nome) setUsuario(nome);
    });
  }, []);

  // Carrega salas do backend
  useEffect(() => {
    const carregarSalas = async () => {
      try {
        const { data } = await api.get("/salas");
        setSalas(data);
      } catch (err) {
        console.log("Erro ao carregar salas:", err);
      }
    };
    carregarSalas();
  }, []);

  // Equalizador animado
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animBarras, {
          toValue: 1,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(animBarras, {
          toValue: 0,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // POLLING: Buscar dados da sala a cada 2s enquanto captura estiver ligada
  useEffect(() => {
    let intervalo;

    if (capturando && turma) {
      intervalo = setInterval(async () => {
        try {
          const { data } = await api.get(`/sensores/ultimos/${turma}`);
          if (data.length > 0) {
            setNivelRuido(safeNumber(data[0].db));

            setDadosGrafico(data.map((item) => safeNumber(item.db)));

          }
        } catch (err) {
          console.log("Erro ao buscar dados:", err);
        }
      }, 2000);
    }

    return () => clearInterval(intervalo);
  }, [capturando, turma]);

  // Alturas dinâmicas do equalizador
  const alturas = [
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [40, 80] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [70, 20] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [50, 90] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [60, 40] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [30, 70] }),
  ];

  // Iniciar captura → backend publica MQTT
  const iniciarCaptura = async () => {
    if (!turma) {
      alert("Selecione uma turma!");
      return;
    }

    try {
      await api.post("/captura/selecionar-sala", { sala: turma });
      await api.post("/captura/iniciar");

      setCapturando(true);
    } catch (err) {
      console.log("Erro ao iniciar captura:", err);
      alert("Erro ao iniciar captura.");
    }
  };

  // Parar captura
  const pararCaptura = async () => {
    try {
      await api.post("/captura/parar");
      setCapturando(false);
    } catch (err) {
      console.log("Erro ao parar captura:", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.container}>
        <HeaderPadrao titulo="Sala Ambiente" onMenuPress={() => setMenuVisivel(true)} />

        <Text style={styles.usuario}>{usuario}</Text>

        {/*  MENU LATERAL */}
                <Modal
                  transparent
                  visible={menuVisivel}
                  animationType="fade"
                  onRequestClose={() => setMenuVisivel(false)}
                >
                  <View style={styles.menuFundo}>
                    <TouchableOpacity
                      style={StyleSheet.absoluteFill}
                      activeOpacity={1}
                      onPress={() => setMenuVisivel(false)}
                    />
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
                            {tela === "Login"
                              ? "🏠 Home"
                              : tela === "SalaAmbiente"
                              ? "▶️ Sala Ambiente"
                              : tela === "Gamificacao"
                              ? "🎮 Gamificação"
                              : tela === "Relatorios"
                              ? "📊 Relatórios"
                              : tela === "Cadastro"
                              ? "🧾 Cadastro"
                              : "⚙️ Configurações"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </Modal>

        {/* DROPDOWN DE SALAS */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.subtitulo}>Selecionar turma atual:</Text>

          <Dropdown
            style={styles.dropdown}
            data={salas.map((s) => ({ label: s.nome, value: s.nome }))}
            labelField="label"
            valueField="value"
            placeholder="Selecione uma turma"
            value={turma}
            onChange={(item) => setTurma(item.value)}
          />
        </View>

        {/* BOTÕES */}
        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={[styles.botao, { backgroundColor: "#8AC926" }]}
            onPress={iniciarCaptura}
          >
            <Text style={styles.textoBotao}>▶️ Iniciar Captura</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, { backgroundColor: "#FF595E" }]}
            onPress={pararCaptura}
          >
            <Text style={styles.textoBotao}>⏸️ Parar Captura</Text>
          </TouchableOpacity>
        </View>

        {/* EQUALIZADOR */}
        {capturando && (
          <View style={styles.equalizadorContainer}>
            <Text style={styles.nivelTexto}>Nível de ruído: {nivelRuido} dB</Text>
            <View style={styles.barras}>
              {alturas.map((altura, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.barra,
                    {
                      height: altura,
                      backgroundColor: ["#8AC926", "#FFCA3A", "#FF595E", "#8AC926", "#FFCA3A"][i],
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}


          {/* GRÁFICO */}
          {capturando && dadosGrafico.length === 0 && (
            <View style={{ marginTop: 40, height: 170, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: "#6A4C93" }}>
                Aguardando primeiros dados do sensor...
              </Text>
            </View>
          )}
          
          {capturando && dadosGrafico.length > 0 && (
          <View style={{ marginTop: 40 }}>
              <LineChart
                data={{
                  labels: dadosGrafico.map(() => ""), 
                  
                  // 'dadosGrafico' não pode ser um array vazio
                  datasets: [{ data: dadosGrafico }], 
                }}
                width={320}
                height={170}
                yAxisSuffix="dB"
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: () => "#6A4C93",
                  labelColor: () => "#6A4C93",
                  propsForDots: { r: "3" },
                }}
                bezier
                style={{ borderRadius: 10 }}
              />
            </View>
          )}

        {/* GAMIFICAÇÃO */}
        <TouchableOpacity
          style={styles.botaoGamificacao}
          onPress={() => navigation.navigate("Gamificacao")}
        >
          <Text style={styles.textoBotao}>🎮 Ir para Gamificação</Text>
        </TouchableOpacity>

        {/* VOLTAR */}
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* -- STYLES -- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFCF5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, alignItems: "center", backgroundColor: "#FBFCF5" },
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
  dropdownContainer: { width: "85%", marginVertical: 20 },
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
  subtitulo: { fontSize: 16, color: "#6A4C93", marginBottom: 10 },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 15,
  },
  botao: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  equalizadorContainer: { alignItems: "center", marginTop: 40 },
  nivelTexto: { fontSize: 16, marginBottom: 10, color: "#333" },
  barras: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 100,
    gap: 10,
  },
  barra: { width: 15, borderRadius: 5 },
  botaoGamificacao: {
    backgroundColor: "#6A4C93",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 90,
  },
  voltarBtn: { position: "absolute", bottom: 30, left: 30 },
});

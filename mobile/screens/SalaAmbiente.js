import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ adicionado
import HeaderPadrao from "../components/HeaderPadrao";
import api from "../services/api";

export default function SalaAmbiente({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [salas, setSalas] = useState([]);
  const [turma, setTurma] = useState("");
  const [capturando, setCapturando] = useState(false);
  const [nivelRuido, setNivelRuido] = useState(0);
  const [animBarras] = useState(new Animated.Value(0));
  const [menuVisivel, setMenuVisivel] = useState(false);

  // Carrega o usuário logado
  useEffect(() => {
    AsyncStorage.getItem("usuario").then((nome) => {
      if (nome) setUsuario(nome);
    });
  }, []);

  // Buscar salas no banco do MongoDB ao abrir a tela
  useEffect(() => {
    const carregarSalas = async () => {
      try {
        const { data } = await api.get("/salas");
        setSalas(data);
      } catch (err) {
        console.error("Erro ao carregar salas:", err.response?.data || err.message);
      }
    };
    carregarSalas();
  }, []);

  // Animação do equalizador
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

  // Simulação do ruído enquanto captura está ativa
  useEffect(() => {
    let intervalo;
    if (capturando) {
      intervalo = setInterval(() => {
        const ruidoSimulado = Math.floor(Math.random() * 90);
        setNivelRuido(ruidoSimulado);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [capturando]);

  // Animações das barras do equalizador
  const alturas = [
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [40, 80] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [70, 20] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [50, 90] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [60, 40] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [30, 70] }),
  ];

  return (
    <SafeAreaView style={styles.safeArea}>  {/* ✅ Envolve toda a tela */}
      <View style={styles.container}>
        {/* Cabeçalho padronizado */}
        <HeaderPadrao titulo="Sala Ambiente" onMenuPress={() => setMenuVisivel(true)} />

        {/* Nome do usuário no canto superior direito */}
        <Text style={styles.usuario}>{usuario}</Text>

        {/* Modal de menu de navegação */}
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
              {[
                "Login",
                "SalaAmbiente",
                "Gamificacao",
                "Relatorios",
                "Cadastro",
                "Configuracoes",
              ].map((tela, i) => (
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

        {/* Corpo principal */}
        <Text style={styles.subtitulo}>Selecionar turma atual:</Text>
        <Picker
          selectedValue={turma}
          style={styles.picker}
          onValueChange={(valor) => setTurma(valor)}
        >
          <Picker.Item label="Selecione uma turma" value="" />
          {salas.map((sala) => (
            <Picker.Item key={sala._id} label={sala.nome} value={sala.nome} />
          ))}
          <Picker.Item label="Cadastrar nova turma" value="nova" />
        </Picker>

        {turma === "nova" && (
          <TouchableOpacity
            style={styles.botaoCadastro}
            onPress={() => navigation.navigate("Cadastro")}
          >
            <Text style={styles.textoCadastro}>Ir para Cadastro de Turma</Text>
          </TouchableOpacity>
        )}

        {/* Botões de captura */}
        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={[styles.botao, { backgroundColor: "#8AC926" }]}
            onPress={() => setCapturando(true)}
          >
            <Text style={styles.textoBotao}>▶️ Iniciar Captura</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, { backgroundColor: "#FF595E" }]}
            onPress={() => setCapturando(false)}
          >
            <Text style={styles.textoBotao}>⏸️ Parar Captura</Text>
          </TouchableOpacity>
        </View>

        {/* Equalizador e ruído */}
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
                      backgroundColor: [
                        "#8AC926",
                        "#FFCA3A",
                        "#FF595E",
                        "#8AC926",
                        "#FFCA3A",
                      ][i],
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Botão para tela de gamificação */}
        <TouchableOpacity
          style={styles.botaoGamificacao}
          onPress={() => navigation.navigate("Gamificacao")}
        >
          <Text style={styles.textoBotao}>🎮 Ir para Gamificação</Text>
        </TouchableOpacity>

        {/* Botão de voltar fixo */}
        <TouchableOpacity
          style={styles.voltarBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {   // ✅ nova área segura
    flex: 1,
    backgroundColor: "#A4D233", // mantém cor do cabeçalho
  },
  container: {
    flex: 1,
    backgroundColor: "#FBFCF5",
    alignItems: "center",
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
  menuTexto: { fontSize: 16, color: "#6A4C93", fontWeight: "600" },
  subtitulo: { fontSize: 16, color: "#6A4C93", marginTop: 60, marginBottom: 20 },
  picker: {
    width: "70%",
    height: 30,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    marginBottom: 20,
  },
  botaoCadastro: {
    backgroundColor: "#FFCA3A",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  textoCadastro: { color: "#333", fontWeight: "600" },
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
  nivelTexto: { fontSize: 16, color: "#333", marginBottom: 10 },
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
  voltarBtn: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
});

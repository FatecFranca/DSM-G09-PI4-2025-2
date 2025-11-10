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

export default function SalaAmbiente({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [salas, setSalas] = useState([]);
  const [turma, setTurma] = useState("");
  const [capturando, setCapturando] = useState(false);
  const [nivelRuido, setNivelRuido] = useState(0);
  const [animBarras] = useState(new Animated.Value(0));
  const [menuVisivel, setMenuVisivel] = useState(false);

  // Carrega o usuário logado do AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("usuario").then((nome) => {
      if (nome) setUsuario(nome);
    });
  }, []);

  // Busca salas no banco de dados (MongoDB Atlas via API)
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

  // Animação das barras do equalizador
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

  // Simula a captura de som enquanto o modo está ativo
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

  // Alturas animadas do equalizador
  const alturas = [
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [40, 80] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [70, 20] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [50, 90] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [60, 40] }),
    animBarras.interpolate({ inputRange: [0, 1], outputRange: [30, 70] }),
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Barra de status do sistema — cor padrão do dispositivo */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.container}>
        {/* Cabeçalho padronizado */}
        <HeaderPadrao titulo="Sala Ambiente" onMenuPress={() => setMenuVisivel(true)} />

        {/* Nome do usuário logado */}
        <Text style={styles.usuario}>{usuario}</Text>

        {/* Menu lateral */}
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

        {/* Seletor de turma/sala */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.subtitulo}>Selecionar turma atual:</Text>
          <Dropdown
            style={styles.dropdown}
            data={salas.map((s) => ({ label: s.nome, value: s.nome }))}
            labelField="label"
            valueField="value"
            placeholder="Selecione uma turma"
            placeholderStyle={{ color: "#888" }}
            selectedTextStyle={{ color: "#333", fontWeight: "bold" }}
            itemTextStyle={{ color: "#333" }}
            activeColor="#EEE"
            value={turma}
            onChange={(item) => setTurma(item.value)}
          />
        </View>

        {turma === "nova" && (
          <TouchableOpacity
            style={styles.botaoCadastro}
            onPress={() => navigation.navigate("Cadastro")}
          >
            <Text style={styles.textoCadastro}>Ir para Cadastro de Turma</Text>
          </TouchableOpacity>
        )}

        {/* Botões principais */}
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

        {/* Equalizador dinâmico */}
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

        {/* Botão gamificação */}
        <TouchableOpacity
          style={styles.botaoGamificacao}
          onPress={() => navigation.navigate("Gamificacao")}
        >
          <Text style={styles.textoBotao}>🎮 Ir para Gamificação</Text>
        </TouchableOpacity>

        {/* Botão voltar */}
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/*  Estilos */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFCF5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  subtitulo: { fontSize: 16, color: "#6A4C93", marginBottom: 10 },
  dropdownContainer: {
    width: "85%",
    marginVertical: 20,
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

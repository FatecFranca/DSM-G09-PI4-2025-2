import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Animated,
  Easing,
  Picker,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api"; //  Importa a instância do Axios configurada

export default function SalaAmbiente({ navigation }) {
  // -------------------------------
  //  Estados principais da tela
  // -------------------------------
  const [usuario, setUsuario] = useState(""); // guarda nome do usuário logado
  const [salas, setSalas] = useState([]); // lista de salas vindas do banco
  const [turma, setTurma] = useState(""); // sala/turma selecionada
  const [capturando, setCapturando] = useState(false); // controla início e parada de captura
  const [nivelRuido, setNivelRuido] = useState(0); // valor atual do ruído
  const [animBarras] = useState(new Animated.Value(0)); // valor animado para o equalizador
  const [menuVisivel, setMenuVisivel] = useState(false); // controla visibilidade do menu

  // -------------------------------
  //  Busca nome do usuário salvo no AsyncStorage
  // -------------------------------
  useEffect(() => {
    AsyncStorage.getItem("usuario").then((nome) => {
      if (nome) setUsuario(nome);
    });
  }, []);

  // -------------------------------
  //  Busca todas as salas cadastradas no MongoDB via backend
  // -------------------------------
  useEffect(() => {
    const carregarSalas = async () => {
      try {
        const resposta = await api.get("/salas");
        console.log("🎓 Salas carregadas:", resposta.data);
        setSalas(resposta.data); // salva lista de salas no estado
      } catch (erro) {
        console.error("Erro ao carregar salas:", erro.message);
      }
    };

    carregarSalas(); // executa quando a tela abre
  }, []);

  // -------------------------------
  //  Animação do equalizador (subindo e descendo as barras)
  // -------------------------------
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

  // -------------------------------
  //  Simulação de leitura de ruído (até conectar o ESP32 real)
  // -------------------------------
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

  // -------------------------------
  //  Define alturas animadas das barras do equalizador
  // -------------------------------
  const altura1 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [40, 80] });
  const altura2 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [70, 20] });
  const altura3 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [50, 90] });
  const altura4 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [60, 40] });
  const altura5 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [30, 70] });

  // -------------------------------
  //  Renderização principal da tela
  // -------------------------------
  return (
    <View style={styles.container}>
      {/* 🐾 Logo do OuvIoT */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      {/* 🔙 Botão de voltar */}
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="arrow-back-circle" size={34} color="#6A4C93" />
      </TouchableOpacity>

      {/* 👤 Nome do usuário logado */}
      <Text style={styles.usuario}>{usuario}</Text>

      {/* ☰ Botão de menu superior */}
      <TouchableOpacity
        style={styles.menuBotao}
        onPress={() => setMenuVisivel(!menuVisivel)}
      >
        <Text style={styles.menuEmoji}>☰</Text>
      </TouchableOpacity>

      {/* 📋 Menu lateral (abrir e fechar com clique) */}
      <Modal
        transparent
        visible={menuVisivel}
        animationType="fade"
        onRequestClose={() => setMenuVisivel(false)}
      >
        <View style={styles.menuFundo} pointerEvents="box-none">
          {/* Fecha o menu ao clicar fora */}
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
                    : tela === "Configuracoes"
                    ? "⚙️ Configurações"
                    : tela}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/*  Título e subtítulo */}
      <Text style={styles.titulo}>SALA AMBIENTE</Text>
      <Text style={styles.subtitulo}>Selecionar turma atual</Text>

      {/*  Dropdown dinâmico com turmas vindas do MongoDB */}
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

      {/*  Botão para cadastrar nova turma, se selecionado */}
      {turma === "nova" && (
        <TouchableOpacity
          style={styles.botaoCadastro}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.textoCadastro}>Ir para Cadastro de Turma</Text>
        </TouchableOpacity>
      )}

      {/*  Botões de captura de som */}
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

      {/*  Equalizador animado e nível de ruído */}
      {capturando && (
        <View style={styles.equalizadorContainer}>
          <Text style={styles.nivelTexto}>Nível de ruído: {nivelRuido} dB</Text>
          <View style={styles.barras}>
            <Animated.View style={[styles.barra, { height: altura1, backgroundColor: "#8AC926" }]} />
            <Animated.View style={[styles.barra, { height: altura2, backgroundColor: "#FFCA3A" }]} />
            <Animated.View style={[styles.barra, { height: altura3, backgroundColor: "#FF595E" }]} />
            <Animated.View style={[styles.barra, { height: altura4, backgroundColor: "#8AC926" }]} />
            <Animated.View style={[styles.barra, { height: altura5, backgroundColor: "#FFCA3A" }]} />
          </View>
        </View>
      )}

      {/*  Botão para acessar a tela de gamificação */}
      <TouchableOpacity
        style={styles.botaoGamificacao}
        onPress={() => navigation.navigate("Gamificacao")}
      >
        <Text style={styles.textoBotao}>🎮 Ir para Gamificação</Text>
      </TouchableOpacity>
    </View>
  );
}

// -------------------------------
//  Estilos visuais da tela
// -------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFCF5", alignItems: "center", paddingTop: 40 },
  logo: {
    position: "absolute",
    top: 40,
    left: 25,
    width: 60,
    height: 60,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  voltar: { position: "absolute", top: 120, left: 25 },
  menuBotao: { position: "absolute", top: 50, right: 25 },
  menuEmoji: { fontSize: 26, color: "#6A4C93" },
  usuario: { position: "absolute", top: 25, right: 25, fontSize: 12, color: "#6A4C93", fontWeight: "600" },
  titulo: { marginTop: 120, fontSize: 26, fontWeight: "bold", color: "#6A4C93" },
  subtitulo: { fontSize: 14, color: "#6A4C93", marginTop: 5, marginBottom: 10 },
  picker: {
    width: "80%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    marginBottom: 10,
  },
  botaoCadastro: { backgroundColor: "#FFCA3A", padding: 10, borderRadius: 8, marginBottom: 20 },
  textoCadastro: { color: "#333", fontWeight: "600" },
  botoesContainer: { flexDirection: "row", justifyContent: "space-around", width: "90%", marginTop: 15 },
  botao: { flex: 1, padding: 12, borderRadius: 10, marginHorizontal: 5, alignItems: "center" },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  equalizadorContainer: { alignItems: "center", marginTop: 20 },
  nivelTexto: { fontSize: 16, color: "#333", marginBottom: 10 },
  barras: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", height: 100, gap: 10 },
  barra: { width: 15, borderRadius: 5 },
  botaoGamificacao: {
    backgroundColor: "#6A4C93",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 40,
  },
});

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

export default function SalaAmbiente({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [turma, setTurma] = useState("Selecione uma turma");
  const [capturando, setCapturando] = useState(false);
  const [nivelRuido, setNivelRuido] = useState(0);
  const [animBarras] = useState(new Animated.Value(0));
  const [menuVisivel, setMenuVisivel] = useState(false);

  // Carrega nome do usuário
  useEffect(() => {
    AsyncStorage.getItem("usuario").then((nome) => {
      if (nome) setUsuario(nome);
    });
  }, []);

  // Animação de equalizador
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

  // Simulação de leitura de ruído (posteriormente substituída pela API ESP32)
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

  // Equalizador animado
  const altura1 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [40, 80] });
  const altura2 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [70, 20] });
  const altura3 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [50, 90] });
  const altura4 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [60, 40] });
  const altura5 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [30, 70] });

  return (
    <View style={styles.container}>
      {/* Logo e cabeçalho */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="arrow-back-circle" size={34} color="#6A4C93" />
      </TouchableOpacity>

      {/* Nome do usuário */}
      <Text style={styles.usuario}>{usuario}</Text>

      {/* Botão voltar */}
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="arrow-back-circle" size={34} color="#6A4C93" />
      </TouchableOpacity>
    
    {/* Botão de menu ☰ */}
      <TouchableOpacity
        style={styles.menuBotao}
        onPress={() => setMenuVisivel(!menuVisivel)}
      >
        <Text style={styles.menuEmoji}>☰</Text>
      </TouchableOpacity>

      {/* Modal de Menu */}
      <Modal
        transparent
        visible={menuVisivel}
        animationType="fade"
        onRequestClose={() => setMenuVisivel(false)}
>
        <View style={styles.menuFundo} pointerEvents="box-none">
          {/* Fecha o menu ao clicar fora OU ao clicar de novo no botão ☰ */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setMenuVisivel(false)}
          />
          <View style={styles.menuContainer}>
            {["Login", "SalaAmbiente", "Gamificacao", "Relatorios", "Cadastro", "Configuracoes"].map(
              (tela, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setMenuVisivel(false);
                    navigation.navigate(tela);
                  }}
                  style={styles.menuItem}
                >
                      <Text style={styles.menuTexto}>
                        {tela === "Login" ? "🏠 Home"
                          : tela === "SalaAmbiente" ? "▶️ Sala Ambiente"
                          : tela === "Gamificacao" ? "🎮 Gamificação"
                          : tela === "Relatorios" ? "📊 Relatórios"
                          : tela === "Cadastro" ? "🧾 Cadastro"
                          : tela === "Configuracoes" ? "⚙️ Configurações"
                          : tela}
                      </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        </Modal>

      {/* Título */}
      <Text style={styles.titulo}>SALA AMBIENTE</Text>
      <Text style={styles.subtitulo}>Selecionar turma atual</Text>

      {/* Menu dropdown */}
      <Picker
        selectedValue={turma}
        style={styles.picker}
        onValueChange={(valor) => setTurma(valor)}
      >
        <Picker.Item label="Selecione uma turma" value="" />
        <Picker.Item label="5B" value="5B" />
        <Picker.Item label="1EM-A" value="1EM-A" />
        <Picker.Item label="1BTARDE" value="1BTARDE" />
        <Picker.Item label="Cadastrar nova turma" value="nova" />
      </Picker>

      {/* Se selecionar cadastrar nova turma */}
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

      {/* Equalizador e nível de ruído */}
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

      {/* Botão gamificação */}
      <TouchableOpacity
        style={styles.botaoGamificacao}
        onPress={() => navigation.navigate("Gamificacao")}
      >
        <Text style={styles.textoBotao}>🎮 Ir para Gamificação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFCF5",
    alignItems: "center",
    paddingTop: 40,
  },
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
  voltar: {
    position: "absolute",
    top: 120,
    left: 25,
  },
  menuBotao: { position: "absolute", top: 50, right: 25 },
  menuEmoji: { fontSize: 26, color: "#6A4C93" },
  menuFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 90,
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
 
  usuario: {
    position: "absolute",
    top: 25,
    right: 25,
    fontSize: 12,
    color: "#6A4C93",
    fontWeight: "600",
  },
  titulo: {
    marginTop: 120,
    fontSize: 26,
    fontWeight: "bold",
    color: "#6A4C93",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitulo: {
    fontSize: 14,
    color: "#6A4C93",
    marginTop: 5,
    marginBottom: 10,
  },
  picker: {
    width: "80%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    marginBottom: 10,
  },
  botaoCadastro: {
    backgroundColor: "#FFCA3A",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  textoCadastro: {
    color: "#333",
    fontWeight: "600",
  },
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
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  equalizadorContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  nivelTexto: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  barras: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 100,
    gap: 10,
  },
  barra: {
    width: 15,
    borderRadius: 5,
  },
  botaoGamificacao: {
    backgroundColor: "#6A4C93",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 40,
  },
});

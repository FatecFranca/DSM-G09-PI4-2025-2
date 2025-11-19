import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Modal,
} from "react-native";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import HeaderPadrao from "../components/HeaderPadrao";
import api from "../services/api";
import { Dropdown } from "react-native-element-dropdown"; 

export default function Gamificacao({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [nivelMedio, setNivelMedio] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [lottie, setLottie] = useState(require("../assets/lotties/atencao.json"));
    const [salas, setSalas] = useState([]);
    const [turma, setTurma] = useState("");
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

  // Simula leitura de ruído (substituir futuramente pelos dados do sensor)
  useEffect(() => {
    const timer = setInterval(() => {
      const valor = Math.floor(Math.random() * 90); // valor aleatório entre 0 e 90
      setNivelMedio(valor);

      if (valor < 60) {
        setFeedback("Excelente! Sala em silêncio 👏");
        setLottie(require("../assets/lotties/feliz.json"));
      } else if (valor < 75) {
        setFeedback("Atenção! O barulho está aumentando 😐");
        setLottie(require("../assets/lotties/atencao.json"));
      } else {
        setFeedback("Muito barulho! Vamos reduzir o som 😣");
        setLottie(require("../assets/lotties/triste.json"));
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Barra de status do sistema — cor padrão do dispositivo */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.container}>
        {/* Cabeçalho com botão de menu */}
        <HeaderPadrao titulo="Gamificação" onMenuPress={() => setMenuVisivel(true)} />

        {/* Nome do usuário no canto superior direito */}
        <Text style={styles.usuario}>{usuario}</Text>

        <Text style={styles.titulo}>Desempenho Acústico da Turma</Text>

        <Text style={styles.titulo}>(em implantação, dados simulados)</Text>

        <View style={styles.lottieContainer}>

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

        

          <LottieView
            source={lottie}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>

        <Text style={styles.nivelTexto}>{nivelMedio} dB</Text>
        <Text style={styles.feedback}>{feedback}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>💯 Pontuação da Turma</Text>
          <Text style={styles.cardValor}>
            {nivelMedio < 60 ? "100 pts" : nivelMedio < 75 ? "70 pts" : "40 pts"}
          </Text>
          <Text style={styles.cardInfo}>
            {nivelMedio < 60
              ? "Excelente comportamento!"
              : nivelMedio < 75
              ? "Pode melhorar, foco na atenção!"
              : "Precisamos controlar o ruído!"}
          </Text>
        </View>

        {/* Botão voltar */}
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Configuração visual da tela
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
  menuTexto: { fontSize: 16, color: "#6A4C93", fontWeight: "600" },
  label: {
    fontSize: 14,
    color: "#6A4C93",
    fontWeight: "bold",
    marginTop: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A4C93",
    marginTop: 20,
    marginBottom: 10,
  },
  lottieContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  nivelTexto: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  feedback: {
    fontSize: 16,
    color: "#6A4C93",
    fontWeight: "500",
    marginVertical: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8AC926",
    marginBottom: 5,
  },
  cardValor: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A4C93",
  },
  cardInfo: {
    fontSize: 13,
    color: "#555",
    marginTop: 5,
  },
  voltarBtn: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
    dropdown: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    height: 45,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

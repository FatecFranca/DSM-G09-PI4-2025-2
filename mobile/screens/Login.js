import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [animBarras] = useState(new Animated.Value(0));

  // Animação das barras
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animBarras, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(animBarras, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
  if (!email || !senha) {
    alert("Preencha e-mail e senha!");
    return;
  }

  try {
    const resposta = await api.post("/login", { email, senha });
    const usuario = resposta.data.usuario;

    if (usuario) {
      await AsyncStorage.setItem("usuario", usuario.nome);
      alert("Login realizado com sucesso!");
      navigation.navigate("SalaAmbiente");
    } else {
      alert(resposta.data.message || "Usuário ou senha incorretos.");
    }
  } catch (erro) {
    alert(erro.response?.data?.message || "Erro ao conectar com o servidor.");
  }
};

  const handleCadastro = () => navigation.navigate("Cadastro");

  const handleConfiguracoes = () => {
  navigation.navigate("Configuracoes");
};


  // Alturas das barras animadas
  const altura1 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [40, 80] });
  const altura2 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [60, 30] });
  const altura3 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [20, 70] });
  const altura4 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [50, 90] });

  return (
    <LinearGradient colors={["#FBFCF5", "#fdfdfd"]} style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      {/* Botão Configurações ⚙️ */}
      <TouchableOpacity style={styles.configuracoes} onPress={handleConfiguracoes}>
        <Text style={styles.configEmoji}>⚙️</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.titulo}>
        <Text style={{ color: "#8AC926" }}>Ouv</Text>
        <Text style={{ color: "#FFCA3A" }}>Io</Text>
        <Text style={{ color: "#FF595E" }}>T</Text> App
      </Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botões */}
      <TouchableOpacity style={styles.botaoEntrar} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoCadastro} onPress={handleCadastro}>
        <Text style={styles.textoCadastro}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Equalizador de barras ilustrativo */}
      <View style={styles.barrasContainer}>
        <Animated.View style={[styles.barra, { height: altura1, backgroundColor: "#8AC926" }]} />
        <Animated.View style={[styles.barra, { height: altura2, backgroundColor: "#FFCA3A" }]} />
        <Animated.View style={[styles.barra, { height: altura3, backgroundColor: "#FF595E" }]} />
        <Animated.View style={[styles.barra, { height: altura4, backgroundColor: "#8AC926" }]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  logo: { width: 100, height: 100, marginBottom: 10, resizeMode: "contain",    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3, },
  configuracoes: {
    position: "absolute",
    top: 50,
    right: 30,
  },
  configEmoji: {
    fontSize: 24,
    color: "#6A4C93",
  },
  titulo: { fontSize: 26, fontWeight: "bold", marginBottom: 30,  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  botaoEntrar: {
    backgroundColor: "#8AC926",
    width: "80%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  botaoCadastro: {
    backgroundColor: "#e3e3e3",
    width: "80%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoCadastro: { color: "#555" },
  barrasContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 100,
    marginTop: 50,
    gap: 10,
  },
  barra: { width: 15, borderRadius: 5 },
});

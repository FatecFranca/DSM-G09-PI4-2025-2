// Importa dependências principais do React e React Native
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
  ActivityIndicator, // Componente nativo do React Native para mostrar "rodinha de carregamento"
} from "react-native";

// Importa o serviço de API (Axios configurado com o backend)
import api from "../services/api";

// Importa o AsyncStorage para salvar dados localmente (nome do usuário, etc.)
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importa o componente de gradiente para o fundo
import { LinearGradient } from "expo-linear-gradient";

// -----------------------------------------
// 💡 Componente principal de Login
// -----------------------------------------
export default function Login({ navigation }) {
  // Estados para armazenar os campos digitados
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Estado que controla a animação do equalizador
  const [animBarras] = useState(new Animated.Value(0));

  // Estado que controla se a tela está carregando (rodinha visível)
  const [carregando, setCarregando] = useState(false);

  // -------------------------------------------------
  //  useEffect: anima as barras do equalizador
  // -------------------------------------------------
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

  // -------------------------------------------------
  //  Função de login (valida e envia para o backend)
  // -------------------------------------------------
  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Preencha e-mail e senha!");
      return;
    }

    setCarregando(true); // 🌀 Mostra o spinner enquanto a requisição é processada

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
    } finally {
      setCarregando(false); // 🌀 Esconde o spinner quando termina (sucesso ou erro)
    }
  };

  // -------------------------------------------------
  //  Navega para a tela de cadastro
  // -------------------------------------------------
  const handleCadastro = () => navigation.navigate("Cadastro");

  // -------------------------------------------------
  //  Navega para a tela de configurações
  // -------------------------------------------------
  const handleConfiguracoes = () => {
    navigation.navigate("Configuracoes");
  };

  // -------------------------------------------------
  //  Define alturas interpoladas das barras animadas
  // -------------------------------------------------
  const altura1 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [40, 80] });
  const altura2 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [60, 30] });
  const altura3 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [20, 70] });
  const altura4 = animBarras.interpolate({ inputRange: [0, 1], outputRange: [50, 90] });

  // -------------------------------------------------
  //  Mostra tela de carregamento enquanto faz login
  // -------------------------------------------------
  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A4C93" /> 
        <Text style={{ color: "#6A4C93", marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  // -------------------------------------------------
  //  Estrutura visual da tela (UI principal)
  // -------------------------------------------------
  return (
    <LinearGradient colors={["#FBFCF5", "#fdfdfd"]} style={styles.container}>
      {/*  Logo do OuvIoT */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      {/*  Botão para ir às Configurações */}
      <TouchableOpacity style={styles.configuracoes} onPress={handleConfiguracoes}>
        <Text style={styles.configEmoji}>⚙️</Text>
      </TouchableOpacity>

      {/*  Título colorido com as cores do projeto */}
      <Text style={styles.titulo}>
        <Text style={{ color: "#8AC926" }}>Ouv</Text>
        <Text style={{ color: "#FFCA3A" }}>Io</Text>
        <Text style={{ color: "#FF595E" }}>T</Text> App
      </Text>

      {/*  Campo de e-mail */}
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      {/*  Campo de senha */}
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/*  Botão de entrar */}
      <TouchableOpacity style={styles.botaoEntrar} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      {/*  Botão para cadastro */}
      <TouchableOpacity style={styles.botaoCadastro} onPress={handleCadastro}>
        <Text style={styles.textoCadastro}>Cadastrar</Text>
      </TouchableOpacity>

      {/*  Equalizador animado ilustrativo */}
      <View style={styles.barrasContainer}>
        <Animated.View style={[styles.barra, { height: altura1, backgroundColor: "#8AC926" }]} />
        <Animated.View style={[styles.barra, { height: altura2, backgroundColor: "#FFCA3A" }]} />
        <Animated.View style={[styles.barra, { height: altura3, backgroundColor: "#FF595E" }]} />
        <Animated.View style={[styles.barra, { height: altura4, backgroundColor: "#8AC926" }]} />
      </View>
    </LinearGradient>
  );
}

// -------------------------------------------------
//  Estilos visuais da tela
// -------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },

  //  Container da tela de loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFCF5",
  },

  // Logo centralizado com sombra
  logo: { 
    width: 100, 
    height: 100, 
    marginBottom: 10, 
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  configuracoes: { position: "absolute", top: 50, right: 30 },
  configEmoji: { fontSize: 24, color: "#6A4C93" },

  titulo: { fontSize: 26, fontWeight: "bold", marginBottom: 30 },

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

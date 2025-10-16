import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Cadastro({ navigation }) {
  const [modo, setModo] = useState("usuario"); // "usuario" ou "turma"
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [turma, setTurma] = useState("");

  const salvar = async () => {
    if (modo === "usuario" && (!nome || !email || !senha)) {
      alert("Preencha todos os campos do usuário!");
      return;
    }
    if (modo === "turma" && !turma) {
      alert("Preencha o nome da turma!");
      return;
    }

    const dados =
      modo === "usuario"
        ? { tipo: "usuario", nome, email, senha }
        : { tipo: "turma", nome: turma };

    await AsyncStorage.setItem("cadastro", JSON.stringify(dados));
    alert("Cadastro salvo com sucesso!");
    navigation.navigate("SalaAmbiente");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Logo no canto superior */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      {/* Botão voltar */}
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="arrow-back-circle" size={34} color="#6A4C93" />
      </TouchableOpacity>

      {/* Título da tela */}
      <Text style={styles.titulo}>Cadastro</Text>

      {/* Cabeçalho do projeto piloto */}
      <Text style={styles.cabecalho}>
        Selecione para cadastrar um novo usuário ou nova sala/turma. O formulário de sala/turma aceita caracteres alfanuméricos.
      </Text>

      {/* Botões de seleção */}
      <View style={styles.modoContainer}>
        <TouchableOpacity
          style={[styles.botaoModo, modo === "usuario" && styles.botaoAtivo]}
          onPress={() => setModo("usuario")}
        >
          <Text style={[styles.textoModo, modo === "usuario" && styles.textoAtivo]}>
            Novo Usuário
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoModo, modo === "turma" && styles.botaoAtivo]}
          onPress={() => setModo("turma")}
        >
          <Text style={[styles.textoModo, modo === "turma" && styles.textoAtivo]}>
            Sala/Turma
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulário dinâmico */}
      {modo === "usuario" ? (
        <><Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          /><Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          /><Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </>
      ) : (
        <><Text style={styles.label}>Turma (ex: 5B, 1-EM-A, 2BTARDE)</Text><TextInput
          style={styles.input}
          autoCapitalize="characters"
          value={turma}
          onChangeText={setTurma}
        /></>
      )}

      {/* Botão salvar */}
      <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
        <Text style={styles.textoBotao}>Salvar Cadastro</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFCF5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    position: "absolute",
    top: 45,
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
  titulo: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "bold",
    color: "#6A4C93",
    marginBottom: 45,
  },
  cabecalho: {
    fontSize: 13,
    color: "#000000",
    textAlign: "center",
    marginBottom: 25,
  },
  modoContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
  },
  botaoModo: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  botaoAtivo: {
    backgroundColor: "#8AC926",
    borderRadius: 10,
  },
  textoModo: {
    color: "#555",
    fontWeight: "bold",
  },
  textoAtivo: {
    color: "#fff",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  botaoSalvar: {
    backgroundColor: "#8AC926",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import api from "../services/api";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Modal,
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
  const [menuVisivel, setMenuVisivel] = useState(false);

  const salvar = async () => {
if (modo === "usuario") {
  if (!nome || !email || !senha) {
    alert("Preencha todos os campos do usuário!");
    return;
  }

  try {
    console.log("🔗 Enviando para:", api.defaults.baseURL + "/usuarios");

    const resposta = await api.post("/usuarios", {
      nome,
      email,
      senha,
    });

    alert(resposta.data.message);
    navigation.navigate("Login");
  } catch (erro) {
    console.error("❌ Erro ao cadastrar usuário:", erro.response?.data || erro.message);
    alert(erro.response?.data?.message || "Erro ao cadastrar usuário.");
  }

  } else {
    if (!turma) {
      alert("Informe o nome da turma!");
      return;
    }

    try {
      const resposta = await api.post("/salas", { nome: turma });
      alert("Turma cadastrada com sucesso!");
      navigation.navigate("SalaAmbiente");
    } catch (erro) {
      alert("Erro ao cadastrar turma.");
    }
  }
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

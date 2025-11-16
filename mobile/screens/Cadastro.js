import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import HeaderPadrao from "../components/HeaderPadrao"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
export default function Cadastro({ navigation }) {
  // Estados de controle
  const [modo, setModo] = useState("usuario");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [turma, setTurma] = useState("");
  const [menuVisivel, setMenuVisivel] = useState(false);

  // Função de salvar usuário ou turma
  const salvar = async () => {
    if (modo === "usuario") {
      if (!nome || !email || !senha) {
        alert("Preencha todos os campos do usuário!");
        return;
      }

      try {
        const resposta = await api.post("/usuarios", { nome, email, senha });
        alert(resposta.data.message);
        navigation.navigate("Login");
      } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro.response?.data || erro.message);
        alert(erro.response?.data?.message || "Erro ao cadastrar usuário.");
      }
    } else {
      if (!turma) {
        alert("Informe o nome da turma!");
        return;
      }

      try {
        await api.post("/salas", { nome: turma });
        alert("Turma cadastrada com sucesso!");
        setTurma("");
        setModo("turma");
      } catch (erro) {
        alert("Erro ao cadastrar turma.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Barra de status do sistema — cor padrão do dispositivo */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Cabeçalho padronizado */}
      <HeaderPadrao
        titulo="Cadastro"
        onMenuPress={() => setMenuVisivel(!menuVisivel)}
      />

      {/* Modal de Menu */}
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

      {/* Descrição */}
      <Text style={styles.cabecalho}>
        Selecione para cadastrar um novo usuário ou nova sala/turma.
      </Text>

      {/* Alternador de modo */}
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

      {/* Formulário */}
      {modo === "usuario" ? (
        <>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Turma (ex: 5B, 1-EM-A, 2BTARDE)</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="characters"
            value={turma}
            onChangeText={setTurma}
          />
        </>
      )}

      {/* Botão salvar */}
      <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
        <Text style={styles.textoBotao}>Salvar Cadastro</Text>
      </TouchableOpacity>

      {/* Botão voltar */}
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
}

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
    padding: 0,
  },
  cabecalho: {
    padding: 25, 
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginVertical: 5,
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
  textoModo: { color: "#555", fontWeight: "bold" },
  textoAtivo: { color: "#fff" },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  label: { fontSize: 14, color: "#444", alignSelf: "flex-start", marginLeft: "10%" },
  botaoSalvar: {
    backgroundColor: "#8AC926",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  voltar: {
    position: "absolute",
    bottom: 30,
    left: 30,
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
});

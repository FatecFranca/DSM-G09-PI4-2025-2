import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  Picker,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Configuracoes({ navigation }) {
  const [email, setEmail] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [menuVisivel, setMenuVisivel] = useState(false);

  // Carrega turmas salvas
  useEffect(() => {
    const carregarTurmas = async () => {
      const dados = await AsyncStorage.getItem("turmas");
      if (dados) setTurmas(JSON.parse(dados));
    };
    carregarTurmas();
  }, []);

  // Confirmação antes de apagar  usuário
  const confirmarApagarUsuario = () => {
    if (!email.trim()) {
      Alert.alert("Aviso", "Digite o e-mail completo do usuário para confirmar a exclusão.");
      return;
    }

    Alert.alert(
      "Confirmação",
      `Você confirma a exclusão do usuário "${email}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", style: "destructive", onPress: apagarUsuario },
      ]
    );
  };

  // Apagar usuário
  const apagarUsuario = async () => {
    const usuarioSalvo = await AsyncStorage.getItem("usuario");
    if (!usuarioSalvo) {
      Alert.alert("Nenhum usuário encontrado.");
      return;
    }

    if (email.trim().toLowerCase() === usuarioSalvo.toLowerCase()) {
      await AsyncStorage.removeItem("usuario");
      setEmail("");
      Alert.alert("Sucesso", "Usuário apagado com sucesso!");
    } else {
      Alert.alert("Erro", "E-mail incorreto. Digite o e-mail completo do usuário cadastrado.");
    }
  };

  // Confirmação antes de apagar turma
  const confirmarApagarTurma = () => {
    if (!turmaSelecionada) {
      Alert.alert("Aviso", "Selecione uma turma para apagar.");
      return;
    }

    Alert.alert(
      "Confirmação",
      `Você confirma a exclusão da turma "${turmaSelecionada}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", style: "destructive", onPress: apagarTurma },
      ]
    );
  };

  // Apagar turma
  const apagarTurma = async () => {
    const novasTurmas = turmas.filter((t) => t !== turmaSelecionada);
    await AsyncStorage.setItem("turmas", JSON.stringify(novasTurmas));
    setTurmas(novasTurmas);
    setTurmaSelecionada("");
    Alert.alert("Sucesso", "Turma apagada com sucesso!");
  };

  return (

    <View style={styles.container}>
      {/* Logo e botão voltar */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
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
      <Text style={styles.titulo}>CONFIGURAÇÕES</Text>

      {/* Card apagar usuário */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>Apagar Usuário</Text>
        <Text style={styles.label}>Digite o e-mail completo do usuário:</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarApagarUsuario}>
          <Text style={styles.textoBotao}>Excluir Usuário</Text>
        </TouchableOpacity>
      </View>

      {/* Card apagar turma */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>Apagar Sala/Turma</Text>
        <Text style={styles.label}>Selecione a turma que deseja apagar:</Text>
        <Picker
          selectedValue={turmaSelecionada}
          style={styles.picker}
          onValueChange={(valor) => setTurmaSelecionada(valor)}
        >
          <Picker.Item label="Selecione uma turma" value="" />
          {turmas.map((t, index) => (
            <Picker.Item key={index} label={t} value={t} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarApagarTurma}>
          <Text style={styles.textoBotao}>Excluir Turma</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    marginTop: 120,
    fontSize: 26,
    fontWeight: "bold",
    color: "#6A4C93",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  subtitulo: { fontSize: 18, fontWeight: "bold", color: "#8AC926", marginBottom: 10 },
  label: { fontSize: 13, color: "#555", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  botaoExcluir: {
    backgroundColor: "#FF595E",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api"; // ✅ Integração com o backend

export default function Configuracoes({ navigation }) {
  const [email, setEmail] = useState("");
  const [turmas, setTurmas] = useState([]); // lista de turmas vindas do banco
  const [turmaDigitada, setTurmaDigitada] = useState("");

// ...


  // 🧍 Confirmação antes de excluir usuário
  const confirmarApagarUsuario = () => {
    if (!email.trim()) {
      Alert.alert("Aviso", "Digite o e-mail completo do usuário para confirmar a exclusão.");
      return;
    }

    Alert.alert("Confirmação", `Deseja realmente excluir o usuário "${email}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Confirmar", style: "destructive", onPress: apagarUsuario },
    ]);
  };

  // 🧍 Excluir usuário do banco
  const apagarUsuario = async () => {
    try {
      const { data } = await api.delete(`/usuarios/${encodeURIComponent(email)}`);
      Alert.alert("Sucesso", data.message || "Usuário excluído com sucesso!");
      setEmail("");
    } catch (err) {
      console.error("Erro ao excluir usuário:", err.response?.data || err.message);
      Alert.alert("Erro", err.response?.data?.message || "Usuário não encontrado no banco.");
    }
  };


  // 🏫 Confirmação antes de excluir turma
  const confirmarApagarTurma = () => {
    if (!turmaDigitada.trim()) {
      Alert.alert("Aviso", "Digite o nome ou código da turma para excluir.");
      return;
    }

     Alert.alert("Confirmação",`Deseja realmente excluir a turma "${turmaDigitada}"?\n\n⚠️ Ao excluir, todos os dados dos sensores e históricos dessa turma serão removidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", style: "destructive", onPress: apagarTurma },
      ]
    );
  };



  // 🏫 Excluir turma no backend (Mongo Atlas)
  const apagarTurma = async () => {
    try {
      const { data } = await api.delete(`/salas/${encodeURIComponent(turmaDigitada)}`);
      Alert.alert("Sucesso", data.message || "Turma excluída com sucesso!");
      // Atualiza lista local removendo turma
      setTurmas((prev) => prev.filter((t) => t.nome !== turmaDigitada));
      setTurmaDigitada("");
    } catch (err) {
      console.error("Erro ao excluir sala:", err.response?.data || err.message);
      Alert.alert("Erro", err.response?.data?.message || "Falha ao excluir sala.");
    }
  };


  return (
    <View style={styles.container}>
      {/* 🔊 Logo e botão voltar */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="arrow-back-circle" size={34} color="#6A4C93" />
      </TouchableOpacity>

      {/* 🧩 Título principal */}
      <Text style={styles.titulo}>CONFIGURAÇÕES</Text>

      {/* 🧍 Card: apagar usuário */}
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

      {/* 🏫 Card: apagar turma */}
            <View style={styles.card}>
        <Text style={styles.subtitulo}>Apagar Sala/Turma</Text>
        <Text style={styles.label}>Digite a Sala/Turma:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 6A ou 3BManha"
          value={turmaDigitada}
          onChangeText={setTurmaDigitada}
          autoCapitalize="characters"
          keyboardType="default"
        />
        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarApagarTurma}>
          <Text style={styles.textoBotao}>Excluir Sala/Turma</Text>
        </TouchableOpacity>
      </View>



    </View>
  );
}

/* 🎨 Estilos */
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    overflow: "hidden",
  },
  botaoExcluir: {
    backgroundColor: "#FF595E",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  pickerWrapper: {
  borderWidth: 1,
  borderColor: "#CCC",
  borderRadius: 10,
  backgroundColor: "#fff",
  marginBottom: 10,
  overflow: "hidden",
  minHeight: 45, // garante altura no iOS
  justifyContent: "center",
},
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import HeaderPadrao from "../components/HeaderPadrao";

export default function Configuracoes({ navigation }) {
  // Estados principais
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [email, setEmail] = useState("");
  const [turmaDigitada, setTurmaDigitada] = useState("");

  // Estados para o modal de confirmação
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tipoExclusao, setTipoExclusao] = useState(""); // "usuario" ou "turma"

  // =====================
  //  EXCLUSÃO DE USUÁRIO
  // =====================
  const confirmarApagarUsuario = () => {
    if (!email.trim()) {
      alert("Digite o e-mail completo do usuário para confirmar a exclusão.");
      return;
    }
    setTipoExclusao("usuario");
    setConfirmVisible(true); // abre o modal
  };

  const apagarUsuario = async () => {
    try {
      const { data } = await api.delete(`/usuarios/${encodeURIComponent(email)}`);
      alert(data.message || "Usuário excluído com sucesso!");
      setEmail("");
    } catch (err) {
      console.error("Erro ao excluir usuário:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Usuário não encontrado no banco.");
    }
  };

  // =====================
  //  EXCLUSÃO DE TURMA
  // =====================
  const confirmarApagarTurma = () => {
    if (!turmaDigitada.trim()) {
      alert("Digite o nome ou código da turma para excluir.");
      return;
    }
    setTipoExclusao("turma");
    setConfirmVisible(true);
  };

  const apagarTurma = async () => {
    try {
      const { data } = await api.delete(`/salas/${encodeURIComponent(turmaDigitada)}`);
      alert(data.message || "Turma excluída com sucesso!");
      setTurmaDigitada("");
    } catch (err) {
      console.error("Erro ao excluir sala:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Falha ao excluir sala.");
    }
  };

  // Chamada quando o usuário confirma no modal
  const confirmarExclusao = () => {
    setConfirmVisible(false);
    if (tipoExclusao === "usuario") apagarUsuario();
    else apagarTurma();
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho padronizado */}
      <HeaderPadrao titulo="Configurações" onMenuPress={() => setMenuVisivel(true)} />

      {/* Modal do menu principal */}
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
                    {tela === "Login" ? "🏠 Home"
                    : tela === "Cadastro" ? "🧾 Cadastro"
                    : "⚙️ Configurações"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* CARD - Apagar Usuário */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>Apagar Usuário</Text>
        <Text style={styles.label}>Digite o e-mail completo do usuário:</Text>
        <TextInput
          style={styles.input}
          placeholder="prof.ana@email.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarApagarUsuario}>
          <Text style={styles.textoBotao}>Excluir Usuário</Text>
        </TouchableOpacity>
      </View>

      {/* CARD - Apagar Turma */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>Apagar Sala/Turma</Text>
        <Text style={styles.label}>Digite a Sala/Turma:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 6A ou 3BManha"
          placeholderTextColor="#aaa"
          value={turmaDigitada}
          onChangeText={setTurmaDigitada}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarApagarTurma}>
          <Text style={styles.textoBotao}>Excluir Sala/Turma</Text>
        </TouchableOpacity>
      </View>

      {/* Botão voltar fixo */}
      <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
      </TouchableOpacity>
    </View>
  );
}

/* 🎨 Estilos */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFCF5", alignItems: "center" },
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
  voltarBtn: { position: "absolute", bottom: 20, right: 20 },
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
  botaoExcluir: {
    backgroundColor: "#FF595E",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A4C93",
    marginBottom: 10,
    textAlign: "center",
  },
  modalTexto: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalBotoes: { flexDirection: "row", justifyContent: "space-between" },
  modalBotao: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTextoBotao: { color: "#fff", fontWeight: "bold" },
});

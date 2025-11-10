

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderPadrao from "../components/HeaderPadrao";
import api from "../services/api";

export default function Configuracoes({ navigation }) {
  // Estados principais
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [email, setEmail] = useState("");
  const [turmaDigitada, setTurmaDigitada] = useState("");
  const [salas, setSalas] = useState([]); // ✅ Armazena salas vindas do backend

  // Estados do modal de confirmação
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tipoExclusao, setTipoExclusao] = useState(""); // "usuario" ou "turma"


  // Carrega salas do banco (Mongo Atlas)
  useEffect(() => {
    const carregarSalas = async () => {
      try {
        const response = await api.get("/salas");
        setSalas(response.data);
      } catch (error) {
        console.error("Erro ao carregar salas:", error.message);
      }
    };
    carregarSalas();
  }, []);

  //  Exclusão de usuário
  const confirmarApagarUsuario = () => {
    if (!email.trim()) {
      Alert.alert("Aviso", "Digite o e-mail completo do usuário para confirmar a exclusão.");
      return;
    }
    setTipoExclusao("usuario");
    setConfirmVisible(true);
  };

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

  // Exclusão de sala/turma
  const confirmarApagarTurma = () => {
    if (!turmaDigitada.trim()) {
      Alert.alert("Aviso", "Selecione a turma para excluir.");
      return;
    }
    setTipoExclusao("turma");
    setConfirmVisible(true);
  };

  const apagarTurma = async () => {
    try {
      const { data } = await api.delete(`/salas/${encodeURIComponent(turmaDigitada)}`);
      Alert.alert("Sucesso", data.message || "Turma excluída com sucesso!");
      setTurmaDigitada("");
      // Atualiza lista de salas
      setSalas((prev) => prev.filter((s) => s.nome !== turmaDigitada));
    } catch (err) {
      console.error("Erro ao excluir sala:", err.response?.data || err.message);
      Alert.alert("Erro", err.response?.data?.message || "Falha ao excluir sala.");
    }
  };

  // Executa exclusão após confirmação
  const confirmarExclusao = () => {
    setConfirmVisible(false);
    if (tipoExclusao === "usuario") apagarUsuario();
    else apagarTurma();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Cabeçalho padronizado */}
        <HeaderPadrao titulo="Configurações" onMenuPress={() => setMenuVisivel(true)} />

        {/* MENU LATERAL */}
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
              {["SalaAmbiente", "Relatorios", "Gamificacao", "Cadastro"].map((tela, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setMenuVisivel(false);
                    navigation.navigate(tela);
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuTexto}>
                    {tela === "SalaAmbiente"
                      ? "▶️ Sala Ambiente"
                      : tela === "Relatorios"
                      ? "📊 Relatórios"
                      : tela === "Gamificacao"
                      ? "🎮 Gamificação"
                      : "🧾 Cadastro"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* SEÇÃO: Excluir Usuário */}
        <View style={styles.card}>
          <Text style={styles.subtitulo}>Apagar Usuário</Text>
          <Text style={styles.label}>Digite o e-mail completo:</Text>
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

        {/* SEÇÃO: Excluir Sala/Turma */}
        <View style={styles.card}>
          <Text style={styles.subtitulo}>Apagar Sala/Turma</Text>
          <Text style={styles.label}>Selecione a turma que deseja excluir:</Text>

          {/* ✅ Dropdown com salas do backend */}
          <Dropdown
            style={styles.dropdown}
            data={salas.map((s) => ({ label: s.nome, value: s.nome }))}
            labelField="label"
            valueField="value"
            placeholder="Selecione uma sala"
            placeholderStyle={{ color: "#aaa" }}
            selectedTextStyle={{ color: "#333", fontWeight: "bold" }}
            itemTextStyle={{ color: "#333" }}
            activeColor="#EEE"
            value={turmaDigitada}
            onChange={(item) => setTurmaDigitada(item.value)}
          />

          <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarApagarTurma}>
            <Text style={styles.textoBotao}>Excluir Sala/Turma</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de Confirmação */}
        <Modal
          visible={confirmVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmVisible(false)}
        >
          <View style={styles.modalFundo}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitulo}>Confirmar Exclusão</Text>
              <Text style={styles.modalTexto}>
                {tipoExclusao === "usuario"
                  ? `Deseja realmente excluir o usuário "${email}"?`
                  : `Deseja realmente excluir a turma "${turmaDigitada}"?\n\nAo excluir, todos os dados dos sensores e históricos dessa turma serão removidos.`}
              </Text>

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={[styles.modalBotao, { backgroundColor: "#CCC" }]}
                  onPress={() => setConfirmVisible(false)}
                >
                  <Text style={styles.modalTextoBotao}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBotao, { backgroundColor: "#FF595E" }]}
                  onPress={confirmarExclusao}
                >
                  <Text style={styles.modalTextoBotao}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Botão voltar fixo */}
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

//Estilos
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
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  dropdown: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 10,
  },
  botaoExcluir: {
    backgroundColor: "#FF595E",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
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
  voltarBtn: { position: "absolute", bottom: 30, left:30 },
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
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBotao: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTextoBotao: { color: "#fff", fontWeight: "bold" },
});

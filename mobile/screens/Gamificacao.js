import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeaderPadrao from "../components/HeaderPadrao";

export default function Gamificacao({ navigation }) {
  const [menuVisivel, setMenuVisivel] = useState(false);

  return (
    <View style={styles.container}>
      {/* Cabeçalho padronizado */}
      <HeaderPadrao titulo="Gamificação" onMenuPress={() => setMenuVisivel(true)} />

      {/* Modal de menu de navegação */}
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

      {/* Corpo da tela */}
      <View style={styles.content}>
        <Text style={styles.texto}>
          🎮 Tela de Gamificação: aqui o aluno verá o monstrinho que muda de humor e os pontos ganhos.
        </Text>
      </View>

      {/* Botão voltar fixo */}
      <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-undo-circle" size={45} color="#6A4C93" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFCF5", alignItems: "center" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  texto: { fontSize: 16, color: "#6A4C93", textAlign: "center" },
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
  voltarBtn: { position: "absolute", bottom: 30, left: 30 },
});

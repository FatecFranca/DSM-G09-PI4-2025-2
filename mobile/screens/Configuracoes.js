// screens/Configuracoes.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Configuracoes() {
  const limpar = async () => {
    await AsyncStorage.clear();
    alert("Dados locais apagados!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configurações</Text>
      <TouchableOpacity style={styles.botao} onPress={limpar}>
        <Text style={styles.textoBotao}>🧹 Limpar dados locais</Text>
      </TouchableOpacity>
      <Text style={styles.versao}>Versão 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#6A4C93", marginBottom: 20 },
  botao: { backgroundColor: "#FFCA3A", padding: 12, borderRadius: 10 },
  textoBotao: { fontWeight: "bold", color: "#333" },
  versao: { marginTop: 20, color: "#888" },
});

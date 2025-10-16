// screens/SalaAmbiente.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Picker } from "react-native";

export default function SalaAmbiente({ navigation }) {
  const [capturando, setCapturando] = useState(false);
  const [turma, setTurma] = useState("4º A");

  const iniciarCaptura = () => {
    setCapturando(true);
    alert(`Captura iniciada para a turma ${turma}`);
  };

  const pararCaptura = () => {
    setCapturando(false);
    alert("Captura encerrada!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sala Ambiente</Text>

      <Text style={styles.subtitulo}>Selecione a Turma:</Text>
      <Picker selectedValue={turma} style={styles.picker} onValueChange={setTurma}>
        <Picker.Item label="4º A" value="4º A" />
        <Picker.Item label="5º B" value="5º B" />
        <Picker.Item label="3º C" value="3º C" />
      </Picker>

      {capturando ? (
        <TouchableOpacity style={[styles.botao, { backgroundColor: "#FF595E" }]} onPress={pararCaptura}>
          <Text style={styles.textoBotao}>⏸ Parar Captura</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.botao} onPress={iniciarCaptura}>
          <Text style={styles.textoBotao}>▶️ Iniciar Captura</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Gamificacao")} style={styles.link}>
        <Text style={styles.linkTexto}>Ir para Gamificação 🎮</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#8AC926", marginBottom: 20 },
  subtitulo: { fontSize: 16, marginBottom: 5 },
  picker: { height: 40, width: 200, marginBottom: 20 },
  botao: {
    backgroundColor: "#8AC926",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 15 },
  linkTexto: { color: "#6A4C93", textDecorationLine: "underline" },
});

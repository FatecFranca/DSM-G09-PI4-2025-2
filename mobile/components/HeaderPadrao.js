import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderPadrao({ titulo, onMenuPress }) {
  return (
    <View style={styles.header}>
      {/* Logo à esquerda */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Título central */}
      <Text style={styles.titulo}>{titulo}</Text>

      {/* Ícone de menu à direita */}
      <TouchableOpacity style={styles.menuBotao} onPress={onMenuPress}>
        <Ionicons name="menu-outline" size={30} color="#6A4C93" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 80,
    backgroundColor: "#8AC926",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    backgroundColor: "#FBFCF5",
    borderRadius: 10
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A4C93",
  },
  menuBotao: {
    padding: 5,
  },
});

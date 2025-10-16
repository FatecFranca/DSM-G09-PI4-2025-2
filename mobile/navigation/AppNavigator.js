import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import SalaAmbiente from "../screens/SalaAmbiente";
import Relatorios from "../screens/Relatorios";
import Gamificacao from "../screens/Gamificacao";
import Cadastro from "../screens/Cadastro";
import Configuracoes from "../screens/Configuracoes";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SalaAmbiente" component={SalaAmbiente} />
      <Stack.Screen name="Relatorios" component={Relatorios} />
      <Stack.Screen name="Gamificacao" component={Gamificacao} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Configuracoes" component={Configuracoes} />
    </Stack.Navigator>
  );
}

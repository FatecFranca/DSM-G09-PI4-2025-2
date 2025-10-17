# 📱 OuvIoT Mobile

Aplicativo mobile desenvolvido em **React Native com Expo**, parte integrante do projeto **OuvIoT**, voltado para o **monitoramento e gamificação de ambientes escolares** a partir de sensores de ruído (ESP32).

Esta versão mobile foca na **interação com alunos e professores**, apresentando telas de login, cadastro, gamificação e acompanhamento visual dos níveis de som.

---

## 🚀 Tecnologias Utilizadas

- ⚛️ **React Native (Expo)**
- 🧭 **React Navigation**
- 💾 **AsyncStorage** (armazenamento local)
- 🌐 **Axios** (requisições HTTP)
- 📊 **React Native Chart Kit** (gráficos)
- 🎞️ **Lottie** (animações)
- 🎨 **Expo Linear Gradient** (gradientes)
- 🖼️ **Expo Vector Icons** (ícones)
- 🎬 **Animated API** (animações leves de layout)

---

## ⚙️ Requisitos

Antes de rodar o projeto:

- Instale o **[Node.js](https://nodejs.org/)** (versão LTS recomendada)
- Instale o aplicativo **[Expo Go](https://expo.dev/client)** no seu celular (Android/iOS)

---

## 🧩 Instalação do Projeto

```bash
# Clonar o repositório
git clone <URL_DO_REPOSITORIO>
cd ouviot-mobile

# Instalar dependências
npm install
```

---

## 📦 Dependências Necessárias

Instale todas as dependências com os comandos abaixo:

```bash
# Expo CLI
npm install -g expo-cli

# React Navigation
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# Armazenamento local
npm install @react-native-async-storage/async-storage

# Requisições HTTP
npm install axios

# Animações e ícones
npm install lottie-react-native
npm install @expo/vector-icons

# Gráficos
npm install react-native-chart-kit react-native-svg

# Gradientes e utilitários do Expo
npx expo install expo-linear-gradient expo-constants expo-status-bar

# (Opcional: feedback tátil)
npx expo install expo-haptics
```

---

## 🗂️ Estrutura de Pastas

```
ouviot-mobile/
│
├── assets/
│   ├── images/
│   │   └── logo.png
│   └── lotties/
│       ├── feliz.json
│       ├── atento.json
│       └── triste.json
│
├── navigation/
│   └── AppNavigator.js
│
├── screens/
│   ├── Login.js
│   ├── Cadastro.js
│   ├── SalaAmbiente.js
│   ├── Gamificacao.js
│   ├── Relatorios.js
│   └── Configuracoes.js
│
├── services/
│   └── api.js
│
├── App.js
├── index.js
└── package.json
```

---

## ▶️ Executando o Projeto

```bash
# Iniciar o servidor Expo
npx expo start
```

📱 Em seguida:
- Abra o aplicativo **Expo Go** no celular;
- Escaneie o QR Code gerado no terminal ou navegador;
- O app **OuvIoT Mobile** será carregado automaticamente.

---

## 🧠 Observações Importantes

- Caso apareça a tela *“Welcome to Expo”*, apague a pasta `/app` e confirme que o arquivo principal é `App.js`.
- O arquivo `index.js` registra o componente raiz:

  ```js
  import { registerRootComponent } from 'expo';
  import App from './App';
  registerRootComponent(App);
  ```

- Confirme que o logo está em `assets/images/logo.png`.

---

## 🧪 Telas Incluídas

| Tela | Descrição |
|------|------------|
| **Login** | Campos de e-mail e senha, botões *Entrar* e *Cadastrar*, barras animadas na parte inferior. |
| **Cadastro** | Alterna entre cadastro de *Usuário* e *Sala/Turma*, com cabeçalho de projeto piloto, botão voltar e formulário dinâmico. |
| **Sala Ambiente** | Exibe nível de ruído em tempo real, botões de iniciar/parar captura e atalho para gamificação. |
| **Gamificação** | Mostra monstrinho animado que reage ao ruído, barra de XP e ranking de turmas. |
| **Relatórios** | Apresenta histórico de ruído com gráfico de linha. |
| **Configurações** | Permite limpar dados locais e exibe informações sobre o app. |

---

## 💚 Paleta de Cores OuvIoT

| Cor | Código | Significado |
|------|---------|-------------|
| 🟩 Verde | `#8AC926` | Silêncio / ambiente saudável |
| 🟨 Amarelo | `#FFCA3A` | Atenção / ruído intermediário |
| 🟥 Vermelho | `#FF595E` | Alerta / ruído alto |
| 🟪 Roxo | `#6A4C93` | Destaque / identidade visual |
| 🤍 Creme | `#FBFCF5` | Fundo claro e neutro |

---

## 🌐 Integração com Backend e Sensor ESP32

O **OuvIoT Mobile** está preparado para integração com backend (Node.js/Express) e sensores de ruído (ESP32), que enviarão os níveis de som via API REST.

### 🔹 Backend (Node.js / Express)

O backend será responsável por:
- Receber e armazenar dados dos sensores;
- Gerenciar usuários e turmas;
- Fornecer endpoints REST para o app.

#### Endpoints previstos:

| Método | Endpoint | Descrição |
|--------|-----------|-----------|
| `POST` | `/api/usuarios` | Cria um novo usuário |
| `POST` | `/api/turmas` | Cadastra turma |
| `GET` | `/api/sons/atual` | Retorna nível atual de ruído |
| `GET` | `/api/relatorios/:turma` | Histórico de ruído da turma |
| `GET` | `/api/ranking` | Ranking de turmas por desempenho |

#### Serviço API no App:

```js
// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://<IP_DO_SERVIDOR>:3000/api",
});

export default api;
```

Substitua `<IP_DO_SERVIDOR>` pelo IP local do backend.

---

### 🔹 Sensor (ESP32 com microfone I2S)

Fluxo previsto:
1. ESP32 coleta som ambiente;
2. Envia dados de ruído (dB) via Wi-Fi para o backend;
3. Backend grava e distribui via API;
4. OuvIoT Mobile exibe valores e gamificação em tempo real.

---

## 👩‍💻 Autora

**Monica Aímola Falqueto**  
📍 FATEC Franca – Curso **Desenvolvimento de Software Multiplataforma**  
📚 Projeto Interdisciplinar: *OuvIoT – Tecnologia para Ambientes Educacionais Saudáveis*

---

> 💬 *“Ambientes mais silenciosos, mentes mais atentas.”*  

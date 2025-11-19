DSM-G09-PI4-2025-2
Repositório do GRUPO 09 do Projeto Interdisciplinar do 4º semestre DSM 2025/2

# 🎧 OuvIoT – Monitoramento Inteligente de Ruído em Salas de Aula

O **OuvIoT** é um projeto desenvolvido para monitorar e analisar os níveis de ruído em ambientes escolares, promovendo salas de aula mais saudáveis, silenciosas e produtivas.  
Criado como parte do Projeto Interdisciplinar do curso **Desenvolvimento de Software Multiplataforma (FATEC Franca)**.

---

## Funcionalidades Principais

- 📊 **Dashboard Interativo:** exibe gráficos em tempo real simulando a variação sonora capturada por sensores IoT.  
- 🧠 **Monitoramento Inteligente:** acompanha os níveis de ruído por sala, turma e período.  
- 🕹️ **Gamificação:** estimula o silêncio com pontuação visual e divertida.  
- 👩‍🏫 **Relatórios:** fornece dados históricos para professores e gestores.  
- 🟢 **Interface Responsiva:** visual limpo e lúdico, com cores inspiradas na harmonia e tecnologia.

---

## Tecnologias Utilizadas

### 🌐 Frontend (Web)
- **React.js** – Criação do dashboard e componentes dinâmicos.  
- **Chart.js** – Exibição de gráficos e dados em tempo real.  
- **Bootstrap / CSS Modules** – Estilização responsiva e moderna.  
- **Axios** – Comunicação com a API.  

---

### 📱 Mobile
- **React Native (Expo)** – Desenvolvimento multiplataforma (Android/iOS).  
- **React Navigation** – Navegação entre telas.  
- **Axios / Fetch API** – Consumo da API para visualização de dados e controle remoto do dispositivo IoT.  
- **Recharts** – Exibição simplificada de gráficos no app.  

---

### ⚙️ Backend (API)
- **Node.js + Express.js** – Estrutura da API RESTful.  
- **MongoDB + Mongoose** – Armazenamento dos dados coletados.  
- **Swagger (OpenAPI)** – Documentação dos endpoints.  
- **CORS / dotenv / nodemon** – Configurações e ambiente de desenvolvimento.  
- **MQTT** para comunicação com o dispositivo IoT.

---

### 🤖 IoT (Dispositivo Físico)
- **ESP32** – Microcontrolador com Wi-Fi integrado.  
- **Sensor de Som digital (INMP441)** – Captura de intensidade sonora em dB. 
- **LEDs RGB** – Feedback visual de níveis de ruído (baixo, médio, alto).  
- **Arduino IDE** – Programação e upload do firmware.  

---

💡 *Integração total entre as camadas:*  
O sensor coleta → envia via Wi-Fi → backend processa → dashboard e app exibem dados em tempo real.  

---

## 🎨 Paleta do Projeto

- 🟣 **Roxo (#6A4C93)** → Inovação e tecnologia  
- 💚 **Verde (#8AC926)** → Sustentabilidade e bem-estar  
- 💛 **Amarelo (#FFCA3A)** → Atenção e foco  
- ❤️ **Vermelho (#FF595E)** → Intensidade sonora  
- 💙 **Azul (#1982C4)** → Equilíbrio e confiança  

---

🏫 Sobre o Projeto

Desenvolvido por **Mônica Aímola Falqueto**  
Orientação: Professores da FATEC Franca – Curso DSM (4º semestre)  
Auxílio complementar e dúvidas com ferramentas de IA.

---

💡 “O silêncio é o primeiro passo para ouvir melhor.”

https://www.youtube.com/watch?v=ld6W-Z2sG24

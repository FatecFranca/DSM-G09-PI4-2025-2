DSM-G09-PI4-2025-2
Repositório do GRUPO 09 do Projeto Interdisciplinar do 4º semestre DSM 2025/2

# 🎧 OuvIoT – Monitoramento Inteligente de Ruído em Salas de Aula

O **OuvIoT** é um projeto desenvolvido para capturar, monitorar e analisar os níveis de ruído em ambientes escolares, promovendo salas de aula mais saudáveis, silenciosas e produtivas.  
Criado como parte do Projeto Interdisciplinar do curso **Desenvolvimento de Software Multiplataforma (FATEC Franca)**.

---

# 📄Contextualização, Problemática e Objetivos Gerais   

O ambiente escolar é um espaço de convivência e aprendizagem, porém níveis elevados de ruído podem prejudicar significativamente a concentração, o desempenho e a saúde mental de alunos e professores. Esse problema é frequente em diferentes etapas da educação e afeta especialmente docentes, que sofrem com fadiga vocal e mental, e alunos neurodivergentes, mais sensíveis a estímulos sonoros.

Diante desse cenário, torna-se necessária uma solução tecnológica capaz de medir, visualizar e apoiar ações pedagógicas relacionadas ao controle do ruído.

O objetivo geral é desenvolver um sistema IoT capaz de monitorar e analisar o som em salas de aula, fornecendo gráficos, estatísticas e histórico para apoiar decisões pedagógicas e melhorar o bem-estar e o engajamento no ambiente escolar.

---

## Funcionalidades Principais

- 👩‍🏫 **Sala Ambiente Inteligente:** acompanha os níveis de ruído por sala e exibe o gráficos em tempo real mostrando a variação sonora capturada por sensores IoT.
- 📊**Relatórios/Dashboard:** fornece dados históricos e estatísticas para professores e gestores.  
- 🕹️ **Gamificação:** estimula o silêncio com pontuação visual e divertida.
- 🟢 **Interface Responsiva:** visual limpo e lúdico, com cores inspiradas na harmonia e tecnologia.

---

## Tecnologias Utilizadas

### 🌐 Frontend (Web)
- **React + Vite** – Criação do dashboard, páginas e componentes dinâmicos. Ferramenta de build e servidor de desenvolvimento rápido.
- **React Router DOM** – Navegação entre telas (Home, Dashboard, Live, Sobre, Login).  
- **Recharts** – Exibição de gráficos e dados em tempo real.  
- **Tailwind CSS + DaisyUI** – Estilização moderna baseada em utilitários. 
- **Fetch API** – Comunicação com a API.  

---

### 📱 Mobile
- **React Native (Expo)** – Desenvolvimento multiplataforma (Android/iOS).  
- **React Navigation** – Navegação entre telas.  
- **Axios** – Consumo da API para visualização de dados e controle remoto do dispositivo IoT.  
- **Charts** – Dependências para exibição de gráficos no app.  

---

### ⚙️ Backend (API)
- **Node.js + Express.js** – Estrutura da API RESTful.  
- **MongoDB + Mongoose** – Armazenamento e modelagem dos dados coletados pelo sensor.  
- **MongoDB Atlas** - Banco de dados em nuvem 
- **CORS / dotenv** – Configurações e ambiente de desenvolvimento.  
- **MQTT** - Comunicação em tempo real com o ESP32 para envio/recebimento de capturas.
- **bcryptjs** – Hashing de senha.
- **Swagger (OpenAPI)** – Documentação dos endpoints.  
   | Disponível em http://localhost:5000/api-docs ou http://20.80.105.137:5000/api-docs |

---

### 🤖 IoT (Dispositivo Físico)
- **ESP32** – Microcontrolador com Wi-Fi integrado.  
- **Sensor de Som Analógico (KY-038)** – Captura de intensidade sonora em dB. 
- **LEDs RGB** – Feedback visual de níveis de ruído (baixo, médio, alto).  
- **Arduino IDE** – Programação e upload do firmware.  

---

💡 *Integração total entre as camadas:*  
O sensor coleta → envia via Wi-Fi → backend processa → dashboard e app exibem dados em tempo real.  

---
## Instalaçao inicial do Projeto

Clonagem do Repositório

```
git clone https://github.com/FatecFranca/DSM-G09-PI4-2025-2.git
cd DSM-G09-PI4-2025-2 
```

Para instalação completa do projeto, cada subpasta(backend, front, mobile) contém seu próprio README com mais informações e instruções específicas.

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

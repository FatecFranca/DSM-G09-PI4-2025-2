# 🧠 OuvIoT – Backend  


Esta parte do repositório representa o **Backend (API REST)**, responsável por:
- Receber e armazenar dados de sensores enviados pelo ESP32 via MQTT
- Gerenciar usuários e autenticação simples;
- Expor rotas REST para o aplicativo mobile e painel web
- Persistir informações no MongoDB
- Fornecer endpoints para o painel web e aplicativo mobile.
- Controlar início e parada de captura
- Gerar alertas automáticos
- Organizar salas, usuários e histórico de ruído

---

## ⚙️ Tecnologias Utilizadas

| Tecnologia | Função |
|-------------|---------|
| **Node.js** | Ambiente de execução do servidor |
| **Express.js** | Criação das rotas da API |
| **MongoDB Atlas** | Banco de dados em nuvem |
| **Mongoose** | Modelagem dos dados e integração com MongoDB |
| **dotenv** | Variáveis de ambiente e segurança |
| **bcryptjs** | Criptografia de senhas |
| **CORS** | Comunicação entre frontends e backend |
| **MQTT.js** | Comunicação com ESP32 |
---

## 📡 Fluxo Arquitetural – OuvIoT
```
[Mobile] ——HTTP——> [Backend] ——MQTT——> [ESP32 + Sensor]
      <—HTTP——        <—MQTT———
         │                   │
      GET dados           Envia dB
      POST iniciar        Envia status
      POST parar
```
Resumo do fluxo:
1. Mobile chama POST /captura/iniciar
2. Backend publica MQTT: "ouviot/captura/comando" → "start"
3. ESP32 começa a captar som e envia:
```    
    topic: ouviot/captura/dados
    payload: { sala, db, status }
```
4. Backend recebe os dados → salva em SensorData
5. Se status = alert ou high → salva em Alerta
6. Mobile consulta o gráfico chamando:
```
    GET /sensores/ultimos/:sala
```
---

## 🧱 Estrutura de Pastas

```
backend/
 ├── server.js
 ├── mqtt/
 │    └── client.js
 ├── models/
 │    ├── Sala.js
 │    ├── Usuario.js
 │    ├── SensorData.js
 │    ├── Alerta.js
 ├── controllers/
 │    ├── salaController.js
 │    ├── usuarioController.js
 │    ├── authController.js
 │    ├── sensorController.js
 │    ├── alertaController.js
 ├── routes/
 │    ├── auth.js
 │    ├── salas.js
 │    ├── usuarios.js
 │    ├── sensores.js   ← **NOVA ROTA**
 │    ├── captura.js
 │    ├── alertas.js
 └── .env

```
---
# 📡 MQTT – Integração com ESP32

### Tópicos Assinados
- `ouviot/captura/dados` – ESP32 envia dados de ruído  
- `ouviot/captura/comando` – comandos start/stop  
- `ouviot/captura/sala` – sala ativa definida via app  

### Comandos enviados pelo Backend
- `"start"` → iniciar captura  
- `"stop"` → parar captura  
- `"nome-da-sala"` → associar leitura à sala correta  

---


### 🔧 1️⃣ Instalar dependências
No terminal, dentro da pasta `backend`:
```bash
npm install
```

### 🌿 2️⃣ Configurar variáveis de ambiente
Crie um arquivo chamado `.env` com:
```
MONGO_URI=mongodb+srv://usuario:senha@seucluster.mongodb.net/ouviot
PORT=5000
```

> ⚠️ O `.env` está protegido pelo `.gitignore` e **não deve ser versionado**.

### ▶️ 3️⃣ Executar o servidor
```bash
npm start
```

Se tudo estiver correto:
```
✅ Conectado ao MongoDB com sucesso!
🚀 Servidor rodando na porta 5000
```


---

## 📡 Endpoints Principais

## 👤 Usuários
| Método | Rota | Descrição |
|-------|------|-----------|
| POST | `/usuarios` | Criar usuário |
| GET | `/usuarios` | Listar usuários |
| DELETE | `/usuarios/:email` | Remover usuário |

## 🔐 Autenticação
| Método | Rota | Descrição |
|-------|------|-----------|
| POST | `/auth/login` | Login do usuário |

Exemplo de corpo:
```json
{
  "email": "mo@ouviot.com",
  "senha": "123456"
}
```
## 🏫 Salas
| Método | Rota | Descrição |
|-------|------|-----------|
| GET | `/salas` | Listar salas |
| POST | `/salas` | Criar nova sala |
| DELETE | `/salas/:nome` | Remover sala |

---

## 📊 Dados do Sensor – Para o gráfico
| Método | Rota | Descrição |
|-------|------|-----------|
| GET | `/sensores/ultimos/:sala` | Retorna os últimos 20 valores de dB da sala |

---

## 📡 Captura (Mobile → Backend → ESP32 via MQTT)
| Método | Rota | Descrição |
|-------|------|-----------|
| POST | `/captura/iniciar` | Inicia a captura de ruído |
| POST | `/captura/parar` | Para a captura |
| POST | `/captura/selecionar-sala` | Define a sala ativa |

---

## 🚨 Alertas
| Método | Rota | Descrição |
|-------|------|-----------|
| GET | `/alertas` | Lista alertas gerais |
| GET | `/alertas/sala/:sala` | Lista alertas da sala |

---

## 🔐 Autenticação Simples
O backend realiza login básico comparando o e-mail e senha criptografada via **bcrypt**.  
Após o login, o frontend/mobile pode armazenar os dados do usuário logado (`id`, `nome`, `tipo`) em:
- `localStorage` (versão Web)
- `AsyncStorage` (versão Mobile)

Exemplo de resposta:
```json
{
  "message": "Login realizado com sucesso!",
  "usuario": {
    "id": "6713f8c3...",
    "nome": "Mo Dev",
    "email": "mo@ouviot.com",
  }
}
```


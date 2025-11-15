# 🧠 OuvIoT – Backend  


Esta parte do repositório representa o **Backend (API REST)**, responsável por:
- Receber e armazenar dados de sensores sonoros (ESP32);
- Gerenciar usuários e autenticação simples;
- Fornecer endpoints para o painel web e aplicativo mobile.

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

---

## 🧱 Estrutura de Pastas

```
backend/
├── config/
│   └── db.js              → conexão com MongoDB
├── controllers/
│   ├── usuarioController.js → cadastro e listagem de usuários
│   ├── sensorController.js  → recebimento de dados dos sensores
│   ├── salaController.js    → gerenciamento das salas
│   ├── alertaController.js  → geração de alertas automáticos
│   └── authController.js    → autenticação simples (login)
├── models/
│   ├── Usuario.js
│   ├── SensorData.js
│   ├── Sala.js
│   └── Alerta.js
├── routes/
│   ├── usuarios.js
│   ├── sensores.js
│   ├── salas.js
│   ├── alertas.js
│   └── auth.js
├── .env                     → variáveis de ambiente (não versionado)
├── .gitignore               → protege .env e node_modules
├── package.json
└── server.js
```

---

## 🚀 Como Executar o Servidor

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

### 👤 **Usuários**
| Método | Endpoint | Descrição |
|--------|-----------|------------|
| `POST` | `/api/usuarios` | Cadastrar novo usuário |
| `GET` | `/api/usuarios` | Listar todos os usuários |
| `DELETE` | `/api/usuarios` | Deletar usuário |

### 🔐 **Login**
| Método | Endpoint | Descrição |
|--------|-----------|------------|
| `POST` | `/api/login` | Autenticar usuário (sem JWT) |

Exemplo de corpo:
```json
{
  "email": "mo@ouviot.com",
  "senha": "123456"
}
```

### 🎧 **Sensores**
| Método | Endpoint | Descrição |
|--------|-----------|------------|
| `POST` | `/api/sensores` | Receber dados de som (enviados pelo ESP32) |
| `GET` | `/api/sensores` | Listar últimas medições |

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


# 💻 OuvIoT — Frontend

Frontend do projeto **OuvIoT**, desenvolvido com **React + Vite**, estilizado com **TailwindCSS + DaisyUI**.

Esta interface Web fornece **painéis, relatórios e acompanhamento em tempo real** das capturas feitas pelo dispositivo IoT e pelo aplicativo mobile.

---

#  Tecnologias Utilizadas

| Camada | Tecnologia |
|-------|------------|
| **Framework** | React + Vite |
| **Estilização** | TailwindCSS 4 + DaisyUI |
| **Roteamento** | React Router |
| **Gráficos** | Recharts |
| **Comunicação com API** | Fetch API / Axios-like |

---

#  Estrutura do Projeto

```
front/
 ├── public/
 ├── src/
 │    ├── assets/
 │    ├── components/
 │    ├── pages/
 │    ├── services/
 │    ├── index.css
 │    ├── main.jsx
 │    └── App.jsx
 ├── package.json
 ├── vite.config.js
 ├── tailwind.config.js
 └── postcss.config.js
```

---

#  Como Rodar Localmente

```bash
cd front
npm install
npm run dev
```

Acesse:  
👉 http://localhost:5173/

---

# 📊 Painel Sonoro (Dashboard)

## 🔶 1. Indicadores principais
- **Nível Médio**
- **Pico Máximo**
- **Tempo Crítico (> 60 dB)**
- **Índice de Silêncio (≤ 55 dB)**
- **Desvio Padrão (%)**

## 🔶 2. Gráfico de Linha — Últimas 20 capturas  
Faixa: 45 dB → 75 dB.

## 🔶 3. Gráfico de Pizza — Distribuição  
- Ideal (≤ 55 dB)  
- Atenção (56–60 dB)  
- Crítico (> 60 dB)  

Valores em **%**.

## 🔶 4. Gráfico de Barras — Variação Diária  
Seg–Sex: min / média / max.

---

# 📡 Sala Ambiente Live  
Monitoramento em tempo real usando:

```
GET /captura/status
```

---



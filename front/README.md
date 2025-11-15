# 💻 OuvIoT — Frontend

Frontend do projeto **OuvIoT**, desenvolvido com **React + Vite**, estilizado com **TailwindCSS + DaisyUI**, e publicado automaticamente por **GitHub Actions** na plataforma **Netlify**.

---

#  Tecnologias Utilizadas

| Camada | Tecnologia |
|-------|------------|
| **Framework** | React + Vite |
| **Estilização** | TailwindCSS 4 + DaisyUI |
| **Roteamento** | React Router |
| **CI/CD** | GitHub Actions |
| **Hospedagem** | Netlify |
| **Gerenciamento de Dependências** | NPM |

---

#  Estrutura do Projeto

```
front/
 ├── public/              # Arquivos públicos
 ├── src/
 │    ├── assets/         # Imagens e ícones
 │    ├── components/     # Componentes reutilizáveis
 │    ├── pages/          # Páginas (Home, Sobre, Dashboard, etc.)
 │    ├── index.css       # Estilos globais
 │    ├── main.jsx        # Entrada da aplicação
 │    └── App.jsx         # Sistema de rotas
 ├── package.json
 ├── vite.config.js
 ├── tailwind.config.js
 └── postcss.config.js
```

---

#  Como Rodar Localmente

1️⃣ **Entre na pasta do projeto**
```bash
cd front
```

2️⃣ **Instale as dependências**
```bash
npm install
```

3️⃣ **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4️⃣ Abra no navegador:
 http://localhost:5173

---

# 🌐 Deploy Automático com Netlify + GitHub Actions

Este projeto possui CI/CD completo:

### ✔️ Todo push na branch `main` dispara:
1. Instala dependências  
2. Roda `npm run build`  
3. Gera o diretório `front/dist`  
4. Envia automaticamente para o Netlify  

###  Arquivo responsável: `.github/workflows/deploy-netlify.yml`

```yaml
name: Deploy to Netlify

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Install Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Netlify CLI
        run: npm install -g netlify-cli

      - name: Install dependencies
        working-directory: ./front
        run: npm install

      - name: Build project
        working-directory: ./front
        run: npm run build

      - name: Deploy to Netlify
        run: netlify deploy --prod --dir=front/dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

---

# ☁️ Hospedagem no Netlify

O site está publicado em:

 **https://ouviot.netlify.app**

### Configurações utilizadas:

| Campo | Valor |
|-------|------------|
| **Base directory** | `front` |
| **Build command** | `npm run build` |
| **Publish directory** | `front/dist` |
| **Node version** | 20.x |
| **Functions directory** | *(vazio)* |

---

# 🔐 Secrets do GitHub Necessários

Crie em:  
**GitHub → Settings → Secrets → Actions**

| Nome | Valor |
|------|-------|
| `NETLIFY_AUTH_TOKEN` | Token criado em <br> https://app.netlify.com/user/applications |
| `NETLIFY_SITE_ID` | Disponível em <br> Netlify → Site Settings → Site Information |




## 💻 Tecnologias Utilizadas

| Camada | Tecnologia |
|:-------|:------------|
| **Frontend** | React + Vite |
| **Estilização** | Tailwind CSS + DaisyUI (tema personalizado “OuvIoT”) |
| **Visualização** | Gráficos animados em CSS e React |
| **Organização** | React Router, componentes reutilizáveis e estrutura modular |

---

## 🚀 Como Executar o Projeto

1️⃣ Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/ouviot.git
cd ouviot

2️⃣ Instalar as dependências necessárias
Este projeto utiliza o TailwindCSS v4 com PostCSS e DaisyUI, portanto todas as dependências devem ser instaladas manualmente:

bash
Copiar código
npm install react react-dom react-router-dom
npm install -D vite tailwindcss postcss autoprefixer @tailwindcss/postcss daisyui

3️⃣ Inicializar o Tailwind (se necessário)
bash
Copiar código
npx tailwindcss init -p

4️⃣ Executar o servidor de desenvolvimento
bash
Copiar código
npm run dev
O projeto rodará em:
👉 http://localhost:5173


🧩 Estrutura de Pastas
src/
 ├── assets/           # Imagens e ícones
 ├── pages/            # Páginas principais (Home, Sobre, Dashboard, Login)
 ├── components/       # Navbar, Footer, etc.
 ├── index.css         # Estilos globais + Tailwind/DaisyUI
 ├── main.jsx          # Ponto de entrada da aplicação
 └── App.jsx           # Rotas e estrutura geral

*****


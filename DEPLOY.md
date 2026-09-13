# 🏢 Imóveis Aracaju - Corretora de Imóveis

Corretora de Imóveis Profissional em Aracaju, Sergipe - SE

## 🚀 Deploy Rápido

### Opção 1: Netlify (Gratuito)
1. Acesse [app.netlify.com](https://app.netlify.com)
2. Faça login com GitHub
3. Clique em "Add new site" > "Import existing project"
4. Selecione esta pasta
5. Configure o comando de build: `npm install`
6. Configure o diretório de publicação: `.`
7. Clique em "Deploy site"

### Opção 2: GitHub Pages (Gratuito)
1. Crie um repositório no GitHub chamado `imoveis-aracaju`
2. Push o código para a branch `main`
3. Vá em Settings > Pages
4. Selecione Source: `Deploy from a branch`
5. Branch: `main`, Folder: `/ (root)`
6. Salve

### Opção 3: Vercel (Gratuito)
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu GitHub
3. Importe o projeto
4. Deploy automático

### Opção 4: Servidor Local
```bash
npm install -g serve
serve -s . -l 3000
# Acesse: http://localhost:3000
```

## 📁 Estrutura do Projeto
```
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos
├── js/
│   └── app.js          # Funcionalidades
├── package.json        # Dependências
├── netalify.toml       # Configuração Netlify
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions
└── README.md           # Este arquivo
```

## ✨ Funcionalidades
- 🏠 Catálogo de imóveis com filtros
- 📊 Análise de mercado e projeção de valorização
- 📅 Agendamento de visitas
- 📱 Design responsivo e moderno
- 📍 Focado em Aracaju, SE

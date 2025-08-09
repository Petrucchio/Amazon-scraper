# 🔍 Amazon Product Scraper

Um projeto educacional que demonstra técnicas de web scraping para extrair informações de produtos da Amazon usando **Bun**, **Express**, **JSDOM** e **Vite**.

## ⚠️ **Aviso Legal**

Este projeto é apenas para fins **educacionais e de demonstração**. O web scraping pode violar os termos de serviço de alguns sites. Sempre:

- ✅ Respeite os termos de uso dos sites
- ✅ Implemente delays apropriados entre requisições
- ✅ Use com moderação e responsabilidade
- ❌ Não sobrecarregue os servidores
- ❌ Não use para fins comerciais sem permissão

## 🚀 **Funcionalidades**

- **Backend**: API RESTful com Bun e Express
- **Frontend**: Interface moderna e responsiva
- **Scraping**: Extração de título, avaliação, reviews e imagens
- **Tratamento de Erros**: Handling robusto de erros e timeouts
- **Design Responsivo**: Funciona em desktop e mobile

## 📋 **Pré-requisitos**

Certifique-se de ter instalado:

- **Bun** (versão 1.0+) - [Instalar Bun](https://bun.sh/)
- **Node.js** (versão 18+) para o frontend
- **Git** para clonar o repositório

## 🛠️ **Instalação e Configuração**

### 1. **Clone o Repositório**

```bash
git clone <url-do-repositorio>
cd amazon-scraper
```

### 2. **Configure o Backend**

```bash
# Instale as dependências com Bun
bun install

# Inicie o servidor de desenvolvimento
bun dev
```

O servidor estará rodando em: `http://localhost:3000`

**Endpoints disponíveis:**
- `GET /api/status` - Status da API
- `GET /api/scrape?keyword=smartphone` - Scraping de produtos

### 3. **Configure o Frontend**

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 📁 **Estrutura do Projeto**

```
amazon-scraper/
├── server.js              # Servidor principal (Bun + Express)
├── package.json           # Dependências do backend
├── frontend/              # Código do frontend
│   ├── index.html        # HTML principal
│   ├── style.css         # Estilos CSS
│   ├── script.js         # JavaScript do frontend
│   └── package.json      # Dependências do frontend
└── README.md             # Este arquivo
```

## 🎯 **Como Usar**

1. **Inicie o Backend**: `bun dev` na pasta raiz
2. **Inicie o Frontend**: `npm run dev` na pasta `frontend/`
3. **Acesse**: `http://localhost:5173` no navegador
4. **Digite**: uma palavra-chave (ex: "smartphone")
5. **Clique**: em "Buscar Produtos"
6. **Aguarde**: os resultados aparecerem

## 🔧 **Scripts Disponíveis**

### Backend (Bun)
```bash
bun start          # Produção
bun dev            # Desenvolvimento com watch
bun install        # Instalar dependências
```

### Frontend (Vite)
```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
```

## 📊 **Dados Extraídos**

Para cada produto encontrado, o sistema extrai:

- 🏷️ **Título** do produto
- ⭐ **Avaliação** (estrelas de 1-5)
- 💬 **Número de reviews/avaliações**
- 🖼️ **URL da imagem** do produto

## 🛡️ **Tratamento de Erros**

O sistema possui tratamento para:

- ❌ Timeout de requisições (10 segundos)
- 🚫 Bloqueio por parte da Amazon (403)
- 🌐 Erros de conexão
- 📄 Páginas não encontradas (404)
- 🔧 Erros de parsing HTML

## 🎨 **Características Técnicas**

### Backend
- **Runtime**: Bun (performance otimizada)
- **Framework**: Express.js
- **Scraping**: Axios + JSDOM
- **CORS**: Habilitado para desenvolvimento

### Frontend
- **Build Tool**: Vite
- **Estilo**: CSS puro com design moderno
- **JavaScript**: Vanilla JS com ES6+
- **Responsivo**: Design mobile-first

## 🚨 **Limitações Conhecidas**

- Amazon possui proteções anti-scraping robustas
- Seletores podem mudar frequentemente
- Rate limiting pode bloquear muitas requisições
- Alguns produtos podem não ser extraídos corretamente

## 🔄 **Melhorias Futuras**

- [ ] Sistema de cache para evitar requests repetidos
- [ ] Proxy rotation para evitar bloqueios
- [ ] Suporte a mais marketplaces
- [ ] Exportação de dados (CSV/JSON)
- [ ] Histórico de buscas
- [ ] Comparação de preços

## 🐛 **Troubleshooting**

### "Erro de conexão"
- Verifique se o backend está rodando na porta 3000
- Confirme que não há conflitos de porta

### "Acesso bloqueado"
- Amazon detectou scraping - aguarde alguns minutos
- Consider usar diferentes user-agents

### "Nenhum produto encontrado"
- Verifique a palavra-chave usada
- Amazon pode ter mudado a estrutura HTML

## 📞 **Suporte**

Se encontrar problemas:

1. Verifique se todas as dependências estão instaladas
2. Confirme que ambos os servidores estão rodando
3. Verifique o console do navegador para erros
4. Teste primeiro com o endpoint `/api/status`

## 📝 **Licença**

Este projeto é fornecido sob a licença MIT para fins educacionais.

---

**⚠️ Lembre-se: Use com responsabilidade e respeite sempre os termos de uso dos sites!**
# 🌿 StoryLeaf

> *"No StoryLeaf, cada palavra é uma semente. Cada história, uma árvore. E cada leitor, um jardineiro da imaginação."*

![StoryLeaf Logo](https://raw.githubusercontent.com/GabrielJaccoud/StoryLeaf/master/assets/logo.png)

## 📖 Sobre o Projeto

StoryLeaf é uma plataforma revolucionária que transforma a forma como criamos, lemos e aprendemos com histórias, utilizando a metáfora da árvore onde histórias crescem como folhas. É mais do que um aplicativo de leitura - é um ecossistema criativo que une edição inteligente de textos com experiência interativa imersiva.

### 🌳 Conceito da Árvore

- **🌱 Raiz**: Ideia original e inspiração
- **🌲 Tronco**: Enredo principal
- **🌿 Galhos**: Ramificações narrativas e escolhas
- **🍃 Folhas**: Capítulos, momentos e emoções
- **🌲 Floresta**: Biblioteca e comunidade

## ✨ Funcionalidades Principais

### 1. 🖋️ StoryLeaf WRITE - O Jardim de Ideias
- **Semente de História**: IA sugere enredos baseados em tema, emoção e público
- **Mapas de Personagens Interativos**: Árvores genealógicas com personalidades via IA
- **Modo Crescimento Automático**: Desenvolvimento narrativo adaptativo
- **Colaboração em Tempo Real**: Escrita coletiva com mapas compartilhados

### 2. 📚 StoryLeaf READ - A Floresta de Histórias
- **Biblioteca Visual**: Livros como árvores, capítulos como folhas
- **Chuva de Ideias**: Recomendações dinâmicas pós-leitura
- **Narrativa Interativa**: Escolhas que alteram estados emocionais
- **Leitura Sensorial**: Integração IoT com vibrações e luzes ambiente
- **Narradores Virtuais**: RA/RV com personagens 3D

### 3. 🎓 StoryLeaf LEARN - Folhas de Aprendizado
- **Árvore de Conhecimento**: Disciplinas estruturadas como árvores
- **Gamificação**: Níveis de crescimento e conquistas educacionais
- **Integração LMS**: Compatível com Google Classroom, Moodle
- **Conteúdo Adaptativo**: IA identifica dificuldades e sugere ajuda
- **Conversas com Professor**: IA simulando tutor humano

### 4. 🔄 StoryLeaf CONVERT - Transformando Livros em Experiências Vividas
- **Importação Universal**: PDF, EPUB, MOBI, DOCX, TXT, etc.
- **Detecção Estrutural**: IA identifica capítulos, personagens, diálogos
- **Templates Criativos**: Temas para diferentes gêneros
- **Personalização Visual**: Interface intuitiva para adicionar multimídia
- **Gamificação Embutida**: Quizzes e desafios automaticamente posicionados

## 🎨 Design e Identidade Visual

### Paleta de Cores
- **Verde Folha**: `#4CAF50` (vida, crescimento)
- **Marrom Terra**: `#795548` (raízes, fundamento)
- **Dourado Solar**: `#FFC107` (clareza, inspiração)
- **Preto Profundo**: `#212121` (contraste, elegância)
- **Branco Puro**: `#FFFFFF` (pureza, clareza)

### Tipografia
- **Fonte Principal**: Inter ou Lato - moderna, legível, com leve toque orgânico
- **Fonte de Destaque**: Playfair Display - para títulos e citações, com elegância literária

## 🛠️ Tecnologias

### Frontend
- **Framework**: Next.js com React
- **Estilização**: TailwindCSS
- **3D/RA**: Three.js
- **Áudio**: Web Audio API
- **Narração**: Web Speech API

### Backend
- **Framework**: Flask (Python)
- **Banco de Dados**: MongoDB + Redis
- **Tempo Real**: WebSocket
- **Containerização**: Docker

### IA e Processamento
- **IA Generativa**: OpenAI GPT-4, Anthropic Claude
- **PLN**: spaCy, NLTK
- **Computer Vision**: OCR e análise de imagens

### Infraestrutura
- **Nuvem**: AWS/GCP/Azure
- **CDN**: Para entrega de conteúdo multimídia
- **Filas**: Processamento assíncrono
- **Monitoramento**: Logging completo

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- Python 3.11+
- Git

### Configuração do Ambiente

1. **Clone o repositório**
```bash
git clone https://github.com/GabrielJaccoud/StoryLeaf.git
cd StoryLeaf
```

2. **Configure o Frontend**
```bash
cd frontend
npm install
npm run dev
```

3. **Configure o Backend**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# OpenAI API
OPENAI_API_KEY=sua_chave_aqui
OPENAI_API_BASE=https://api.openai.com/v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/storyleaf

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=sua_chave_secreta_aqui
```

## 📋 Roadmap de Desenvolvimento

### 🎯 Fase 1 - MVP (4 semanas)
- [x] Configuração inicial do projeto
- [x] Estrutura básica frontend/backend
- [ ] StoryLeaf WRITE básico com IA de escrita
- [ ] Sistema de autenticação
- [ ] Interface inicial com metáfora da árvore

### 🎯 Fase 2 - Funcionalidades Principais (8 semanas)
- [ ] StoryLeaf READ e LEARN
- [ ] Conversão de formatos
- [ ] Gamificação básica
- [ ] Sistema de colaboração

### 🎯 Fase 3 - Recursos Avançados (6 semanas)
- [ ] RA/RV
- [ ] Integração com IoT
- [ ] Marketplace funcional
- [ ] Blockchain para direitos autorais

### 🎯 Fase 4 - Otimização e Publicação (2 semanas)
- [ ] Performance e segurança
- [ ] Publicação online
- [ ] Documentação final

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🌟 Modelo de Negócios

### Planos de Assinatura
- **Free**: Correção básica, leitura simples, recomendações básicas
- **Pro**: Tradução premium, IA avançada, RA, análise de tom
- **Team**: Colaboração em tempo real, gestão de projetos, API
- **Enterprise**: Integração com LMS, CRM, ERP, blockchain

### Marketplace
- Compra, venda e aluguel de obras digitais
- Filtro por tipo de experiência (Interativa, Sensorial, Gamificada)
- Avaliações de imersão e experiência visual
- Proteção de direitos autorais com blockchain

## 📞 Contato

- **Projeto**: [StoryLeaf](https://github.com/GabrielJaccoud/StoryLeaf)
- **Documentação**: [Wiki do Projeto](https://github.com/GabrielJaccoud/StoryLeaf/wiki)
- **Issues**: [Reportar Problemas](https://github.com/GabrielJaccoud/StoryLeaf/issues)

---

<div align="center">
  <p><strong>StoryLeaf - Onde histórias crescem e florescem</strong></p>
  <p>Feito com 💚 para transformar a experiência de leitura e escrita</p>
</div>


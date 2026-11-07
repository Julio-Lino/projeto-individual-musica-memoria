Projeto_individual_pesquisa_memoria_musica
=======================================

Este repositório contém o projeto "Pesquisa: Memória e Música". A estrutura e parte das escolhas iniciais de visualização de dados foram inspiradas no projeto web-data-viz, que serviu como base para a organização e as decisões de layout/arquitetura.

Visão geral
- Aplicação web para coleta e visualização de dados de pesquisa sobre memória e música.
- Backend em Node.js (estrutura inicial) e frontend estático em /public.

Estrutura de pastas
- README.md                  # este arquivo
- LICENSE                    # licença MIT (mantida do projeto original)
- .gitignore
- .env.example               # variáveis de ambiente (exemplo)
- app.js                     # servidor Express mínimo
- package.json
- docs/                      # documentação, diagramas e slides
- public/                    # Home, login, cadastro e dashboard
  - css/
  - js/
  - assets/
- src/                       # código-fonte do servidor
  - routes/
  - controllers/
  - models/
  - database/
    - script-tabelas.sql

Como começar
1. Copie .env.example para .env e ajuste as variáveis.
2. Instale dependências: `npm install`.
3. Execute em desenvolvimento: `npm run dev` (ou `npm start`).

Licença
Este projeto é distribuído sob a licença MIT — manter a mesma licença do projeto original.

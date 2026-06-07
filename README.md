# SI Chamados - Front-end

Projeto front-end para controle interno de chamados entre áreas.

## Tecnologias usadas
- HTML
- CSS
- JavaScript
- Docker

## O que o projeto possui
- Painel com indicadores
- Listagem de chamados
- Filtros por texto, status, área responsável e prioridade
- Cadastro visual de novo chamado
- Tela de detalhes do chamado
- Alteração visual de status
- Persistência no navegador usando localStorage
- Tema claro/escuro

## Organização
- `index.html` usa `css/index.css` e `js/index.js`
- `chamado.html` usa `css/chamado.css` e `js/chamado.js`
- `atribuidos.html` usa `css/atribuidos.css` e `js/atribuidos.js`
- `meus-chamados.html` usa `css/meus-chamados.css` e `js/meus-chamados.js`
- `usuarios.html` usa `css/usuarios.css` e `js/usuarios.js`
- `indicadores.html` usa `css/indicadores.css` e `js/indicadores.js`
- `relatorios.html` usa `css/relatorios.css` e `js/relatorios.js`
- `configuracoes.html` usa `css/configuracoes.css` e `js/configuracoes.js`
- `css/base.css` guarda estilos compartilhados
- `js/app.js` carrega os scripts compartilhados usados por todas as telas
- `js/data.js` guarda dados e funções compartilhadas
- `js/sidebar.js` guarda a sidebar e o perfil do usuário

## Como executar com Docker
```bash
docker compose up --build
```

Depois acesse:

```text
http://localhost
```

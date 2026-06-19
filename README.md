# SI Chamados

Sistema de chamados em PHP 8.2, Apache e MySQL 8, preparado para execução com Docker Compose.

## Estrutura

```text
api/          Endpoints JSON consumidos pelo JavaScript
database/     Conexão PDO e executor de migrations
docker/       Virtual host do Apache e entrypoint do container PHP
migrations/   Scripts SQL executados em ordem
public/       Páginas PHP, CSS e JavaScript públicos
```

O Apache usa `public/` como `DocumentRoot`. A pasta `api/` é publicada somente pelo alias `/api`; `database/` e `migrations/` não são acessíveis pelo navegador.

## Executar

```bash
docker compose up -d --build
```

A aplicação ficará disponível em:

```text
http://localhost:8081
```

As portas padrão são configuráveis. Copie `.env.example` para `.env` e altere `APP_PORT` ou `MYSQL_PORT` se necessário.

No PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

## Banco no DBeaver

Com os valores padrão:

```text
Host: localhost
Porta: 3308
Database: si_chamados
Usuário: si_chamados
Senha: si_chamados
```

## Migrations

Ao iniciar, o container PHP aguarda o MySQL ficar saudável e executa automaticamente:

```bash
php database/migrate.php
```

Cada arquivo `.sql` de `migrations/` é executado uma única vez e registrado na tabela `migrations`.

Para executar manualmente:

```bash
docker compose exec php php database/migrate.php
```

Para criar uma migration, adicione um arquivo com numeração crescente, por exemplo:

```text
migrations/002_adicionar_sla.sql
```

## Comandos úteis

```bash
docker compose ps
docker compose logs -f php
docker compose down
```

Para apagar também todos os dados locais do MySQL e recriar o banco do zero:

```bash
docker compose down -v
docker compose up -d --build
```

## Endpoints

```text
GET  /api/health.php
GET  /api/usuarios.php
POST /api/usuarios.php
GET  /api/chamados.php
GET  /api/chamados.php?id=1
POST /api/chamados.php
PUT  /api/chamados.php?id=1
GET  /api/configuracoes.php
POST /api/configuracoes.php
```

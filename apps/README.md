# 🏆 UniRV Sports — Platform API

API REST desenvolvida em NestJS para gerenciamento de campeonatos, atléticas, modalidades esportivas e engajamento acadêmico da UniRV.

---

## Conceitos Fundamentais da Aplicação

### Variáveis de Ambiente (`.env`)
O arquivo `.env` armazena configurações sensíveis e específicas do ambiente de execução (como credenciais de banco de dados e portas do servidor) fora do controle de versão. Ele garante que senhas e strings de conexão não sejam expostas no repositório do Git.

### Migrations (Prisma ORM)
As **Migrations** são versionadores da estrutura do seu banco de dados. Cada alteração feita no arquivo `schema.prisma` (criação de tabelas, alteração de campos ou inclusão de restrições como `@unique`) gera um script SQL versionado na pasta `prisma/migrations`. 
* **Para que servem:** Garantem que todos os desenvolvedores da equipe e o servidor de produção tenham exatamente a mesma estrutura de tabelas, colunas e relacionamentos no MySQL.

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/) (v18 ou superior)
* [MySQL](https://www.mysql.com/) 8 (ou MariaDB) rodando localmente
* [Git](https://git-scm.com/)

---

## Passo a Passo para Execução

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd unirv-sports
```

### 2. Primeira vez (instala tudo e prepara o banco)

```bash
cd apps
cp api/.env.example api/.env   # ajuste DATABASE_URL e JWT_SECRET
npm run setup                  # instala dependências, aplica migrations, gera o client e roda o seed
```

### 3. Dia a dia

```bash
cd apps
npm run dev    # aplica migrations pendentes, gera o Prisma Client e sobe API (3001) + Web (3000) juntos
```

`Ctrl+C` encerra os dois. Se um deles cair, o outro também é encerrado.

### Scripts disponíveis (rodar dentro de `apps/`)

| Script | O que faz |
|---|---|
| `npm run dev` | Sobe API + Web no mesmo terminal (antes aplica migrations e gera o client) |
| `npm run setup` | Instalação completa + banco pronto com dados de teste |
| `npm run db:migrate` | `prisma migrate dev`: cria uma migration nova depois de alterar o `schema.prisma` |
| `npm run db:deploy` | `prisma migrate deploy`: aplica migrations pendentes (seguro, não apaga dados) |
| `npm run db:generate` | `prisma generate`: regenera o Prisma Client |
| `npm run db:status` | Mostra se há migrations pendentes |
| `npm run db:seed` | Popula o banco (zera placares e lances das partidas de teste) |
| `npm run db:studio` | Abre o Prisma Studio para ver e editar dados no navegador |
| `npm run db:reset` | ⚠️ **Apaga o banco inteiro**, reaplica as migrations e roda o seed |
| `npm run build` | Build de produção da API e do Web |
| `npm run test` | Testes da API |

Se a API não estiver em `http://localhost:3001`, defina `NEXT_PUBLIC_API_URL` em `apps/web/.env.local`.

---

## Usuários de Teste (criados pelo seed)

Senha de todos: `Unirv@2026`

| Perfil | E-mail | Atlética |
|---|---|---|
| ADMIN | admin@unirvsports.dev | — |
| REPRESENTATIVE | diretor.famerv@unirvsports.dev | FAMERV |
| ATHLETE | atleta.famerv@unirvsports.dev | FAMERV |
| ATHLETE | atleta2.famerv@unirvsports.dev | FAMERV |
| REPRESENTATIVE | diretor.grifo@unirvsports.dev | GRIFO |
| ATHLETE | atleta.grifo@unirvsports.dev | GRIFO |
| TABLE_OFFICIAL | mesario@unirvsports.dev | — |
| VISITOR (torcedor) | torcedor@unirvsports.dev | — |

**Mesa de controle (Oficial de Mesa):** entre como `mesario` → *Minhas Partidas* → *Abrir Mesa*. Inicie a partida, lance pontos, faltas e cartões e pause/retome o cronômetro. Com a home aberta em outra aba, o *Feed ao Vivo* atualiza na hora. Em vôlei e beach tennis, use *Fechar Set* ao fim de cada set. O seed já deixa CERBERUS x KROMUS em andamento, e rodar `npm run seed` de novo zera placares, lances e cronômetros.

**Fluxo de inscrição:** entre como `atleta2.famerv` → aba *Modalidades* → solicite inscrição (ou reenvie a recusada). Depois entre como `diretor.famerv` → *Aprovações Pendentes* → aprove. O `diretor.grifo` não enxerga nem consegue aprovar pedidos da FAMERV.

## Permissões da API

| Rota | Acesso |
|---|---|
| `GET /sports`, `/athletics`, `/matches`, `/tournaments`, `/olympic-ranking` | Público |
| `POST /users` (cadastro) | Público (não permite criar ADMIN) |
| `POST /registrations`, `GET /registrations/my-requests` | ATHLETE |
| `GET /registrations/pending`, `GET /registrations/athletics`, `PATCH /registrations/:id/status` | REPRESENTATIVE (só da própria atlética) |
| `GET /matches/live/stream` (placar ao vivo via Server-Sent Events) | Público |
| `GET /matches/officiating`, `POST /matches/:id/clock`, `/score`, `/events`, `/sets/close` | TABLE_OFFICIAL (só nas partidas em que está escalado) |
| Demais escritas e `GET /users` | ADMIN (tem acesso a tudo) |

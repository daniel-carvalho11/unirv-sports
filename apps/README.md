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

### 2. Backend (API NestJS)

```bash
cd apps/api
npm install
cp .env.example .env        # ajuste DATABASE_URL e JWT_SECRET
npx prisma migrate deploy   # cria as tabelas
npm run seed                # atléticas, modalidades, usuários de teste e partidas
npm run start:dev           # http://localhost:3001
```

### 3. Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev                 # http://localhost:3000
```

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

**Fluxo de demonstração:** entre como `atleta2.famerv` → aba *Modalidades* → solicite inscrição (ou reenvie a recusada). Depois entre como `diretor.famerv` → *Aprovações Pendentes* → aprove. O `diretor.grifo` não enxerga nem consegue aprovar pedidos da FAMERV.

## Permissões da API

| Rota | Acesso |
|---|---|
| `GET /sports`, `/athletics`, `/matches`, `/tournaments`, `/olympic-ranking` | Público |
| `POST /users` (cadastro) | Público (não permite criar ADMIN) |
| `POST /registrations`, `GET /registrations/my-requests` | ATHLETE |
| `GET /registrations/pending`, `GET /registrations/athletics`, `PATCH /registrations/:id/status` | REPRESENTATIVE (só da própria atlética) |
| `PATCH /matches/:id`, `POST/PATCH/DELETE /match-events` | TABLE_OFFICIAL |
| Demais escritas e `GET /users` | ADMIN (tem acesso a tudo) |

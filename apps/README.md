# 🏆 UniRV Sports — Platform API

API REST desenvolvida em NestJS para gerenciamento de campeonatos, atléticas, modalidades esportivas e engajamento acadêmico da UniRV.

---

## Conceitos Fundamentais da Aplicação

### Variáveis de Ambiente (`.env`)
O arquivo `.env` armazena configurações sensíveis e específicas do ambiente de execução (como credenciais de banco de dados e portas do servidor) fora do controle de versão. Ele garante que senhas e strings de conexão não sejam expostas no repositório do Git.

### Migrations (Prisma ORM)
As **Migrations** são versionadores da estrutura do seu banco de dados. Cada alteração feita no arquivo `schema.prisma` (criação de tabelas, alteração de campos ou inclusão de restrições como `@unique`) gera um script SQL versionado na pasta `prisma/migrations`. 
* **Para que servem:** Garantem que todos os desenvolvedores da equipe e o servidor de produção tenham exatamente a mesma estrutura de tabelas, colunas e relacionamentos no PostgreSQL.

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/) (v18 ou superior)
* [Docker](https://www.docker.com/) e Docker Compose (para o container do PostgreSQL)
* [Git](https://git-scm.com/)

---

## Passo a Passo para Execução

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd unirv-sports
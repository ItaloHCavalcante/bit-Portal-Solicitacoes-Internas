# Portal de Solicitações Internas

Sistema desenvolvido para o gerenciamento de solicitações internas, permitindo que colaboradores registrem demandas, acompanhem seu andamento e consultem informações relacionadas às solicitações.

O projeto foi desenvolvido como uma aplicação **Full Stack**, utilizando uma arquitetura baseada em microsserviços, com frontend em React, backend em Spring Boot e persistência de dados em PostgreSQL.

---

## Tecnologias Utilizadas

### Frontend

* **React**
* **Axios**
* **Vite**
* **JavaScript**

### Backend

* **Java 21**
* **Spring Boot**
* **Spring Security**
* **JWT**
* **Spring Data JPA**
* **Hibernate**

### Banco de Dados

* **PostgreSQL 15**

### Infraestrutura

* **Docker**
* **Docker Compose**

### Controle de versão

* **Git**
* **GitHub**

---

## Arquitetura do Projeto

O sistema é dividido em serviços independentes, seguindo uma abordagem de microsserviços.

```text
bit-Portal-Solicitacoes-Internas/
│
├── backend/
│   ├── auth-service/
│   └── solicitacao-service/
│
├── frontend/
│
├── docs/
│   ├── memorial-tecnico.md
│   └── dicionario-de-dados.md
│
├── init.sql
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

### Serviços

#### auth-service

Responsável pelas funcionalidades relacionadas à autenticação e gerenciamento de usuários:

* Cadastro de usuários;
* Login;
* Geração de tokens JWT;
* Validação de autenticação;
* Controle de acesso aos recursos protegidos.

#### solicitacao-service

Responsável pelo gerenciamento das solicitações internas:

* Criação de solicitações;
* Listagem;
* Consulta de detalhes;
* Edição;
* Exclusão;
* Alteração de status;
* Pesquisa e filtros;
* Métricas das solicitações.

#### frontend

Interface web responsável pela interação com o usuário e pelo consumo das APIs disponibilizadas pelos microsserviços.

---

# Funcionalidades

## Autenticação

O sistema possui autenticação utilizando usuário e senha, com geração de token JWT para acesso aos recursos protegidos.

Funcionalidades:

* Cadastro;
* Login;
* Autenticação através de JWT;
* Controle de acesso;
* Logout.

---

## Cadastro de Solicitações

Usuários autenticados podem registrar solicitações internas contendo informações como:

* Título;
* Descrição;
* Categoria;
* Usuário solicitante;
* Data de criação;
* Status.

As solicitações são inicialmente cadastradas com o status **Aberto**.

---

## Gerenciamento de Solicitações

O sistema permite:

* Criar solicitações;
* Editar solicitações abertas;
* Excluir solicitações abertas;
* Consultar detalhes;
* Listar solicitações;
* Alterar o status das solicitações.

Os status utilizados são:

* **Aberto**
* **Em Atendimento**
* **Concluído**

---

## Consulta e Filtros

O sistema disponibiliza mecanismos de pesquisa e filtragem das solicitações por:

* Período;
* Categoria;
* Status;
* Texto livre utilizando o título da solicitação.

---

## Dashboard

O sistema disponibiliza indicadores relacionados às solicitações:

* Quantidade total de solicitações;
* Quantidade de solicitações abertas;
* Quantidade de solicitações em atendimento;
* Quantidade de solicitações concluídas.

---

# Endpoints da API

## Serviço de Autenticação

Base path:

```text
/api/auth
```

| Método | Endpoint             | Descrição                                 |
| ------ | -------------------- | ----------------------------------------- |
| POST   | `/api/auth/cadastro` | Registra um novo usuário                  |
| POST   | `/api/auth/login`    | Autentica o usuário e retorna o token JWT |

---

## Serviço de Solicitações

Base path:

```text
/api/solicitacoes
```

| Método | Endpoint                            | Descrição                                     |
| ------ | ----------------------------------- | --------------------------------------------- |
| POST   | `/api/solicitacoes`                 | Cria uma nova solicitação                     |
| GET    | `/api/solicitacoes`                 | Lista as solicitações                         |
| GET    | `/api/solicitacoes/{id}`            | Consulta uma solicitação específica           |
| GET    | `/api/solicitacoes/minhas`          | Lista as solicitações do usuário autenticado  |
| GET    | `/api/solicitacoes/operador/buscar` | Realiza busca de solicitações para operadores |
| PUT    | `/api/solicitacoes/{id}`            | Atualiza uma solicitação                      |
| DELETE | `/api/solicitacoes/{id}`            | Exclui uma solicitação                        |
| PATCH  | `/api/solicitacoes/{id}/status`     | Altera o status de uma solicitação            |
| GET    | `/api/solicitacoes/metricas`        | Retorna métricas das solicitações             |

---

# Como Rodar o Projeto

## Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

* Git instalado;
* Node.js instalado;
* npm instalado;
* Docker instalado;
* Docker Compose instalado.

### Versões utilizadas

* Java 21
* Node.js
* npm
* PostgreSQL 15
* Docker
* Docker Compose

---

# 1. Clonar o Repositório

Clone o projeto:

```bash
git clone https://github.com/italohcavalcante/bit-Portal-Solicitacoes-Internas.git
```

Acesse a pasta do projeto:

```bash
cd bit-Portal-Solicitacoes-Internas
```

---

# 2. Configuração das Variáveis de Ambiente

Na raiz do projeto, existe o arquivo:

```text
.env.example
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Depois, abra o arquivo `.env` e configure as variáveis necessárias para execução da aplicação.

Exemplo:

```bash
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_PORT=5432

PORT_AUTH=8085
PORT_SOLICITACAO=8082
```

> Os valores acima são apenas exemplos. Utilize os valores definidos no `.env.example` do projeto.

### Segurança

O arquivo `.env` contém configurações que podem incluir informações sensíveis e **não deve ser enviado para o repositório**.

O arquivo `.env.example` deve ser utilizado como referência para configuração do ambiente.

---

# 3. Executar o Backend

Com o `.env` configurado, execute o Docker Compose na raiz do projeto:

```bash
docker compose up --build
```

O Docker irá construir as imagens dos serviços e iniciar os containers necessários.

Para executar os containers em segundo plano:

```bash
docker compose up --build -d
```

Os principais serviços executados são:

```text
PostgreSQL
auth-service
solicitacao-service
```

---

## Verificar os Containers

Para verificar os containers em execução:

```bash
docker compose ps
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

Para acompanhar o log de um serviço específico:

```bash
docker compose logs -f auth-service
```

ou:

```bash
docker compose logs -f solicitacao-service
```

---

## Parar o Backend

Para parar os containers:

```bash
docker compose down
```

---

# 4. Banco de Dados

O projeto utiliza **PostgreSQL 15** como banco de dados.

O banco é executado através do Docker Compose.

A criação e inicialização da estrutura necessária para a aplicação é realizada através do arquivo:

```text
init.sql
```

O arquivo está localizado na raiz do projeto:

```text
bit-Portal-Solicitacoes-Internas/
└── init.sql
```

O Docker Compose realiza a inicialização do banco durante a criação do container PostgreSQL.

---

# 5. Executar o Frontend

Abra um novo terminal e acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências do projeto React:

```bash
npm install
```

Após a instalação, execute a aplicação:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço para acesso à aplicação.

Normalmente:

```text
http://localhost:5173
```

---

# 6. Acesso à Aplicação

Após iniciar o backend e o frontend:

### Frontend

```text
http://localhost:5173
```

### Auth Service

```text
http://localhost:8085
```

### Solicitação Service

```text
http://localhost:8082
```

Os endereços das APIs podem variar de acordo com as portas configuradas no arquivo `.env`.

---

# 7. Usuários para Demonstração

Para realizar a avaliação da aplicação, devem ser utilizados os usuários de demonstração cadastrados no sistema.

### Usuário Operador

```text
Usuário: [PREENCHER]
Senha: [PREENCHER]
```

### Usuário Solicitante

```text
Usuário: [PREENCHER]
Senha: [PREENCHER]
```

> **Importante:** substituir os valores acima pelas credenciais reais antes da entrega do projeto.

---

# 8. Fluxo de Utilização

Após acessar o frontend, o fluxo básico da aplicação é:

```text
Cadastro / Login
       ↓
Autenticação
       ↓
Dashboard
       ↓
Listagem de Solicitações
       ↓
Criar / Consultar / Editar / Excluir
       ↓
Alteração de Status
       ↓
Conclusão da Solicitação
```

Usuários autenticados podem acessar as funcionalidades disponibilizadas de acordo com suas permissões.

---

# 9. Documentação Técnica

O projeto possui documentação complementar para explicar as decisões tomadas durante o desenvolvimento.

## Memorial Técnico de Desenvolvimento

O Memorial Técnico apresenta:

* Tecnologias utilizadas;
* Justificativas técnicas;
* Arquitetura da aplicação;
* Organização das camadas;
* Modelagem dos dados;
* Estratégia de autenticação;
* Comunicação entre frontend e backend;
* Organização do código;
* Limitações da solução;
* Melhorias futuras.

Arquivo:

```text
docs/memorial-tecnico.md
```

---

# 11. Segurança

Algumas medidas de segurança utilizadas no projeto incluem:

* Autenticação utilizando JWT;
* Senhas armazenadas de forma segura utilizando BCrypt;
* Controle de acesso às rotas protegidas;
* Variáveis sensíveis armazenadas através de variáveis de ambiente;
* Arquivo `.env` não versionado no Git;
* Separação dos serviços da aplicação.

---

# 12. Estrutura Final do Projeto

```text
bit-Portal-Solicitacoes-Internas/
│
├── backend/
│   ├── auth-service/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── pom.xml
│   │
│   └── solicitacao-service/
│       ├── src/
│       ├── Dockerfile
│       └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── memorial-tecnico.md
│   ├── dicionario-de-dados.md
│   └── evidencias/
│
├── init.sql
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# 13. Principais Comandos

## Backend

Na raiz do projeto:

```bash
cp .env.example .env
```

Depois:

```bash
docker compose up --build
```

Ou, para executar em segundo plano:

```bash
docker compose up --build -d
```

## Frontend

Dentro da pasta `frontend`:

```bash
npm install
```

Depois:

```bash
npm run dev
```

## Parar os containers

```bash
docker compose down
```

## Visualizar containers

```bash
docker compose ps
```

## Visualizar logs

```bash
docker compose logs -f
```

---

# 14. Licença

Projeto desenvolvido como parte do processo seletivo para **Desenvolvedor(a) de Sistemas Júnior — bit Soluções**.

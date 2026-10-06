# MEMORIAL TÉCNICO DE DESENVOLVIMENTO

## Portal de Solicitações Internas

**Projeto:** Portal de Solicitações Internas
**Repositório:** GitHub
**Arquitetura:** Full Stack baseada em microsserviços

---

# 1. Introdução

Este documento apresenta o Memorial Técnico de Desenvolvimento do **Portal de Solicitações Internas**

O objetivo do projeto é disponibilizar uma aplicação web capaz de permitir que colaboradores registrem solicitações internas, acompanhem sua evolução e consultem informações relacionadas às demandas cadastradas.

A solução foi desenvolvida contemplando frontend, backend e persistência de dados, buscando aplicar princípios de organização de código, separação de responsabilidades, segurança, reutilização e facilidade de execução.

A arquitetura adotada utiliza serviços independentes para autenticação e gerenciamento das solicitações, com comunicação entre frontend e backend por meio de APIs REST.

---

# 2. Tecnologias Utilizadas

## 2.1 Frontend

### React

O React foi utilizado como framework/biblioteca principal para construção da interface da aplicação.

A escolha do React ocorreu pela possibilidade de desenvolver uma interface baseada em componentes reutilizáveis, facilitando a organização das telas e a manutenção do código.

Para o cenário do projeto, o React também permite separar a apresentação da aplicação da lógica responsável pela comunicação com os serviços de backend.

### JavaScript

JavaScript foi utilizado como linguagem de desenvolvimento do frontend.

A linguagem permite implementar a interação com o usuário, manipulação dos dados recebidos das APIs e comportamento dinâmico da aplicação.

### Axios

O Axios foi utilizado para realizar as requisições HTTP entre o frontend e as APIs do backend.

A utilização de uma biblioteca dedicada para comunicação HTTP facilita a centralização das chamadas e o tratamento das respostas da API.

### Vite

O Vite foi utilizado como ferramenta de desenvolvimento e build do frontend.

Sua utilização proporciona um ambiente de desenvolvimento rápido e simplifica a execução da aplicação React durante o desenvolvimento.

---

# 3. Backend

## 3.1 Java 21

O Java foi utilizado como linguagem principal do backend.

A versão 21 foi escolhida por ser uma versão moderna e adequada para o desenvolvimento da aplicação, oferecendo suporte de longo prazo e recursos atuais da plataforma Java.

Além disso, Java possui amplo ecossistema para desenvolvimento de APIs, aplicações corporativas, segurança e persistência de dados.

---

## 3.2 Spring Boot

O Spring Boot foi utilizado como base dos serviços backend.

A escolha foi motivada pela facilidade de criação de APIs REST, integração com o ecossistema Spring e organização da aplicação em diferentes responsabilidades.

No projeto, o Spring Boot é utilizado nos serviços:

* `auth-service`;
* `solicitacao-service`.

A utilização do framework também facilita a configuração das dependências e a integração com componentes como Spring Security e Spring Data JPA.

---

## 3.3 Spring Security

O Spring Security foi utilizado para implementar a camada de segurança da aplicação.

A tecnologia permite proteger endpoints e controlar o acesso às funcionalidades que exigem autenticação.

A escolha do Spring Security está relacionada à integração natural com o Spring Boot e à disponibilidade de mecanismos para autenticação e autorização.

---

## 3.4 JWT

JSON Web Token (JWT) foi utilizado como mecanismo de autenticação da API.

Após o login, o backend gera um token que pode ser utilizado pelo frontend nas requisições destinadas aos recursos protegidos.

A utilização de JWT foi escolhida por se adequar ao modelo de comunicação baseado em APIs REST e por permitir uma abordagem de autenticação sem depender da manutenção de uma sessão tradicional no servidor.

---

## 3.5 Spring Data JPA

O Spring Data JPA foi utilizado para realizar a persistência das entidades da aplicação.

Sua utilização reduz a quantidade de código necessário para operações comuns de banco de dados, como criação, consulta, atualização e exclusão de registros.

A tecnologia também facilita a criação de repositórios e a integração com o PostgreSQL.

---

## 3.6 Hibernate

O Hibernate atua como implementação do JPA utilizada pelo projeto para realizar o mapeamento objeto-relacional.

A tecnologia permite trabalhar com as entidades Java de forma integrada ao banco de dados relacional.

Isso reduz a necessidade de escrever manualmente SQL para operações comuns e mantém a camada de persistência integrada ao modelo da aplicação.

---

# 4. Banco de Dados

## 4.1 PostgreSQL

O PostgreSQL foi escolhido como banco de dados relacional da aplicação.

A escolha está relacionada à necessidade de persistir informações estruturadas referentes aos usuários e às solicitações.

Entre os fatores considerados estão:

* Modelo relacional adequado ao domínio;
* Consistência dos dados;
* Suporte a transações;
* Integração com Spring Data JPA;
* Ampla utilização em aplicações corporativas;
* Compatibilidade com Docker.

O PostgreSQL é executado através de um container Docker, facilitando a configuração do ambiente de desenvolvimento e reduzindo a necessidade de instalação manual do banco na máquina do avaliador.

---

## 4.2 Inicialização do banco

A estrutura necessária para execução do banco é disponibilizada através do arquivo:

```text
init.sql
```

Esse arquivo é utilizado pelo Docker Compose durante a inicialização do PostgreSQL.

A estratégia permite que a estrutura necessária para execução do sistema seja criada de forma reproduzível.

---

# 5. Containerização

## 5.1 Docker

Docker foi utilizado para padronizar o ambiente de execução dos serviços backend e do banco de dados.

A utilização de containers reduz diferenças entre ambientes e facilita a execução do projeto por outras pessoas.

No projeto, os serviços são executados de forma isolada em containers.

---

## 5.2 Docker Compose

Docker Compose foi utilizado para orquestrar os containers da aplicação.

Através do arquivo `docker-compose.yml`, são definidos os serviços necessários para o funcionamento do backend e banco de dados.

Entre os serviços estão:

* PostgreSQL;
* `auth-service`;
* `solicitacao-service`.

Essa abordagem permite iniciar a infraestrutura necessária através de um único comando:

```bash
docker compose up --build
```

O Docker e Docker Compose também foram utilizados como diferencial de infraestrutura, uma vez que o desafio considera essa tecnologia um diferencial na avaliação.

---

# 6. Arquitetura da Aplicação

A aplicação foi estruturada seguindo uma abordagem baseada em microsserviços.

A solução possui três componentes principais:

```text
                    ┌──────────────────┐
                    │     Frontend     │
                    │      React       │
                    └────────┬─────────┘
                             │
                    HTTP / REST / JWT
                             │
              ┌──────────────┴──────────────┐
              │                             │
      ┌───────▼────────┐          ┌─────────▼────────┐
      │  auth-service  │          │ solicitacao-     │
      │                │          │ service          │
      │ Autenticação   │          │ Solicitações     │
      │ Usuários       │          │ Métricas         │
      │ JWT            │          │ Solicitações     │
      └───────┬────────┘          └─────────┬────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

A separação dos serviços foi adotada para manter as responsabilidades de autenticação e gerenciamento das solicitações organizadas de maneira independente.

---

# 7. Organização dos Serviços

## 7.1 auth-service

O `auth-service` concentra as responsabilidades relacionadas à autenticação.

Suas principais responsabilidades são:

* Cadastro de usuários;
* Login;
* Validação das credenciais;
* Geração do JWT;
* Controle de autenticação;
* Proteção dos recursos relacionados à identidade do usuário.

A separação desse serviço permite que a responsabilidade de autenticação fique isolada do domínio das solicitações.

---

## 7.2 solicitacao-service

O `solicitacao-service` concentra as regras relacionadas às solicitações internas.

Suas responsabilidades incluem:

* Criar solicitações;
* Consultar solicitações;
* Atualizar solicitações;
* Excluir solicitações;
* Alterar status;
* Consultar solicitações do usuário;
* Realizar buscas;
* Gerar métricas.

Essa separação permite que a lógica do domínio principal da aplicação fique independente da implementação da autenticação.

---

# 8. Organização das Camadas

Dentro dos serviços backend, foi utilizada uma organização baseada na separação de responsabilidades.

De maneira geral, a estrutura segue responsabilidades semelhantes a:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controller

Responsável por receber as requisições HTTP e disponibilizar os endpoints da API.

### Service

Responsável por concentrar as regras de negócio da aplicação.

### Repository

Responsável pela comunicação com a camada de persistência utilizando Spring Data JPA.

### Model / Entity

Representa as entidades utilizadas pela aplicação e seu relacionamento com os dados persistidos.

Essa separação facilita a manutenção e reduz o acoplamento entre as diferentes responsabilidades.

---

# 9. Estratégia de Modelagem de Dados

O banco de dados foi estruturado utilizando o modelo relacional.

As informações são representadas através de entidades relacionadas ao domínio da aplicação, principalmente usuários e solicitações.

Uma solicitação possui informações como:

* Identificador;
* Título;
* Descrição;
* Categoria;
* Usuário solicitante;
* Data de criação;
* Status;
* Informações relacionadas ao atendimento.

O usuário autenticado também é utilizado como referência para identificar o responsável pela criação da solicitação.

A modelagem busca manter os dados organizados e evitar duplicação desnecessária de informações.

---

# 10. Estratégia de Autenticação

A autenticação foi implementada utilizando Spring Security e JWT.

O fluxo principal ocorre da seguinte maneira:

```text
1. Usuário informa usuário e senha
              ↓
2. Frontend envia requisição de login
              ↓
3. auth-service valida as credenciais
              ↓
4. Backend gera o JWT
              ↓
5. Frontend recebe o token
              ↓
6. Token é utilizado nas requisições protegidas
              ↓
7. Backend valida o token
              ↓
8. Recurso é liberado conforme as permissões
```

Essa estratégia permite que o backend valide a identidade do usuário nas requisições protegidas.

Além da autenticação, o sistema possui diferenciação de permissões para determinadas operações, como alteração de status e busca destinada ao perfil `OPERADOR`.

---

# 11. Comunicação entre Frontend e Backend

A comunicação entre frontend e backend ocorre através de APIs HTTP.

O frontend utiliza Axios para realizar as requisições aos serviços.

A comunicação segue o seguinte fluxo:

```text
React
  │
  │ HTTP
  ▼
API REST
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
PostgreSQL
```

Para operações protegidas, o token JWT é enviado pelo frontend para que o backend possa realizar a validação da autenticação.

Essa separação permite que o frontend seja desacoplado da implementação interna dos serviços backend.

---

# 12. API REST

A aplicação disponibiliza endpoints específicos para cada domínio.

O `auth-service` possui endpoints relacionados à autenticação:

```text
POST /api/auth/cadastro
POST /api/auth/login
```

O `solicitacao-service` possui endpoints relacionados ao gerenciamento das solicitações:

```text
POST   /api/solicitacoes
GET    /api/solicitacoes
GET    /api/solicitacoes/{id}
GET    /api/solicitacoes/minhas
PUT    /api/solicitacoes/{id}
DELETE /api/solicitacoes/{id}
PATCH  /api/solicitacoes/{id}/status
GET    /api/solicitacoes/metricas
```

A organização dos endpoints procura manter uma separação clara entre autenticação e gerenciamento do domínio principal.

---

# 13. Regras de Negócio

Entre as principais regras implementadas estão:

* Usuários precisam estar autenticados para acessar recursos protegidos;
* Solicitações possuem um usuário solicitante;
* Uma nova solicitação inicia com status `Aberto`;
* Solicitações abertas podem ser editadas;
* Solicitações abertas podem ser excluídas;
* A alteração de status possui controle de permissão;
* Operações destinadas ao operador são protegidas;
* As métricas são obtidas a partir das solicitações cadastradas.

Essas regras foram implementadas na camada responsável pela lógica de negócio, evitando concentrar toda a lógica diretamente nos controllers.

---

# 14. Validações e Tratamento de Erros

A aplicação possui validações relacionadas aos dados recebidos pelas APIs e às regras de acesso.

O backend também realiza validações de autenticação e autorização antes de permitir acesso a determinados recursos.

O objetivo é impedir que requisições inválidas ou não autorizadas sejam processadas normalmente.

### Melhorias futuras

Uma evolução possível seria ampliar a padronização das respostas de erro da API, criando um modelo único para mensagens e códigos de erro.

Também seria possível aumentar a cobertura de testes automatizados para garantir o comportamento das principais regras de negócio.

---

# 15. Frontend

O frontend foi desenvolvido utilizando React e organizado de forma componentizada.

A interface é responsável por:

* Autenticação do usuário;
* Navegação;
* Cadastro de solicitações;
* Listagem;
* Consulta de detalhes;
* Edição;
* Exclusão;
* Filtros;
* Visualização das métricas;
* Alteração de status de acordo com as permissões.

A utilização de componentes permite separar partes da interface e facilita a manutenção do código.

O frontend também é responsável por consumir as APIs disponibilizadas pelos microsserviços.

---

# 16. Segurança

A segurança foi considerada principalmente nos seguintes pontos:

### Autenticação

Utilização de JWT para autenticar as requisições protegidas.

### Autorização

Determinadas operações são restritas de acordo com o perfil do usuário.

### Senhas

As senhas dos usuários são protegidas utilizando BCrypt.

### Variáveis de ambiente

Informações sensíveis de configuração são mantidas através de variáveis de ambiente.

O arquivo `.env` não deve ser versionado no Git, sendo disponibilizado apenas o `.env.example` como referência.

### Separação de responsabilidades

A autenticação foi isolada no `auth-service`, reduzindo a concentração de responsabilidades dentro do serviço principal.

---

# 17. Decisões Arquiteturais

A principal decisão arquitetural foi separar a aplicação em serviços independentes.

Essa decisão foi tomada considerando que o domínio possui pelo menos duas responsabilidades principais:

1. Autenticação e gerenciamento de usuários;
2. Gerenciamento das solicitações internas.

A separação facilita a evolução independente dessas partes da aplicação.

Em contrapartida, uma arquitetura baseada em microsserviços aumenta a complexidade operacional em comparação com uma aplicação monolítica, pois exige gerenciamento de múltiplos serviços, comunicação entre processos e configuração de infraestrutura.

Para o contexto do projeto, a escolha também me permitiu demonstrar conhecimentos relacionados a APIs, autenticação, persistência, containers e separação de responsabilidades.

---

# 18. Padrões e Princípios Utilizados

A aplicação utiliza conceitos de separação de responsabilidades e organização em camadas.

Entre os principais conceitos utilizados estão:

* Separação entre Controller, Service e Repository;
* Injeção de dependências através do Spring;
* Repositórios para abstração do acesso aos dados;
* Componentização no frontend;
* Separação entre autenticação e domínio de solicitações;
* API REST para comunicação entre sistemas.

O objetivo dessas decisões é reduzir o acoplamento entre componentes e facilitar futuras alterações.

---

# 19. Análise Crítica

## 19.1 Limitações

A solução possui pontos que poderiam ser aprimorados.

Entre eles:

* Padronização mais completa das respostas de erro;
* Monitoramento dos microsserviços;
* Logs estruturados;
* Gerenciamento mais avançado de configuração e segredos.

Essas limitações estão relacionadas principalmente ao tempo e ao escopo definidos para o desenvolvimento do projeto.

---

# 20. Melhorias Futuras

Entre as possíveis evoluções estão:

### Integração com Inteligência Artificial (LLMs)

Implementar um chatbot inteligente para o atendimento inicial aos usuários. A IA interpretaria a solicitação em linguagem natural, extrairia os dados necessários e faria o roteamento automático do pedido diretamente para o departamento responsável (como RH ou Financeiro).

### Testes automatizados

Adicionar testes unitários e de integração para as principais regras de negócio e endpoints.

### Observabilidade

Adicionar ferramentas para monitoramento dos serviços e rastreamento de requisições.

### Documentação da API

Adicionar documentação utilizando uma ferramenta como OpenAPI/Swagger.

### Escalabilidade

Em um cenário de maior utilização, os serviços poderiam ser escalados de maneira independente conforme a demanda.


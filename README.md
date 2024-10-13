# Documentação da API

Esta documentação descreve as rotas disponíveis para o gerenciamento de usuários, exercícios e upload de arquivos. Algumas rotas requerem autenticação por token JWT.

## URL Base

http://localhost:3000/api/

## Autenticação

- A autenticação é realizada com **token JWT**. O token deve ser incluído no cabeçalho `Authorization` como Bearer Token.
- Algumas rotas são restritas a **administradores**.

## Rotas

### 1. Gerenciamento de Usuários

#### Criar Usuário

- **URL**: `/create_user`
- **Método**: `POST`
- **Descrição**: Cria um novo usuário.
- **Corpo da Requisição**:

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "pais": "string"
  }
  ```

#### Login de Usuário

- **URL**: `/login`
- **Método**: `POST`
- **Descrição**: Login.
- **Corpo da Requisição**:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Criar Exercícios

- **URL**: `/create_ex`
- **Método**: `POST`
- **Descrição**: criar exercício.
- **Corpo da Requisição**:

  ```json
  {
    "name": "string",
    "subject": "string",
    "categoria": "string",
    "tester": "string",
    "nivel": "integer",
  }
  ```

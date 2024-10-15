# Documentação da API

Esta documentação descreve as rotas disponíveis para o gerenciamento de usuários, exercícios e upload de arquivos. Algumas rotas requerem autenticação por token JWT.

## URL Base

https://shell-nqt2lll1z-justino-soares-projects.vercel.app/api/

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

- **Resposta de Acesso**

  ```json
  {
    "status": "true",
    "msg": "Login bem sucedido",
    "token": "o token"
  }
  ```

  - **Resposta de Não Acesso**

  ```json
  {
    "status": "false",
    "msg": "Email ou senha inválida"
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
    "nivel": "integer"
  }
  ```
### Pegar cada usuário pelo Id

- **URL**: `/each_user/:userId`
- **Método**: `GET`
- **Auth**: true.
- **Corpo da Requisição**:

  ```json
  {
	"status": "true",
	"msg": "User encontrado",
	"data": {
		"id": "INT",
		"name": "string",
		"email": "string",
		"sex": "string",
		"pontos": "INT",
		"resolvidos": "INT",
		"pais": "string",
		"createdAt": "date-time",
		"updatedAt": "date-time",
		"exercices": [
          {
				"id": "INT",
				"name": "string",
				"subject": "string",
				"nivel": "INT",
				"categoria": "string",
				"tester": "string",
				"resolvidos": "INT",
				"createdAt": "date-time",
				"updatedAt": "date-time",
				"user_exes": {
					"feito": "BOOLEAN"
				}
			}
        ]
  }
  ```

### Pegar todos os usuários

- **URL**: `/show_users`
- **Método**: `GET`
- **Auth**: true.
- **Filtragem**: `order_by` `asc_desc` `limitMax`
- **Corpo da Requisição**:

```json
{
	"status": "true",
	"msg": "Encontrado com sucesso",
	"data": [
		{
			"id": "INT",
			"index": "INT",
			"name": "string",
			"resultado": "INT",
			"pais": [
				"🇦🇴",
				"Nome_do_pais"
			]
		}
	]
}

```

### Pegar cada exercicio pelo id

- **URL**: `/each_ex/:exId`
- **Método**: `GET`
- **Auth**: true.
- **Corpo da Requisição**:
```json
 {
    "status": "true",
	"msg": "Exercício encontrado com sucesso",
	"data": {
		"id": "INT",
		"name": "string",
		"subject": "string",
	    "nivel": "INT",
		"categoria": "string",
		"tester": "string",
		"resolvidos": "INT",
		"createdAt": "date-time",
		"updatedAt": "date-time",
		"user_exes": {
    		"feito": "BOOLEAN"
		}
    }
 }
```

### Pegar todos exercicios

- **URL**: `/show_ex`
- **Método**: `GET`
- **Auth**: true.
- **Filtragem**: `categoria`  `order_by` `asc_desc` `limitMax`
- **Corpo da Requisição**:

```json
{
	"status": "true",
	"msg": "Encontrado com sucesso",
	"data": [
		{
			"id": "INT",
			"index": "INT",
			"name": "string",
			"feito": "BOOL",
			"categoria": "string",
			"resolvidos": "INT"
		}
	]
}

```


### Pegar todos exercicios

- **URL**: `/validate/:exId`
- **Método**: `GET`
- **Auth**: true.
- **Descricao**: o avaliador.
`limitMax`
- **Corpo da Requisição**:

```json
  {
    "content": "string",
  }
```
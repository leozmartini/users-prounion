# Users Pro union

> Projeto de gerenciamento de usuários.

## ☕ Funcionalidade

A aplicação é construída com TypeScript e Express, e oferece um conjunto de rotas para o gerenciamento de usuários e autenticação. A rota privada de CRUD de usuários permite operações de criação, leitura, atualização e exclusão de usuários, e é protegida por autenticação via tokens JWT, garantindo que apenas usuários autenticados possam acessá-la. Apenas usuários já cadastrados podem utilizar o CRUD, editando os demais usuários que têm acesso. Além disso, a aplicação possui uma rota pública para verificação de dados de login, que interage com um banco de dados MySQL para autenticar usuários. Isso garante que as informações de login sejam processadas de forma segura e eficiente. As senhas são armazenadas no banco de dados em hash, usando bcrypt, o que aumenta a segurança, pois o bcrypt aplica uma função de hash forte que torna extremamente difícil recuperar a senha original a partir do hash, e deixando senhas iguais com Hashs diferentes.

OBS: Ao tentar acessar página "/home" sem um token válido, ela irá pré renderizar e redirecionar para a página de login. Esse pré renderização não contém nenhum dado sensível ou dado que necessida de token válido. Essa metodologia foi escolhida para economizar requests de verificação toda vez que a página for carregada.

## 🛠️ Principais ferramentas

- [TypeScript](https://www.typescriptlang.org/) - Linguagem utilizada na aplicação.
- [express](https://www.npmjs.com/package/express) - Gerenciar back-end.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Sistema de token de acesso.
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Criptografia de senhas no DataBase.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) - Manipular cookies.
- [dotenv](https://www.npmjs.com/package/dotenv) - Variáveis de ambiente.
- [mysql](https://www.npmjs.com/package/mysql2) - Banco de dados relacional.
- [Vite](https://vitejs.dev/) - Build tool de React.
- [styled-components](https://styled-components.com/) - Estilização de componentes.
- [axios](https://www.npmjs.com/package/axios) - Gerenciar requests.

## ⚙️ API

Comandos da API para consultar e registrar dados.

- Listar usuários

```
Entrada:
GET
Cookie de token válido necessário.
/api/users

Saída:
Todos os usuários cadstrados no momento, em ordem de ID.
```

- Registrar usuário

```
Entrada:
POST
Cookie de token válido necessário.
/api/users
Body JSON: {
    "name": "Nome do usuário",
    "email": "Email válido",
    "password": "senha",
}

Saída:
Usuário será registrado. E o servidor irá devolver o objeto do usuário registrado com o ID.

```

- Deletar usuário

```
Entrada:
DELETE
Cookie de token válido necessário.

/api/users/:id

Saída:
Usuário será deletado do bando de dados, response 204.

```

- Atualizar usuário

```
Entrada:
PUT
Cookie de token válido necessário.

/api/users/:id

Saída:
Reponse 200 com os dados atualizados em JSON. Senha será informada que foi alterada, mas não será exibido o Hash.

```

- Auth

```
Entrada:
POST
/api/auth/login
Body JSON: {
    "email": "Email cadastrado",
    "password": "Senha do usuário",
}

Saída:
Token de acesso, válido por 2 minutos.

```

## 🔗 Instalando localmente.

1. Iniciar container. (Necessário docker)

```
    docker compose up --build
```

2. Aguardar serviços iniciar. Aplicação será encontrada em

```
    http://localhost:5173/
```

PARA VISUALIZAR A DOCUMENTAÇÃO ACESSE /docs/v1
- Documentação básica apenas para exemplificar a aplicação e mostrar as principais rotas da aplicação.

API realizada em NodeJS e TypeScript, utilizando dependências como Typeorm, Jest, SuperTest, Docker e Swagger.

Clone a aplicação e rode um npm install. 

Caso dê erros rode ->

- npm install jest --save
- npm install typeorm --save
- npm install supertest --save 
- npm install docker --save
- npm install swagger-ui-express
- npm install bcryptjs --save
- npm install body-parser --save


DATABASE
Antes de executar NPM START e iniciar o servidor, clone a imagem do banco de dados POSTGRES no docker!

- docker pull postgres:alpine
- docker run --name typeorm-postgres -e POSTGRES_PASSWORD=123456 -d -p 5432:5432 postgres:alpine
- docker exec -it typeorm-postgres bash
- psql -U postgres
- CREATE DATABASE crud;
- CREATE DATABASE crudtests;
  
Para criar a imagem no docker, rode o comando -> 
- docker-compose up --build

Para iniciar o servidor, rode -> 
- NPM START

Assim que o servidor estiver online, ele executará as migrations e as seeders, criando um usuário padrão com os seguintes dados:
 - str_username: admin
 - password: 123456
 
Para criar usuários, as rotas são protegidas com middlewares de autenticação e de user role.
 
TESTES
 - Foram feitos apenas testes unitários básicos, para exemplo da aplicação de estrutura TDD.
 
 

 
 


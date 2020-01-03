<h1 align="center">
  <a href="https://rocketseat.com.br/bootcamp"> <font color="#7159C1">Desafio Final 9º GoStack</font></a>
</h1>
<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src=".github/logo.svg" width="200px" />
</h1>

## Sobre

O Gympoint é um projeto apresentado a Rocketseat como parte dos requisitos para certificação de conclusão da 9º edição do bootcamp GoStack.
A proposta do projeto é criar uma aplicação para gerenciamento de academias.
Portanto, esse projeto é composto de 2 aplicações uma web (frontend) e uma aplicação mobile.

**Aplicação Web**: É a aplicação para administração da academia, onde o usuário pode cadastrar novos alunos, planos e gerenciar matriculas e pedidos de auxílio.
<h1 align="center">
  <img alt="Gympoint WEB" title="GympointWEB" src=".github/web.png" width="600px" />
</h1>

**Aplicação Mobile**: É uma aplicativo voltado para os usuários da academia, onde o aluno pode realizar checkin e realizar um pedido de auxílio.

<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src=".github/mobile.png" width="200px" />
</h1>

## Requisitos
- [Docker](https://docs.docker.com/get-started/)
- [Yarn](https://yarnpkg.com/pt-BR/docs/install#windows-stable)
- [React Native](https://facebook.github.io/react-native/docs/getting-started)
- [Node v.10](https://nodejs.org/en/)

> **AVISO:** A Aplicação mobile foi desenvolvida e testada com o Android 8.1.0, portanto pode ser que necessite de ajustes para funcionar no IOS. 

## Principais tecnologias utilizadas
- [Express](https://expressjs.com/pt-br/)
- [React](https://pt-br.reactjs.org/)
- [React Native](https://facebook.github.io/react-native/)
- [Node](https://nodejs.org/en/)
- [Mysql](https://www.mysql.com/)
- [Sequelize](https://sequelize.org/)
- [Redis](https://redis.io/)
- [JWT](https://github.com/auth0/node-jsonwebtoken#readme)


## Instalação

### 1 Configuração de ambiente

- Copiar o arquivo **frontend/.env.example** para **frontend/.env** e configurar as variáveis de ambiente relacionadas ao serviço de e-mail(MAIL_USER, MAIL_PASS) e o [Sentry](https://sentry.io/welcome/)(SENTRY_DSN).

- Copiar o arquivo **frontend/.env.example** para **frontend/.env**
- Copiar o arquivo **mobile/.env.example** para **mobile/.env**

> **IMPORTANTE:** Algumas configurações estão vinculadas com os serviços adicionados no **docker-compose.yml** então caso faça alguma alteração de porta ou endereço por exemplo é necessário alterar no **docker-compose** também.

### 2 Rodando a aplicação

- Para iniciar a aplicação é necessário apenas rodar o comando **docker-compose up** e aguardar a inicialização que pode demorar um pouco para baixar as imagens e instalar as dependências do **backend** e do **frontend**

### 3 Migrations
Após aguardar os serviços serem inicializados é preciso rodar as migrations e seeds do container do **backend** com os seguintes comandos:

-  **Migration:** docker exec -it **[CONTAINER_ID]** yarn sequelize db:migrate
-  **Seeds:** docker exec -it **[CONTAINER_ID]** yarn sequelize db:seed:all

> Para saber o **[CONTAINER_ID]** da api você pode rodar o comando **docker ps**

### 4 Acessando aplicação
  - Acesse o link [http://localhost:3333](http://localhost:3333) e se aparecer {"error":"Token not provided"} significa que a api está funcionando.
  - Acesse o link [http://localhost:3000](http://localhost:3000) e se aparecer uma tela de autenticação significa que a aplicação web está funcionando.

  Com a execução dos seeds é criado um usuário e senha padrão para acessar a aplicação que é:<br/>
  - **email**: admin@gympoint.com
  - **senha**: 123456


### 5 Mobile
Para executar a aplicação móvel é preciso acessar a pasta **./mobile** via prompt de comando e rodar os seguintes comandos : **yarn**,  **yarn start --reset-cache** e  **react-native run-android**, caso for ios rodar o comando **react-native run-ios** (lembrando que foram feitos testes apenas no android)

> **Importante:** Caso faça testes utilizando o USB é preciso rodar o comando: **adb reverse tcp:3333 tcp:3333 && yarn android** para que seja possível a comunicação com a API.

> **Importante:** Caso a aplicação não esteja realizando login (demorando demais) e você estiver num ambiente Windows, pode ser que o firewall esteja bloqueando a porta 3333. Adicione uma exceção ao firewall, rodando o comando a seguir no prompt de comando com privilégio administrativo: **netsh advfirewall firewall add rule name=gympoint dir=in action=allow protocol=TCP localport=3333** para que seja possível a comunicação com a API.
## Projeto Vue de Listagem de Filmes

### Descrição

Este projeto é uma aplicação Vue.js que permite aos usuários visualizar uma lista de filmes populares, aplicar filtros para refinar a pesquisa e visualizar detalhes dos filmes. A aplicação se comunica com a API do The Movie Database (TMDb) para buscar os dados dos filmes.

### Funcionalidades

- Exibição de uma lista de filmes populares.
- Filtragem de filmes por data de lançamento, gênero, certificação etária, idioma e palavras-chave.
- Ordenação de filmes por popularidade, classificação, data de lançamento e título.
- Paginação para carregar mais filmes.
- Visualização dos detalhes de um filme selecionado.

### Estrutura do Projeto

```
/my-vue-project
  /node_modules
  /public
  /src
    /components
      - AppSidebar.vue
      - MovieList.vue
    /views
      - HomeView.vue
      - MovieDetailView.vue
    /utils
      - eventBus.js
    App.vue
    main.js
  /tests
    /unit
      - HomeView.spec.js
      - MovieDetailView.spec.js
      - AppSidebar.spec.js
      - MovieList.spec.js
  .env
  jest.config.js
  package.json
  README.md
```

### Requisitos

- Node.js (>=14.x)
- Vue CLI (>=4.x)
- Conta na API do The Movie Database (TMDb) para obter a chave de API

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   cd nome-do-repositorio
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configuração da API do TMDb:**

   Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais da API do TMDb:

   ```bash
   VUE_APP_API_URL=https://api.themoviedb.org/3
   VUE_APP_API_TOKEN=YOUR_API_KEY
   ```

### Desenvolvimento

1. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run serve
   ```

2. **Abra o navegador:**

   A aplicação estará disponível em `http://localhost:8080`.

### Testes

Este projeto utiliza Jest e Vue Test Utils para testes unitários.

1. **Rodar todos os testes:**

   ```bash
   npm run test:unit
   ```

2. **Configuração do Jest:**

   O arquivo de configuração do Jest (`jest.config.js`) já está configurado para suportar testes com Vue.

### Estrutura de Componentes

#### `AppSidebar.vue`

Este componente é responsável pela barra lateral que permite aos usuários aplicar filtros e ordenar a lista de filmes. Ele emite eventos para atualizar os filtros selecionados.

#### `MovieList.vue`

Este componente é responsável por exibir a lista de filmes com base nos filtros aplicados. Ele também suporta paginação e navegação para a página de detalhes do filme.

### Scripts Disponíveis

- `npm run serve`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build para produção.
- `npm run lint`: Executa o linter para verificar problemas no código.
- `npm run test:unit`: Executa os testes unitários.

### Contribuição

1. **Fork o repositório.**
2. **Crie uma branch para sua feature (`git checkout -b feature/fooBar`).**
3. **Commit suas mudanças (`git commit -am 'Add some fooBar'`).**
4. **Push para a branch (`git push origin feature/fooBar`).**
5. **Crie um novo Pull Request.**

### Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Seu Nome].

# 📰 NC News API

This is an API for a news discussion website (similar to reddit). The API uses GET, POST, PATCH and DELETE methods to interact with a postgres database which contains articles, comments, users and topics.

This is a back-end portfolio project for the [Northcoders bootcamp](https://northcoders.com). A front-end will be added later in the course.

A hosted version of the API is available here: [https://liamjorge-nc-news.herokuapp.com/api](https://liamjorge-nc-news.herokuapp.com/api)

# 📣 Prerequisites

Install the following on your local machine

| package                                | minimum version | description                    |
| -------------------------------------- | --------------- | ------------------------------ |
| [node](https://nodejs.org/en/)         | 17.5.0          | javascript runtime environment |
| [npm](https://www.npmjs.com)           | 8.4.1           | node package manager           |
| [postgres](https://www.postgresql.org) | 14.2            | relational database system     |

# 🎬 Getting started

This section describes how to run a copy of the project locally for development and testing. See the deployment section for how to deploy the project to Heroku.

1. Clone this repo and open it in your IDE of choice

   ```
   git clone https://github.com/liamjorge/nc-news.git
   cd nc-news
   code .
   ```

2. Install dependencies. See the deployment section for further details

   ```
   npm install
   ```

3. Add required environment variables

   ```
   touch .env.test && echo "PGDATABASE=nc_news_test">> .env.test
   touch .env.development && echo "PGDATABASE=nc_news">> .env.development
   ```

4. Create and seed databases

   ```
   npm run setup-dbs
   npm run seed
   ```

5. Run the project on [http://localhost:9090](http://localhost:9090)

   ```
   npm start
   ```

6. View available API endpoints at [http://localhost:9090/api](http://localhost:9090/api)

# 🧪 Running tests

- Run all tests using

  ```
  npm t
  ```

- Or specific types of tests using

  ```
  npm t unit-tests
  npm t integration-tests
  ```

# ☁️ Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/liamjorge/nc-news)

# ⚡️ CI/CD

- `git commit` triggers a husky workflow which runs all unit and integration tests
- `git push origin main` triggers a GitHub actions workflow which runs all unit and integration tests and then deploys to Heroku

# 🛠 Dependencies

| package                                              | description              |
| ---------------------------------------------------- | ------------------------ |
| [express](https://www.npmjs.com/package/express)     | web framework            |
| [dotenv](https://www.npmjs.com/package/dotenv)       | loading env variables    |
| [pg](https://www.npmjs.com/package/pg)               | postgres client for node |
| [pg-format](https://www.npmjs.com/package/pg-format) | dynamic psql queries     |

## 🤓 Dev dependencies

| package                                                      | description                  |
| ------------------------------------------------------------ | ---------------------------- |
| [jest](https://www.npmjs.com/package/jest)                   | javascript testing framework |
| [jest-extended](https://www.npmjs.com/package/jest-extended) | additional matchers for jest |
| [jest-sorted](https://www.npmjs.com/package/jest-sorted)     | additional matchers for jest |
| [supertest](https://www.npmjs.com/package/supertest)         | api endpoint testing         |
| [husky](https://www.npmjs.com/package/husky)                 | pre-commit git hooks         |
| [nodemon](https://www.npmjs.com/package/nodemon)             | local server auto-reloads    |

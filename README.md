# GitHub Repository Manager API

A NestJS API application to manage and search GitHub repositories for a specified user. The API provides endpoints to fetch and store GitHub repositories in a PostgreSQL database, list stored repositories, and search repositories by keyword.

## Features

- **Fetch and store repositories**: Retrieve a GitHub user's public repositories and store them in a PostgreSQL database.
- **List stored repositories**: View all stored repositories for a specific GitHub user.
- **Search repositories**: Search stored repositories based on keywords in their name or description.

## Prerequisites

- Docker and Docker Compose installed
- GitHub API Access Token (for authenticated requests to GitHub)

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone URL
   cd 
   ```

2. **Create a `.env` file** in the project root with the following environment variables:

   ```env
   # Database Configuration
   DB_HOST=db
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres_password
   DB_NAME=github_repos

   # GitHub API Configuration
   GITHUB_API_URL=https://api.github.com
   GITHUB_ACCESS_TOKEN=your_github_access_token  # Replace with your GitHub token
   ```

3. **Build and start the containers**:

   ```bash
   docker-compose up --build
   ```

   Github Actions pipeline also builds this project

4. **Access the API**:
   The API will be available at `http://localhost:3000`.

## Docker Compose Configuration

The `docker-compose.yml` file sets up two services:

- **app**: The NestJS application running the API
- **db**: A PostgreSQL database to store GitHub repository data

### docker-compose.yml

```yaml
services:
  db:
    image: postgres:14-alpine
    ports:
      - 5432:5432
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=nest-demo
    networks:
      - app-network

  app:
    image: ddz99/nest-challenge:latest
    ports:
      - "3000:3000" # Outside to Inside
    networks:
      - app-network
    depends_on:
      - db
    environment:
      NODE_ENV: production
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: postgres
      DATABASE_PASSWORD: postgres
      DATABASE_NAME: nest-demo
      GITHUB_API_URL: https://api.github.com
      GITHUB_ACCESS_TOKEN: your_github_access_token  # Add your GitHub API key here
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

## API Endpoints

### 1. Fetch and Store Repositories for a User

- **Description**: Fetch all public repositories of a specified GitHub user and store them in the database.
- **Endpoint**: `POST /repositories/:username`
- **Parameters**:
  - `username` (path): GitHub username whose repositories will be fetched and stored.
- **Example**:
  ```bash
  curl -X POST http://localhost:3000/repositories/johndoe
  ```
- **Response**:
  Returns an array of stored repository objects.

### 2. List Stored Repositories for a User

- **Description**: List all repositories stored in the database for a specified GitHub user.
- **Endpoint**: `GET /repositories/:username`
- **Parameters**:
  - `username` (path): GitHub username to list stored repositories.
- **Example**:
  ```bash
  curl http://localhost:3000/repositories/johndoe
  ```
- **Response**:
  ```json
  [
    {
      "repositoryId": 123,
      "name": "example-repo",
      "description": "An example repository",
      "url": "https://github.com/johndoe/example-repo",
      "mainLanguage": "JavaScript",
      "creationDate": "2022-01-01T00:00:00.000Z"
    },
    ...
  ]
  ```

### 3. Search Repositories by Keyword

- **Description**: Search for repositories stored in the database by keywords found in the repository name or description.
- **Endpoint**: `GET /repositories/search`
- **Parameters**:
  - `q` (query): Keyword to search in repository names and descriptions.
- **Example**:
  ```bash
  curl http://localhost:3000/repositories/search?q=example
  ```
- **Response**:
  ```json
  [
    {
      "repositoryId": 123,
      "name": "example-repo",
      "description": "An example repository",
      "url": "https://github.com/johndoe/example-repo",
      "mainLanguage": "JavaScript",
      "creationDate": "2022-01-01T00:00:00.000Z"
    },
    ...
  ]
  ```

## Project Structure

```
src/
├── modules/
│   ├── repository/
│   │   ├── dto/
│   │   │   ├── 
│   │   ├── entities/
│   │   │   └── repository.entity.ts
│   │   ├── repository.controller.ts
│   │   ├── repository.module.ts
│   │   └── repository.service.ts
├── app.module.ts
└── main.ts
```




## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

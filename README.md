# Sirius Boilerplate

Sirius Boilerplate is a backend system built with NestJS, TypeScript, and PostgreSQL (using TypeORM) designed to manage teachers, students, and their lessons. The system leverages single table inheritance for users and provides robust API endpoints, complete with input validation and end-to-end tests.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Backend Framework:** [NestJS](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Testing:** [Jest](https://jestjs.io/), [Supertest](https://github.com/visionmedia/supertest)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/wassimoo/sirius-boilerplate.git
   cd sirius-boilerplate
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

## Configuration

Configure your PostgreSQL connection settings. You can use an `.env` file or modify `ormconfig.json`. An example `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=sirius
```

Make sure your application reads these environment variables accordingly (e.g., in your `app.module.ts`).

## Running the Application

Start the application in development mode:

```bash
npm run start:dev
```

## Running End-to-End Tests

Run the end-to-end tests using Jest:

```bash
npm run test:e2e
```

# EPAM NodeJS Mentoring

> run `npm install` to retrieve all dependencies

### Task 1

- Task 1.1, run `npm run task11`. Reverses input text.
- Task 1.2, run `npm run task12`. Converts `csv/task12.csv` to `json` at `task12.txt`.
- Task 1.3, run `npm run build`. Compiles the task scripts for browser support, following the config in `babel.config.json`. Confirm compiled scripts still run, by invoking `npm run task11b` or `task12b` (`b` for `babel`).

### Task 2.1

Run `npm run task21`. Servers a CRUD API on [localhost:3000](localhost:3000). Endpoints available:

- `GET /user/all` to see all users currently in the DB (including their 'soft-delete' status).
- `GET /suggest?filter=substring&limit=3` to query the DB based on a `substring` for the users' `login` field, and a `limit` (optional) to narrow the search to the first 'x' amount of users in the DB.
- `GET /user/{id}` to get a user by ID. _ID must be a valid UUID string_.
- `POST /user` to create a user, returns the new user's `id`. Expected body:
  ```js
  {
    "login": "string", // should be between 6 and 30 characters (letters, digits or _), without spaces, and must start with a letter
    "password": "string", // should be between 8 and 30 alphanumeric characters (letters or digits) without punctuation or spaces'
    "age": "string" // should be a number between 3 and 131
  }
  ```
- `PUT /user/{id}` to update a user by ID. _ID must be a valid UUID string_.
  Expected body:
  ```js
  {
    "login": "string", // should be between 6 and 30 characters (letters, digits or _), without spaces, and must start with a letter
    "password": "string", // should be between 8 and 30 alphanumeric characters (letters or digits) without punctuation or spaces'
    "age": "string" // should be a number between 3 and 131
  }
  ```
- `DELETE /user/{id}` to (soft) delete a user by ID. _ID must be a valid UUID string_.

### Task 3

#### Setup

1. Set up a local PostgreSQL DB called `postgres`,
1. Create a user called `localhost` with password `password`,
1. Grant all privileges for accessing the DB, e.g.

```SQL
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localhost;
```

1. Create the following table and insert the dummy data with the commands below. The PostgreSQL uses `uuid-ossp` to auto-generate uuid (v4) identifiers for each new user:

```SQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    login VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    age SMALLINT NOT NULL,
    is_deleted BOOLEAN DEFAULT false
);
INSERT INTO users (login, password, age) VALUES
    ('username_1', 'password_1', 18),
    ('username_2', 'password_2', 22),
    ('username_3', 'password_3', 24),
    ('username_4', 'password_4', 38),
    ('simple_username_1', 'simple_password_1', 51),
    ('simple_username_2', 'simple_password_2', 52);
```

Confirm insert succeeded with

```SQL
SELECT * FROM users;
```

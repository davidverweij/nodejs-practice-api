# EPAM NodeJS Mentoring

> run `npm install` to retrieve all dependencies

### Task 1

- Task 1.1, run `npm run task11`. Reverses input text.
- Task 1.2, run `npm run task12`. Converts `csv/task12.csv` to `json` at `task12.txt`.
- Task 1.3, run `npm run build`. Compiles the task scripts for browser support, following the config in `babel.config.json`. Confirm compiled scripts still run, by invoking `npm run task11b` or `task12b` (`b` for `babel`).

### Task 2.1

Run `npm run task21`. Servers a CRUD API on [localhost:3000](localhost:3000). Endpoints available:

- `GET /allusers` to see all users currently in the DB (including their 'soft-delete' status).
- `GET /suggestusers?filter=substring&limit=3` to query the DB based on a `substring` for the users' `login` field, and a `limit` (optional) to narrow the search to the first 'x' amount of users in the DB.
- `GET /user/{id}` to get a user by ID. _ID must be a valid UUID string_.
- `POST /user` to create a user, returns the new user's `id`. Expected body:
  ```json
  {
    "login": "string", // should be between 6 and 30 characters (letters, digits or _), without spaces, and must start with a letter
    "password": "string", // should be between 8 and 30 alphanumeric characters (letters or digits) without punctuation or spaces'
    "age": "string" // should be a number between 3 and 131
  }
  ```
- `PUT /user/{id}` to update a user by ID. _ID must be a valid UUID string_.
  Expected body:
  ```json
  {
    "login": "string", // should be between 6 and 30 characters (letters, digits or _), without spaces, and must start with a letter
    "password": "string", // should be between 8 and 30 alphanumeric characters (letters or digits) without punctuation or spaces'
    "age": "string" // should be a number between 3 and 131
  }
  ```
- `DELETE /user/{id}` to (soft) delete a user by ID. _ID must be a valid UUID string_.

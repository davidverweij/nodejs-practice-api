# EPAM NodeJS Mentoring

> run `npm install` to retrieve all dependencies

### Task 1

- Task 1.1, run `npm run task11`. Reverses input text.
- Task 1.2, run `npm run task12`. Converts `csv/task12.csv` to `json` at `task12.txt`.

### REST CRUD Servicec

1. Copy the `.env.example` and rename it to `.env`,
1. Set up a local PostgreSQL DB, following the queries in [src/config/setup.sql](src/config/setup.sql),
1. Run the app with `npm run dev` - this enables _hot reloading_ whilst in development.
1. The app serves a CRUD API on [localhost:3000](localhost:3000) with the endpoints shown below.

##### Optional

```shell
npm run build        # transpile codebase for node deployment
npm run start        # run the transpiled codebase through node
npm run eslint       # dry run code linting and formatting with eslint
npm run prettier     # dry run code linting and formatting with prettier
npm run lint         # execute both eslint and prettier command
npm run eslint:fix   # auto-format with eslint (will write changes)
npm run prettier:fix # auto-format with prettier (will write changes)
npm run lint:fix     # execute both autoformattes eslint and prettier
```

#### User endpoints

```shell
GET    /user/all     # see all users in the SQL DB
GET    /user/suggest?filter={string}&limit={number} # find all users with `string` in their `login` field, and `limit` (optional) the results
PUT    /user/togroup # add multiple users to a permissions group
GET    /user/{id}    # get a user by UUID
POST   /user         # create a user, returns the UUID
PUT    /user/{id}    # update a user by UUID
DELETE /user/{id}    # soft-delete a user by ID
```

The `body` of the POST and PUT requests _for users_ should formatted as follows:

```js
{
  "login": "string", // should be between 6 and 30 characters (letters, digits or _), without spaces, and must start with a letter
  "password": "string", // should be between 8 and 30 alphanumeric characters (letters or digits) without punctuation or spaces
  "age": "string" // should be a number between 3 and 131
}
```

The `body` of the PUT requests _for adding users to groups_ should formatted as follows:

```js
{
  "groupId": "string",
  "userIds": ["string"]
}
```

#### Group endpoints

```shell
GET    /group/all    # see all groups in the SQL DB
GET    /group/{id}   # get a group by UUID
POST   /group        # create a group, returns the UUID
PUT    /group/{id}   # update a group by UUID
DELETE /group/{id}   # hard-delete a group by ID
```

The `body` of the POST and PUT requests _for groups_ should formatted as follows:

```js
{
  "name": "string",
  "persmissons": ["string"]
  // can be on or multiple of READ | WRITE | DELETE | SHARE | UPLOAD_FILES
}
```

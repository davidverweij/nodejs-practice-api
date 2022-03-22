-- setup a local PostgreSQL DB called `postgres`
-- create a user called `localhost` with password `password`
-- grant all privileges for accessing the DB, e.g.

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localhost;

-- create users table

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
    id uuid NOT NULL PRIMARY KEY,
    login VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    age SMALLINT NOT NULL,
    is_deleted BOOLEAN DEFAULT false
);

-- insert dummy data for users

INSERT INTO users (id, login, password, age) VALUES
    ('00129cda-f704-4c71-8e6e-d95bddac2344', 'username_1', 'password_1', 18),
    ('41621af1-e848-4de0-b63e-02acaf4364c7','username_2', 'password_2', 22),
    ('a16cf5b4-1cb7-4e6e-b559-f1895cd2f12b','username_3', 'password_3', 24),
    ('de00fb87-2064-404e-b410-cba699fb74b6','username_4', 'password_4', 38),
    ('62706979-7d28-44e1-8071-8c3c78e2e833','simple_username_1', 'simple_password_1', 51),
    ('7418447d-8ddc-4f3a-b54b-c35f76dbea2f','simple_username_2', 'simple_password_2', 52);

-- Confirm insert succeeded with

SELECT * FROM users;

-- create groups table

CREATE TYPE permission AS ENUM ('READ','WRITE','DELETE','SHARE','UPLOAD_FILES');
CREATE TABLE groups (
    id uuid NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL,
    permissions permission ARRAY NOT NULL
);

-- insert dummy data for groups

INSERT INTO groups (id, name, permissions) VALUES
    ('f1104537-45f3-41b9-b5a7-44e1d138b620','admin', ARRAY['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']::permission[]),
    ('b1d245b3-db33-4c47-a972-2cd8c9400f1c','reader', ARRAY['READ', 'SHARE']::permission[]);

-- create junction table for user-group relations (many2many)

CREATE TABLE usergroup (
  user_id uuid REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  group_id uuid REFERENCES groups (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT usergroup_id PRIMARY KEY (user_id, group_id)  -- explicit pk
);

-- create api-users (for authentication)

CREATE TABLE apiusers (
    id uuid NOT NULL PRIMARY KEY,
    login VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

-- insert dummy data for apiusers

INSERT INTO apiusers (id, login, password) VALUES
    ('0b0accf5-43f3-4fe4-9fa9-7c857ee36005','apiuser_1', '$2b$10$OcJkmW6SXDKciJIxtp4cX.CtVloOTmQ6DCISxmTCfgI.qzDqDB6sq');
    -- password is '1234' hashed
-- setup a local PostgreSQL DB called `postgres`
-- create a user called `localhost` with password `password`
-- grant all privileges for accessing the DB, e.g.

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localhost;

-- create users table

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    login VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    age SMALLINT NOT NULL,
    is_deleted BOOLEAN DEFAULT false
);

-- insert dummy data for users

INSERT INTO users (login, password, age) VALUES
    ('username_1', 'password_1', 18),
    ('username_2', 'password_2', 22),
    ('username_3', 'password_3', 24),
    ('username_4', 'password_4', 38),
    ('simple_username_1', 'simple_password_1', 51),
    ('simple_username_2', 'simple_password_2', 52);

-- Confirm insert succeeded with

SELECT * FROM users;

-- create groups table

CREATE TYPE permission AS ENUM ('READ','WRITE','DELETE','SHARE','UPLOAD_FILES');
CREATE TABLE groups (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    name VARCHAR NOT NULL,
    permissions permission ARRAY NOT NULL
);

-- insert dummy data for groups

INSERT INTO groups (name, permissions) VALUES
    ('admin', ARRAY['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']::permission[]),
    ('reader', ARRAY['READ', 'SHARE']::permission[]);

-- create junction table for user-group relations (many2many)

CREATE TABLE usergroup (
  user_id uuid REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  group_id uuid REFERENCES groups (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT usergroup_id PRIMARY KEY (user_id, group_id)  -- explicit pk
);

-- setup a local PostgreSQL DB called `postgres`
-- create a user called `localhost` with password `password`
-- grant all privileges for accessing the DB, e.g.

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localhost;

-- insert dummy data

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

-- Confirm insert succeeded with

SELECT * FROM users;
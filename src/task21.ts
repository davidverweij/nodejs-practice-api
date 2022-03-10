import express from 'express';
import Joi from 'joi';
import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation';
import { v4 as uuid } from 'uuid';

const app = express();
const validator = createValidator({});
const port = 3000;

app.disable('x-powered-by');
app.use(express.json());

// In-service memory user collection
const usersDB: DBUser[] = [];


/*
 * Schemas and types
 */

type User = {
    id: string,
    login: string,
    password: string,
    age: number,
}

type DBUser = User & { // intersect types to 'hide' isDeleted from API payload
    isDeleted: boolean
}

const idSchema = Joi.object({
    id: Joi.string().guid().required()
});

const userSchema = Joi.object({
    login: Joi.string().regex(/^[a-zA-Z]\w{5,29}$/).required()
        .messages({ // expand error message for clarity
            'string.pattern.base': 'login should be between 6 and 30 characters (letters, digits or _), without spaces, and must start with a letter'
        }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}/).required()
        .messages({ // expand error message for clarity
            'string.pattern.base': 'password should be between 8 and 30 alphanumeric characters (letters or digits) without punctuation or spaces'
        }),
    age: Joi.number().min(4).max(130).required() // number between 4 and 130
});

interface UserRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string,
        password: string,
        age: number
    }
}

const querySchema = Joi.object({
    filter: Joi.string().required(),
    limit: Joi.number().min(1)
});

interface QueryRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        filter: string,
        limit?: number
    }
}


/*
 * Helper methods
 */

/**
 * Filter soft-deleted users from the 'db'
 *
 * @param {String} id the id of the user to be found
 * @return {Number} the index of the user in the DB, or -1
 */
function findUserIndex(id) {
    const index = usersDB.findIndex(user => user.id === id);
    if (index >= 0 && !usersDB[index].isDeleted) {
        return index;
    }
    return -1;
}

/**
 * Retrieve (undeleted) users based on a filter
 *
 * Assumes (from task) that limit is applied to the source,
 * not the result after searching
 *
 * @param {String} loginSubstring the substring to filter user logins with
 * @param {Number} [limit=-1] limiter for search results
 * @return {[User]} list of users founds based on query
 */
function getAutoSuggestUsers(loginSubstring: string, limit: number = -1): User[] {

    const searchLimit = (limit > 0) ? limit : usersDB.length;

    const users = usersDB
        .filter(user => user.login.includes(loginSubstring))
        .map((user) => {
            // omit isDeleted from return payload
            const { isDeleted, ...rest } = user;
            return rest;
        })
        .slice(0, searchLimit);

    // return early if no matches found
    if (!users) return [];

    // compare login for sorting, case in-sensitive
    users.sort((a, b) => {
        const nameA = a.login.toUpperCase();
        const nameB = b.login.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    return users;
}


/*
 * API endpoints
 */

// Get copy of DB (for debugging/testing)
app.get('/allusers', (req, res) => {
    res.json(usersDB);
});

// Query DB based on substring for login
app.get('/suggestuser', validator.query(querySchema), (req: ValidatedRequest<QueryRequestSchema>, res) => {
    const { limit, filter } = req.query;
    if (filter) {
        return res.status(200).json(getAutoSuggestUsers(filter, limit));
    }
    return res.status(400).json({ message: 'Please include a \'filter=\' parameter. Optionally add a \'limit\'.' });
});

// Get user by ID
app.get('/user/:id', validator.params(idSchema), (req, res) => {
    const id = req.params.id;
    const userIndex = findUserIndex(id);
    if (userIndex >= 0) {
        const { isDeleted, ...user } = usersDB[userIndex];
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: `User '${id}' was not found.` });
    }
});

// Create user
app.post('/user', validator.body(userSchema), (req: ValidatedRequest<UserRequestSchema>, res) => {
    const newUser: DBUser = {
        id: uuid(),
        isDeleted: false,
        ...req.body
    };
    usersDB.push(newUser);
    res.status(201).json({ id: newUser.id });
});

// Update user by ID
app.put('/user/:id',
    validator.params(idSchema),
    validator.body(userSchema),
    (req: ValidatedRequest<UserRequestSchema>, res) => {
        const id = req.params.id;
        const userIndex = findUserIndex(id);

        if (userIndex >= 0) {
            const updateUser: DBUser = {
                id: id,
                isDeleted: false,
                ...req.body
            };
            usersDB[userIndex] = updateUser;
            res.status(204).send();
        } else {
            res.status(404).json({ message: `User '${id}' was not found.` });
        }
    });

// Soft-delete user by ID
app.delete('/user/:id', validator.params(idSchema), (req, res) => {
    const id = req.params.id;
    const userIndex = findUserIndex(id);

    if (userIndex >= 0) {
        // usersDB.splice(userIndex, 1)      // hard-delete option
        usersDB[userIndex].isDeleted = true; // soft-delete
        res.status(204).send();
    } else {
        res.status(404).json({ message: `User '${id}' was not found.` });
    }
});


/*
 * App init
 */

app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
});

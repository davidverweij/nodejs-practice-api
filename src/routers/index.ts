import express from 'express';

import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { v4 as uuid } from 'uuid';

import {
    User,
    DBUser,
    idSchema,
    userSchema,
    UserRequestSchema,
    querySchema,
    QueryRequestSchema
} from '../models';
import { getAutoSuggestUsers, findUserIndex, usersDB } from '../data-access';

export const userRoute = express.Router();

const validator = createValidator({});


/*
 * API endpoints
 */

// Get copy of DB (for debugging/testing)
userRoute.get('/all', (req, res) => {
    res.json(usersDB);
});

// Query DB based on substring for login
userRoute.get('/suggestuser', validator.query(querySchema), (req: ValidatedRequest<QueryRequestSchema>, res) => {
    const { limit, filter } = req.query;
    return res.status(200).json(getAutoSuggestUsers(filter, limit));
});

// Get user by ID
userRoute.get('/:id', validator.params(idSchema), (req, res) => {
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
userRoute.post('/', validator.body(userSchema), (req: ValidatedRequest<UserRequestSchema>, res) => {
    const newUser: DBUser = {
        id: uuid(),
        isDeleted: false,
        ...req.body
    };
    usersDB.push(newUser);
    res.status(201).json({ id: newUser.id });
});

// Update user by ID
userRoute.put('/:id',
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
userRoute.delete('/:id', validator.params(idSchema), (req, res) => {
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
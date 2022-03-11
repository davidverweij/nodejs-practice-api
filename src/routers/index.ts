
import express from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { v4 as uuid } from 'uuid';

import { idSchema, userSchema, UserRequestSchema, querySchema, QueryRequestSchema } from '../models';
import { findUserByID, createUser, updateUser, deleteUser, getAllUsers, getAutoSuggestUsers } from '../data-access';

export const userRoute = express.Router();

const validator = createValidator({});

// Get copy of DB (for debugging/testing)
userRoute.get('/all', async (req, res) => {
    const dbCopy = await getAllUsers();
    res.status(200).json(dbCopy);
});

// Query DB based on substring for login
userRoute.get('/suggestuser', validator.query(querySchema), async (req: ValidatedRequest<QueryRequestSchema>, res) => {
    const { limit, filter } = req.query;
    const result = await getAutoSuggestUsers(filter, limit);
    return res.status(200).json(result);
});

// Get user by ID
userRoute.get('/:id', validator.params(idSchema), async (req, res) => {
    const user = await findUserByID(req.params.id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: `User '${req.params.id}' was not found.` });
    }
});

// Create user
userRoute.post('/', validator.body(userSchema), async (req: ValidatedRequest<UserRequestSchema>, res) => {
    const { login, password, age } = req.body;
    const userId = await createUser(login, password, age);
    res.status(201).json({ id: userId });
});

// Update user by ID
userRoute.put('/:id', validator.params(idSchema), validator.body(userSchema),
    async (req: ValidatedRequest<UserRequestSchema>, res) => {
        const { login, password, age } = req.body;
        const success = await updateUser(req.params.id, login, password, age);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: `User '${req.params.id}' was not found.` });
        }
    });

// Soft-delete user by ID
userRoute.delete('/:id', validator.params(idSchema), async (req, res) => {
    const success = await deleteUser(req.params.id);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: `User '${req.params.id}' was not found.` });
    }
});
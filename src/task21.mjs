import express from 'express';
import { v4 as uuid } from 'uuid';

const app = express();
const port = 3000;

// In-service memory user collection
const users = [];

// helper method to filter soft-deleted users from the 'db'
function findUserIndex(id) {
    const index = users.findIndex(user => user.id === id)
    if (index >= 0 && !users[index].isDeleted) {
        return index;
    }
    return -1; // same return as not found by 'findIndex'
}

// type User = {
//     id: string;
//     login: string;
//     password: string;
//     age: string;
//     isDeleted: boolean;
// }

// Config
app.use(express.json())

// TEST METHOD, GET LIST OF USERS!
app.get('/all', (req, res) => {
    res.json(users);
});

// Get user by ID
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const userIndex = findUserIndex(id);
    if (userIndex >= 0) {
        res.status(200).json(users[userIndex]);
    } else {
        res.status(404).json({ message: `User '${id}' was not found.` })
    }
});

// Create user
app.post('/user', (req, res) => {
    const newUser = req.body;
    newUser.id = uuid();
    users.push(newUser);
    res.status(201).json({ id: newUser.id });
})

// Update user by ID
app.put('/user/:id', (req, res) => {
    const id = req.params.id;
    const userIndex = findUserIndex(id);

    if (userIndex >= 0) {
        const updateUser = req.body;
        updateUser.id = id;
        users[userIndex] = updateUser;
        res.status(204).send();
    } else {
        res.status(404).json({ message: `User '${id}' was not found.` })
    }
});

// Delete user by ID
app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    const userIndex = findUserIndex(id);

    if (userIndex >= 0) {
        // users.splice(userIndex, 1)      // hard-delete option
        users[userIndex].isDeleted = true; // soft-delete
        res.status(204).send();
    } else {
        res.status(404).json({ message: `User '${id}' was not found.` })
    }
});

app.listen(port, () => { console.log(`Server is listening on localhost:${port}`) });
import express from 'express';
import { v4 as uuid } from 'uuid';

const app = express();
const port = 3000;

const users = [];

// type User = {
//     id: string;
//     login: string;
//     password: string;
//     age: string;
//     isDeleted: boolean;
// }

// Config
app.use(express.json())

// Get user by ID
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id === id);
    if (user) {
        res.status(200).json(user);
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
    const user = users.findIndex(user => user.id === id);

    console.log(user);

    if (user >= 0) {
        const updateUser = req.body;
        updateUser.id = id;
        users[user] = updateUser;
        res.status(204).send();
    } else {
        res.status(404).json({ message: `User '${id}' was not found.` })
    }
});

// TEST METHOD, GET LIST OF USERS!
app.get('/all', (req, res) => {
    res.json(users);
});


app.listen(port, () => { console.log(`Server is listening on localhost:${port}`) });
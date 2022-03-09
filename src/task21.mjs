import express from 'express';
import { v4 as uuid } from 'uuid';

const app = express();
const port = 3000;
app.disable('x-powered-by')

// In-service memory user collection
const usersDB = [];

// helper method to filter soft-deleted users from the 'db'
function findUserIndex(id) {
    const index = usersDB.findIndex(user => user.id === id)
    if (index >= 0 && !users[index].isDeleted) {
        return index;
    }
    return -1; // same return as not found by 'findIndex'
}

// helper method to retrieve (undeleted) users based on a filter
function getAutoSuggestUsers(loginSubstring, limit = -1) {
    // NOTE: Assumed from instructions that limit is applied
    // to the source, not the result after searching

    // limit search, ignores 0, negative limits, nulls and NaNs
    const searchLimit = (limit > 0) ? limit : usersDB.length;
    console.log(searchLimit);

    let users = usersDB
        .slice(0, searchLimit)
        .filter(user => user.login.includes(loginSubstring));

    console.log(users);
    // return early if no matches found
    if (!users) return []

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

// type User = {
//     id: string;
//     login: string;
//     password: string;
//     age: string;
//     isDeleted: boolean;
// }

// Config
app.use(express.json())


// Get 'database' (for testing)
app.get('/allusers', (req, res) => {
    res.json(usersDB);
});

app.get('/suggestuser', (req, res) => {
    const { limit, filter } = req.query;
    if (filter) {
        return res.status(200).json(getAutoSuggestUsers(filter, parseInt(limit)));
    }
    return res.status(400).json({ message: 'Please include a \'filter=\' parameter. Optionally add a \'limit\'.' })
});


// Get user by ID
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const userIndex = findUserIndex(id);
    if (userIndex >= 0) {
        res.status(200).json(usersDB[userIndex]);
    } else {
        res.status(404).json({ message: `User '${id}' was not found.` })
    }
});

// Create user
app.post('/user', (req, res) => {
    const newUser = req.body;
    newUser.id = uuid();
    usersDB.push(newUser);
    res.status(201).json({ id: newUser.id });
})

// Update user by ID
app.put('/user/:id', (req, res) => {
    const id = req.params.id;
    const userIndex = findUserIndex(id);

    if (userIndex >= 0) {
        const updateUser = req.body;
        updateUser.id = id;
        usersDB[userIndex] = updateUser;
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
        // usersDB.splice(userIndex, 1)      // hard-delete option
        usersDB[userIndex].isDeleted = true; // soft-delete
        res.status(204).send();
    } else {
        res.status(404).json({ message: `User '${id}' was not found.` })
    }
});

app.listen(port, () => { console.log(`Server is listening on localhost:${port}`) });
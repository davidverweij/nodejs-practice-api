import express from 'express';

import { userRoute } from './routers/users';

const app = express();
const port = 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use('/user', userRoute);


/*
 * App init
 */

app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
});

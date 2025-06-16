// index.ts
import { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import * as express from 'express';
import { resolve } from 'path';

import { HOST, PORT } from './constants';

import { apiKeyRoute, modRoute } from './routes';
import { connectDB } from './database';
import { ExpressError } from './types';
import morgan = require('morgan');

connectDB()
const app = express();

// app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.sendFile(resolve('pages/welcome.html'));
});

app.use('/apikeys', apiKeyRoute);
app.use('/mods', modRoute);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ExpressError) res.status(err.status).json(err.json);
    else if (err) res.status(500).json({ status: "500", message: err.message });
    else next();
});

app.listen(PORT, HOST, () => {
    console.log(`Server started on port ${PORT}`);
});


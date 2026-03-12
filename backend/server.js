import './env.js'

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

const dbUrl = process.env.MONGO_URL;

app.use('/', userRoutes);
app.use('/', postRoutes);
app.use(express.static('uploads'));

const start = async () => {
    await mongoose.connect(dbUrl);
    app.listen(9080, () => {
        console.log("Server is running on port 9080");
    });
}
start();
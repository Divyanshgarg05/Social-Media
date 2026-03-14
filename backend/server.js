// All static imports first
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

// Then load dotenv only in development
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();
app.use(cors());
app.use(express.json());

const dbUrl = process.env.MONGO_URL;
console.log("MONGO_URL value:", dbUrl);
app.use('/', userRoutes);
app.use('/', postRoutes);

const start = async () => {
    await mongoose.connect(dbUrl);
    app.listen(9080, () => {
        console.log("Server is running on port 9080");
    });
}
start();

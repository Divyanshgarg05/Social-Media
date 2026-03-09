import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dbUrl = process.env.MONGO_URL;

// Make sure routes are registered
app.use('/', userRoutes);  // Add explicit prefix
app.use('/', postRoutes);
app.use(express.static('uploads'));

const start = async () => {
    const connectDb = await mongoose.connect(dbUrl)
    
    app.listen(9080, () => {
        console.log("Server is running on port 9080");
    })
}
start();
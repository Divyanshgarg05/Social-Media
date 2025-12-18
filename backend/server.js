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

app.use(postRoutes);
app.use(userRoutes);


const start = async () => {

    const connectDb = await mongoose.connect("mongodb+srv://divyanshgarg844_db_user:Divyansh%4087@socialmedia.1huoxaq.mongodb.net/?appName=SocialMedia")

    app.listen(9080, () => {
        console.log("Server is running on port 9080");
    })

}
start();
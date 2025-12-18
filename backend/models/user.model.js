import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },
    Password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'default.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: ''
    }
});

const User = mongoose.model("User", userSchema);

export default User;
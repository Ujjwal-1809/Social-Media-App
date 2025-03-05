import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        minlength: 5
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    profileImg:{
        type: String,
        default: ""
    },
    
    bio:{
        type: String,
        default: ""
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // Stores user IDs who follow this user
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordExpires: { type: Date }, // Expiry time for the reset token

}, {timestamps: true});

export default mongoose.model("User", userSchema);
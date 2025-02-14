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
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordExpires: { type: Date }, // Expiry time for the reset token

}, {timestamps: true});

export default mongoose.model("User", userSchema);
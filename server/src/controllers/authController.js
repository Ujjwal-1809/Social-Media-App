import { generateToken } from '../lib/utils.js';
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS // Replace with your email password
    }
});



export async function handleSignup(req, res) {
    const { username, email, password } = req.body;

    try { 
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.trim().length < 8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters." });
        }
        const user = await User.findOne({ username });
        const userEmail = await User.findOne({ email });
        
        if (user) {
            return res.status(400).json({ message: "Username already exists." })
        }
        if (userEmail) {
            return res.status(400).json({ message: "Email already exists." })
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save(); // save the user to the database.

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            })
        } else {
            res.status(400).json('Invalid User Data')
        }
    } catch (error) {
        console.log('error in signup controller', error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (user) {
            const isCorrectPassword = await bcrypt.compare(password, user.password);
            if (isCorrectPassword) {
                generateToken(user._id, res);

                res.status(201).json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                })
            }
            else {
                return res.status(400).json({ message: "Invalid credentials" })
            }
        }
        else {
            return res.status(400).json({ message: "Invalid credentials" })
        }
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export function handleLogout(req, res) {
try {
res.cookie("token", "", {maxAge:0})
res.status(200).json({ message: "Logged out successfully" })
} catch (error) {
    console.log("error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" })
}}



export function checkAuth(req, res) {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error in Check auth controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1-hour expiry
        await user.save();

        // Send email with reset link
        const resetLink = `https://67af0b3fe14ac946cba92724--brilliant-belekoy-9056e5.netlify.app/reset-password/${resetToken}`;
        const mailOptions = {
            from: `Social-media-app ${process.env.EMAIL_USER}`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Click the link below to reset your password:</p>
            <p><a href="${resetLink}" target="_blank" style="color: blue; text-decoration: underline;">Reset Password</a></p>
            <p>If you didn't request this, please ignore this email.</p>`,       };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset link sent to your email." });
    } catch (error) {
        console.error("Error in forgot password controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// **Reset Password Controller**
export async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token is not expired
        }).select("+resetPasswordToken"); // Ensure token is fetched

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successfully. Please login with your new password." });

    } catch (error) {
        console.error("Error in reset password controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

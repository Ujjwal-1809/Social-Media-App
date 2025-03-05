import { generateToken } from '../lib/utils.js';
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import cloudinary from '../lib/cloudinary.js'

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
        if (username.trim().length < 5) {
            return res.status(400).json({ message: "Username must be atleast 5 characters." });
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
                profileImg: newUser.profileImg
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
                    profileImg: user.profileImg
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
        res.clearCookie("token", {
            httpOnly: true,
            secure: true, 
            sameSite: "none" 
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function updateProfilePic(req, res){
    try {
        const {profileImg} = req.body;
        const userId = req.user._id; // got the .user from protectRoute, where we have added the user property.
        if (!profileImg) {
            return res.status(400).json({message: "Profile pic is required"})
        }
    
        const uploadResponse = await cloudinary.uploader.upload(profileImg)
        const updatedUser = await User.findByIdAndUpdate(userId, {profileImg: uploadResponse.secure_url},{new:true})
    
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in update profile controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
    };

    export async function updateProfile(req, res) { 
        try {
            const { username, bio } = req.body;
            const userId = req.user._id; 
    
            // Check if username is already taken by another user (excluding current user)
            const existingUser = await User.findOne({ username });
            
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return res.status(400).json({ message: "Username already exists." });
            }
    
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { username, bio },
                { new: true } // Return updated user
            );
    
            if (!updatedUser) return res.status(404).json({ message: "User not found" });
    
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Error updating profile", error });
        }
    }
    

export async function handleFollow(req, res) {
    try {
        const { userId } = req.params; // User to follow
        const authUserId = req.user.id; // Logged-in user

        if (userId === authUserId) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const userToFollow = await User.findById(userId);
        let authUser = await User.findById(authUserId);

        if (!userToFollow || !authUser) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!userToFollow.followers.includes(authUserId)) { // if current authenticated userId is not inside the followers list of searched user! 
            userToFollow.followers.push(authUserId); // then push the authUserId into searched user's followers list.
            authUser.following.push(userId); // push the searched user's Id into the following list of current autheticated user.

            await userToFollow.save(); // save the changes in database.
            await authUser.save();
        } else {
            return res.status(400).json({ message: "You already follow this user." });
        }

        // Re-fetch authUser with populated followers & following
        authUser = await User.findById(authUserId)
            .populate("followers", "username _id profileImg")
            .populate("following", "username _id profileImg");

        res.status(200).json({
            message: "User followed successfully",
            updatedAuthUser: authUser,
            updatedFollowedUser: userToFollow,
        });
    } catch (error) {
        res.status(500).json({ message: "Error following user", error });
    }
};

/* If we had populated authUser in the first query (before updating the lists and saving the changes),
 we would still be working with the old data, meaning the following list wouldn’t include the newly 
 followed user.

By re-fetching and populating after saving, we ensure that:

1. The authUser.following list includes the newly followed user.
2. The authUser object returned to the frontend has the latest populated followers and following lists.

So, the first findById is just to check and update, while the second findById().populate() ensures
 we send the correct updated data back to the client. */

  
export async function handleUnfollow(req, res) {
    try {
        const { userId } = req.params;
        const authUserId = req.user.id;

        const userToUnfollow = await User.findById(userId);
        let authUser = await User.findById(authUserId);

        if (!userToUnfollow || !authUser) {
            return res.status(404).json({ message: "User not found." });
        }

        if (userToUnfollow.followers.includes(authUserId)) {
            userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== authUserId);
            authUser.following = authUser.following.filter(id => id.toString() !== userId);

            await userToUnfollow.save();
            await authUser.save();
        } else {
            return res.status(400).json({ message: "You are not following this user." });
        }

        // Re-fetch authUser with populated followers & following
        authUser = await User.findById(authUserId)
            .populate("followers", "username _id profileImg")
            .populate("following", "username _id profileImg");

        res.status(200).json({
            message: "User unfollowed successfully",
            updatedAuthUser: authUser,
            updatedUnfollowedUser: userToUnfollow,
        });
    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user", error });
    }
}


  export async function checkAuth(req, res) {
    try {
        const authUser = await User.findById(req.user._id)
            .populate("followers", "username _id profileImg")
            .populate("following", "username _id profileImg");

        if (!authUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(authUser);
    } catch (error) {
        console.log("Error in Check Auth controller", error.message);
        res.status(500).json({ message: "Internal server error" });
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
        const resetLink = `https://67c8c815ecf7d40008c50e0f--clinquant-daifuku-1623f6.netlify.app/reset-password/${resetToken}`;
        const mailOptions = {
            from: `ConnectMe <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Reset Your Password - ConnectMe",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                <p style="color: #555; font-size: 16px;">
                    Hello, 
                </p>
                <p style="color: #555; font-size: 16px;">
                    We received a request to reset your password for your <strong>ConnectMe</strong> account. Click the button below to reset your password:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" target="_blank" 
                       style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007BFF; 
                              text-decoration: none; border-radius: 5px;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #555; font-size: 16px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <p style="color: #777; font-size: 14px; text-align: center; margin-top: 20px;">
                    This link will expire in 30 minutes for security reasons.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #777; font-size: 14px; text-align: center;">
                    Need help? Contact our support team at <a href="mailto:support@connectme.com" style="color: #007BFF;">support@connectme.com</a>.
                </p>
            </div>`
        };
        

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

export const getUserList = async(req,res) => {
    try {
        const users = await User.find().select("-password"); // find all user except the current logged in user, because in the userlist we probably don't want our own name.
        return res.status(200).json(users)
    } catch (error) {
        console.log("error in user list controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
    }

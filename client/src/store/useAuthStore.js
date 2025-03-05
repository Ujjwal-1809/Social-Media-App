import { create } from "zustand";
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfilePic: false,
    isSendingResetLink:false,
    isResettingPassword:false,
    users: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    
    getUsers: async () => {
        try {
            const res = await axiosInstance.get("/auth/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data })
            toast.success("Account created successfully");

        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in signup", error);
        }
        finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post('/auth/login', data)
            set({ authUser: res.data })
            toast.success("Logged In successfully");

        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logged Out Successfully");

        } catch (error) {
            toast.error("Failed to logout")
        }
    },

    updateProfilePic: async(data) => {
        set({ isUpdatingProfilePic: true });
        try {
            const res = await axiosInstance.put('/auth/profile-image', data)
            set({ authUser: res.data })
        toast.success("Profile pic updated!")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({ isUpdatingProfilePic: false })
        }},
        
        updateProfile: async (data) => { 
            set({ isUpdatingProfile: true });
        
            try {
                const res = await axiosInstance.put('/auth/update-profile', data);
                
                // Updating the authUser state with the new profile data
                set({ authUser: res.data });
        
                toast.success("Profile updated successfully!");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to update profile.");
            } finally {
                set({ isUpdatingProfile: false });
            }
        },        

         // FOLLOW & UNFOLLOW FUNCTIONALITY
         followUser: async (userId) => {
            try {
                const res = await axiosInstance.put(`/auth/${userId}/follow`);
                set({ authUser: res.data.updatedAuthUser }); // this updatedAuthUser is coming from backend authController.js, basically it contains the updated authUser's data including newly followed users.
            } catch (error) {
                console.error("Error in followUser:", error.response?.data);
            }
        },
        

        unfollowUser: async (userId) => {
            try {
                const res = await axiosInstance.put(`/auth/${userId}/unfollow`);
                set({ authUser: res.data.updatedAuthUser });
            } catch (error) {
                console.error("Error in unfollowUser:", error);
                toast.error(error.response?.data?.message || "Failed to unfollow user");
            }
        },
        

    forgotPassword: async (email) => { 
        set({ isSendingResetLink:true })
        try {
            const res = await axiosInstance.post("/auth/forgot-password", { email });
            toast.success(res.data.message || "Password reset link sent to your email");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log("Error in forgotPassword:", error);
        }
    finally {
        set({ isSendingResetLink:false })
    }
    },

    resetPassword: async (token, newPassword) => {
        set({ isResettingPassword: true })
        try {
            const res = await axiosInstance.post(`/auth/reset-password/${token}`, { newPassword });
    
            toast.success(res.data.message); // Show success message
            return true; // Indicate success (useful for redirection)
    
        } catch (error) {
            console.error("Error in resetPassword:", error);
            toast.error(error.response?.data?.message || "Failed to reset password");
            return false; // Indicate failure
        }
        finally{
            set({ isResettingPassword: false })

        }
    }
    
    
}))

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import useThemeStore from '../store/useThemeStore'
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function ResetPassword() {
    const { resetPassword, isResettingPassword } = useAuthStore();
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const { theme } = useThemeStore()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        const success = await resetPassword(token, newPassword);

        if (success) {
            navigate("/login"); // Redirect to login after successful reset
        }
    };

    return (
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-zinc-200'} flex flex-col items-center justify-center h-screen`}>
           <div className={`${theme === 'dark' ? 'bg-black text-white border border-slate-700' : 'bg-white'} flex flex-col items-center justify-center p-8 shadow-2xl h-[50%] w-[80%] sm:w-[60%] xl:w-[30%]`}>
           <h2 className="text-xl font-semibold mb-4">Reset your Password</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                    minLength='8'
                    type="password" 
                    placeholder="Enter new password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="border p-2 rounded outline-1 -outline-offset-1 outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400"
                    required
                />
                <button type="submit" disabled={isResettingPassword} className="cursor-pointer flex justify-center items-center w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                {isResettingPassword ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                    </button>
            </form>
           </div>
        </div>
    );
}

export default ResetPassword;

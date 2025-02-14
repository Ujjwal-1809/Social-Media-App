import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function ResetPassword() {
    const { resetPassword } = useAuthStore();
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    console.log("Token from URL:", token); // Debugging

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
        <div className="flex flex-col items-center justify-center h-screen">
           <div className="flex flex-col items-center justify-center bg-slate-200 p-8 shadow-2xl h-[80%]">
           <h2 className="text-xl font-semibold mb-4">Reset your Password</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                    type="password" 
                    placeholder="Enter new password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="border p-2 rounded focus:outline-indigo-600"
                    required
                />
                <button type="submit" className="cursor-pointer bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Reset Password</button>
            </form>
           </div>
        </div>
    );
}

export default ResetPassword;

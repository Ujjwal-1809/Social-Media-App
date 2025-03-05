import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import useThemeStore from "../store/useThemeStore";

function ForgotPassword() {
  const { forgotPassword, isSendingResetLink } = useAuthStore();
  const [email, setEmail] = useState("");
  const { theme } = useThemeStore()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");
    await forgotPassword(email);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-200'} min-h-screen flex items-center justify-center px-4`}>
      <div className={`${theme === 'dark' ? 'bg-black text-white border border-slate-700' : 'bg-white text-gray-800'} shadow-lg rounded-lg p-6 w-full max-w-md`}>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
          <button
            type="submit"
            className="cursor-pointer flex justify-center items-center w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            disabled={isSendingResetLink}
          >
            {isSendingResetLink ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

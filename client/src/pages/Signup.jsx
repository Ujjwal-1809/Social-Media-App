import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import useThemeStore from "../store/useThemeStore";

export default function Login() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const { signup, isSigningUp } = useAuthStore();
    const { theme } = useThemeStore()

    const handleSubmit = async (e) => {
        e.preventDefault();
        signup(formData);
    };

    return (
        <>
            <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex h-screen flex-1 flex-col justify-start pb-5 p-4`}>
                <h1 className="flex items-center gap-x-3 text-xl sm:text-3xl font-extrabold font-serif text-white drop-shadow-lg tracking-wide">
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        ConnectMe
                    </span>
                    <i
                        className="fa-solid fa-earth-americas text-xl sm:text-3xl"
                        style={{
                            animation: "colorPulse 2s infinite ease-in-out",
                        }}
                    ></i>

                    {/* Define keyframes directly inside JSX */}
                    <style>
                        {`
      @keyframes colorPulse {
        0% { color: #008000; }  
        50% { color: #1e90ff; } 
        100% { color: #008000; } 
      }
    `}

                    </style>
                </h1>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className={`${theme === "dark" ? 'text-white' : 'text-gray-900'} mt-10 text-center text-2xl/9 font-bold tracking-tight`}>
                        Create your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    placeholder="John_Doe"
                                    required
                                    autoComplete="off"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={`${theme === 'dark' ? 'text-gray-100 bg-black' : 'text-gray-900 bg-white'} block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    placeholder="example12@gmail.com"
                                    type="email"
                                    required
                                    autoComplete="off"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`${theme === 'dark' ? 'text-gray-100 bg-black' : 'text-gray-900 bg-white'} block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium">
                                    Password
                                </label>

                            </div>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="off"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`${theme === 'dark' ? 'text-gray-100 bg-black' : 'text-gray-900 bg-white'} block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className={`${theme === 'dark' ? 'text-white' : 'text-slate-700'} h-5 w-5 text-base-content/40`} />
                                    ) : (
                                        <Eye className={`${theme === 'dark' ? 'text-white' : 'text-slate-700'} h-5 w-5 text-base-content/40`} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                disabled={isSigningUp}>
                                {isSigningUp ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-5 text-center text-sm/6 text-gray-500">
                        Already a member?{' '}
                        <Link to="/login" className="font-semibold text-indigo-500 hover:text-indigo-600">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}

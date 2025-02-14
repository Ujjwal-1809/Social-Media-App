import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);


    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <i className="fa-solid fa-camera text-center w-full text-4xl text-blue-700"></i>
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    placeholder="John_Doe"
                                    required
                                    autoComplete="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            
                            <div className="mt-2 relative">
                            <input
                                    id="password"
                                    name="password"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                   <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                disabled={isLoggingIn}>
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '}
                        <Link to="/signup" className="font-semibold text-indigo-500 hover:text-indigo-600">
                           Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}

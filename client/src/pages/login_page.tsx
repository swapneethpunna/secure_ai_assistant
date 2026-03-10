import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";


const LoginCard = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const containsMaliciousInput = (input: string) => {
        const patterns = [
            /<script.*?>.*?<\/script>/gi,
            /('|--|;|\/\*|\*\/|xp_)/gi,
            /(\b(SELECT|INSERT|DELETE|DROP|UPDATE|UNION|OR|AND)\b)/gi
        ];
        return patterns.some((pattern) => pattern.test(input));
    };
    
    const handleCreateAccount = () => {
        navigate("/register");
    };
    const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        if (containsMaliciousInput(email) || containsMaliciousInput(password)) {
            setError("Invalid characters detected");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: email,
                    password: password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const token = response.data.token;
            // Store JWT token
            localStorage.setItem("token", token);
            // Navigate to home
            navigate("/home");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response) {
                setError(error.response.data.message || "Login failed");
            } else {
                setError("Server not responding");
            }
        }
    };



    return (
        <div className="login-wrapper">
            {/* Brand */}
            <div className="login-brand">
                <div className="login-brand-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <span className="login-brand-name">SecureAI</span>
            </div>

            {/* Card */}
            <div className="login-card">

                <div className="login-card-header">
                    <h2>Welcome back</h2>
                    <p>Sign in to your account</p>
                </div>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div className='fields-align'>
                    <div className="login-field">
                        <label>Email</label>
                        <div className="login-input-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="login-field">
                        <label>Password</label>
                        <div className="login-input-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button className="login-submit" onClick={handleSignIn}>
                    Sign In
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>

                <p className="login-footer">
                    Don't have an account?
                    <span
                        style={{ cursor: "pointer", color: "#4F46E5", marginLeft: "5px" }}
                        onClick={handleCreateAccount}
                    >
                        Create account
                    </span>
                </p>

            </div>
        </div>
    )
}

export default LoginCard
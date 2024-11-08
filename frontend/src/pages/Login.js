import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) return handleError('Email and password are required');
        
        try {
            const response = await fetch(`${APIUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo),
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;

            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => navigate('/home'), 1000);
            } else {
                handleError(error?.details[0].message || message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="login-form">
                <label>Email
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={loginInfo.email}
                    />
                </label>
                <label>Password
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={loginInfo.password}
                    />
                </label>
                <button type="submit" className="login-button">Login</button>
                <span className="signup-prompt">
                    Don’t have an account? <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email, and password are required');
        }
        try {
            const url = `${APIUrl}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                setTimeout(() => navigate('/login'), 1000);
            } else {
                handleError(result.message || result.error?.details[0]?.message);
            }
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div className='signup-container'>
            <h1>Signup</h1>
            <form className="signup-form" onSubmit={handleSignup}>
                <label htmlFor='name'>Name</label>
                <input
                    onChange={handleChange}
                    type='text'
                    name='name'
                    placeholder='Enter your name...'
                    value={signupInfo.name}
                />
                <label htmlFor='email'>Email</label>
                <input
                    onChange={handleChange}
                    type='email'
                    name='email'
                    placeholder='Enter your email...'
                    value={signupInfo.email}
                />
                <label htmlFor='password'>Password</label>
                <input
                    onChange={handleChange}
                    type='password'
                    name='password'
                    placeholder='Enter your password...'
                    value={signupInfo.password}
                />
                <button type='submit' className='signup-button'>Signup</button>
                <p className="login-prompt">Already have an account? <Link to="/login">Login</Link></p>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Signup;

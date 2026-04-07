import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';                // Task 3
import { useAppContext } from '../../context/AuthContext';     // Task 2
import { urlConfig } from '../../config';                      // Task 1
import './LoginPage.css';

function LoginPage() {
    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');            // Task 4: state for error message

    // Navigation and context
    const navigate = useNavigate();                             // Task 5
    const { setIsLoggedIn } = useAppContext();                 // Task 5
    const bearerToken = sessionStorage.getItem('auth-token');   // Task 5

    // Redirect if user already logged in
    useEffect(() => {                                         // Task 6
        if (bearerToken) {
            setIsLoggedIn(true);
            navigate('/app');
        }
    }, [bearerToken, navigate, setIsLoggedIn]);

     // Handle login action
     const handleLogin = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                // Task 7: Set method
                method: 'POST',

                // Task 8: Set headers
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
                },

                // Task 9: Set body
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            // Step 2 - Task 1: Access JSON data
            const json = await response.json();

            // Step 2 - Tasks 2–4: Set session + login + navigate
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);

                setIsLoggedIn(true);
                navigate('/app');
            } 
            // Step 2 - Task 5: Handle incorrect login
            else {
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";

                setIncorrect("Wrong password. Try again.");

                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }

        } catch (e) {
            console.log("Error fetching details: " + e.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* Email Input */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Task 6: Error message display */}
                        <span style={{
                            color: 'red',
                            height: '.5cm',
                            display: 'block',
                            fontStyle: 'italic',
                            fontSize: '12px'
                        }}>
                            {incorrect}
                        </span>

                        {/* Login Button */}
                        <button 
                            className="btn btn-primary w-100 mb-3" 
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here? 
                            <a href="/app/register" className="text-primary"> Register Here</a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
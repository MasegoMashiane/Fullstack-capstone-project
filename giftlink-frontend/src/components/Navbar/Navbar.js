import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { urlConfig } from '../../config';

export default function Navbar() {
    
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    // Check session storage to set user info on mount
    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');

        if (authTokenFromSession) {
            if (isLoggedIn && nameFromSession) {
                setUserName(nameFromSession);
            } else {
                sessionStorage.removeItem('auth-token');
                sessionStorage.removeItem('name');
                sessionStorage.removeItem('email');
                setIsLoggedIn(false);
            }
        }
    }, [isLoggedIn, setIsLoggedIn, setUserName]);

    // Logout function
    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        navigate('/app');
    };

    // Navigate to profile
    const profileSection = () => {
        navigate('/app/profile');
    };
     
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href={`${urlConfig.backendUrl}/app`}>GiftLink</a>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app/gifts">Gifts</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app/search">Search</a>
                    </li>

                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <span
                                    className="nav-link"
                                    style={{ color: "black", cursor: "pointer" }}
                                    onClick={profileSection}
                                >
                                    Welcome, {userName}
                                </span>
                            </li>
                            <li className="nav-item">
                                <span
                                    className="nav-link login-btn"
                                    style={{ cursor: "pointer" }}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <a className="nav-link login-btn" href="/app/login">Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link register-btn" href="/app/register">Register</a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
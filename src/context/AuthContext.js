import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => localStorage.getItem('isAuthenticated') === 'true'
    );

    useEffect(() => {
        // Initialize isAuthenticated from localStorage
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth) {
            setIsAuthenticated(storedAuth === 'true');
        }
    }, []);

    const login = (username, password) => {
        // Placeholder for real authentication
        if (username === 'admin' && password === 'password') {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

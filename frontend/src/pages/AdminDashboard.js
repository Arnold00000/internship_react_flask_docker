import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [data, setData] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post('/api/login', { email, password });
            const { access_token } = response.data;
            setToken(access_token);
            localStorage.setItem('token', access_token);
            setIsLoggedIn(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <h2>Admin Dashboard</h2>
                    <ul>
                        {data.map((d, index) => (
                            <li key={index}>{d.tac} - {new Date(d.created_at).toLocaleString()}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <label>
                            Email:
                            <input type="email" name="email" />
                        </label>
                        <label>
                            Password:
                            <input type="password" name="password" />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

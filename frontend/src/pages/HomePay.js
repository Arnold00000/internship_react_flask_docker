import React, { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [tac, setTac] = useState('');
    const [prediction, setPrediction] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/predict', { tac }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Home Page</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter TAC:
                    <input type="text" value={tac} onChange={(e) => setTac(e.target.value)} />
                </label>
                <button type="submit">Predict</button>
            </form>
            {prediction && (
                <div>
                    <h3>Prediction</h3>
                    <p>{prediction}</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;

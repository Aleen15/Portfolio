import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router
import './CreatePortfolio.css';

const CreatePortfolio = ({ userId }) => {
    const [portfolioName, setPortfolioName] = useState('');
    const [investmentAgenda, setInvestmentAgenda] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            portfolioName,
            investmentAgenda,
        };

        try {
            const response = await fetch(`/portfolios/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Portfolio created successfully!');
                setErrorMessage('');
                setPortfolioName('');
                setInvestmentAgenda('');

                // Redirect to portfolio page after 2 seconds
                setTimeout(() => {
                    navigate('/portfolio');
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'An error occurred.');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="form-container">
            <h2>Create Portfolio</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="portfolioName">Portfolio Name:</label>
                <input
                    type="text"
                    id="portfolioName"
                    name="portfolioName"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    required
                />

                <label htmlFor="investmentAgenda">Investment Agenda:</label>
                <textarea
                    id="investmentAgenda"
                    name="investmentAgenda"
                    value={investmentAgenda}
                    onChange={(e) => setInvestmentAgenda(e.target.value)}
                    required
                />

                <button type="submit">Submit</button>
            </form>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default CreatePortfolio;

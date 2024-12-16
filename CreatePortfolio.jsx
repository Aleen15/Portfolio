import React, { useState } from 'react';
import './CreatePortfolio.css'
import { Navigate } from 'react-router-dom';

const CreatePortfolio = ({ userId }) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [investmentAgenda, setInvestmentAgenda] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Example validation
    if (!portfolioName || !investmentAgenda) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Reset error message on successful submission
    setErrorMessage('');

    // Simulating a successful portfolio creation
    setSuccessMessage('Portfolio created successfully!');
    
    // You can handle API call here for actual portfolio creation
    // Example: axios.post('/api/create-portfolio', { userId, portfolioName, investmentAgenda })
  };

  return (
    <div  >
      <div className='create-portfolio-container'>
        <h2>Create Portfolio</h2>
        <form onSubmit={handleSubmit} className='form-group'>
          {/* Hidden input for userId */}
          <input type="hidden" value={userId} />
          
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

        <div className='button-group'>
          <button type="btn save-btn" className='btn save-btn'>Save</button>
          <button type="btn cancel-btn" className='btn cancel-btn'>Cancel</button>
          </div>
        </form>

        {/* Display success or error message */}
        {successMessage && <div >{successMessage}</div>}
        {errorMessage && <div >{errorMessage}</div>}
      </div>
    </div>
  );
};



export default CreatePortfolio;

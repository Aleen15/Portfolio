import React, { useState } from 'react';
import './Portfolio.css';
import Navbar from '../LandingPage/Navbar';

const Portfolio = ({ userName, userId }) => {
  const [currentBalance, setCurrentBalance] = useState(0.0);
  const [profitLoss, setProfitLoss] = useState(0.0);
  
  const navigateToCreatePortfolio = () => {
    window.location.href = `/create-portfolio/`;
  };

  const navigateToBuyStocks = () => {
    window.location.href = '/dummy-stock';
  };

  return (
    <div>
        <Navbar/>
      

      <main className="main-content">
        <section className="portfolio">
          <div className="portfolio-header">
            <h2>My Portfolios</h2>
            <button className="btn add-portfolio" onClick={navigateToCreatePortfolio}>+</button>
          </div>
          <ul id="portfolio-list">
            {/* Portfolio details will be injected here */}
          </ul>
        </section>

        <section className="portfolio-details">
          <div className="balance">
            <h3>Current Balance</h3>
            <p id="current-balance" className="balance-amount">₹{currentBalance}</p>
            <p id="profit-loss" className="balance-profit">+₹{profitLoss}</p>
          </div>
          <button className="btn buy-stocks" onClick={navigateToBuyStocks}>BUY STOCKS</button>

          <table className="assets-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>24h%</th>
                <th>Holdings</th>
                <th>Avg. Buy Price</th>
                <th>Profit/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="assets-table-body">
              {/* Stock rows will be injected here */}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Portfolio;

import React, { useState } from 'react';
import './Portfolio.css';
import Navbar from '../LandingPage/Navbar';

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([
    { name: "Crypto Growth", description: "Focused on high-potential cryptocurrencies.", assets: [] },
  ]);
  

  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);  // Default to first portfolio

  const [showEditModal, setShowEditModal] = useState(false);
  const [editPortfolio, setEditPortfolio] = useState({ index: null, name: "", description: "" });



  const [showModal, setShowModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ name: "", description: "" });

  const [showBuyStockModal, setShowBuyStockModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const [assets, setAssets] = useState([
    {
      id: 1,
      name: 'BNB',
      price: 45897.00,
      percentChange: -1.34,
      holdings: 872043.00,
      avgBuyPrice: 42709.00,
      profitLoss: 52384.00,
    },
  ]);

  const handleAddPortfolio = () => {
    setShowModal(true);
  };

  const handleSavePortfolio = () => {
    if (newPortfolio.name && newPortfolio.description) {
      setPortfolios([...portfolios, newPortfolio]);
      setNewPortfolio({ name: "", description: "" });
      setShowModal(false);
    }
  };

  const handleDeletePortfolio = (index) => {
    const updatedPortfolios = portfolios.filter((_, i) => i !== index);
    setPortfolios(updatedPortfolios);
  };

  const handleEditPortfolio = (index) => {
    const portfolio = portfolios[index];
    setEditPortfolio({ index, name: portfolio.name, description: portfolio.description });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editPortfolio.index !== null) {
      const updatedPortfolios = [...portfolios];
      updatedPortfolios[editPortfolio.index] = {
        ...updatedPortfolios[editPortfolio.index],
        name: editPortfolio.name,
        description: editPortfolio.description,
      };
      setPortfolios(updatedPortfolios);
      setShowEditModal(false);
    }
  };
  
  

  const handleBuyStock = (index) => {
    setActivePortfolioIndex(index); // Set the active portfolio index
    setShowBuyStockModal(true);
  };
  
  const handleCancelBuyStock = () => {
    setShowBuyStockModal(false);
    setSelectedCurrency(null);  // Reset selected stock on cancel
  };

  const handleSelectCurrency = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleConfirmStock = (portfolioIndex) => {
    if (selectedCurrency && portfolioIndex !== null) {
      const updatedPortfolios = [...portfolios]; // Make a copy of portfolios
      const selectedPortfolio = updatedPortfolios[portfolioIndex]; // Get the selected portfolio
  
      // Create a new asset object
      const newAsset = {
        id: selectedPortfolio.assets.length + 1, // Or another unique ID generation method
        name: selectedCurrency.name,
        price: selectedCurrency.price,
        percentChange: selectedCurrency.percentChange,
        holdings: selectedCurrency.holdings,
        avgBuyPrice: selectedCurrency.avgBuyPrice,
        profitLoss: selectedCurrency.profitLoss,
      };
  
      // Add the new asset to the selected portfolio's assets array
      selectedPortfolio.assets.push(newAsset);
  
      // Update the portfolios state with the new asset added to the selected portfolio
      setPortfolios(updatedPortfolios);
  
      // Close the modal and reset selected stock
      setShowBuyStockModal(false);
      setSelectedCurrency(null);
    }
  };
  
  

  return (
    <div className="portfolio-page">
      <Navbar />

      <div className="portfolio-content">
        <div className="left-side">
          <div className="portfolio-header">
            <h1>My Portfolio</h1>
            <button className="fas fa-plus" onClick={handleAddPortfolio}></button>
          </div>
          {portfolios.map((portfolio, index) => (
  <div key={index} className="portfolio-item">
    <button className="port-details">
      <div className="portfolio-details">
        <strong className="port-name">{portfolio.name}</strong>
        <p className="port-descrip">{portfolio.description}</p>
      </div>
      <div className="portfolio-actions">
        <button className="fas fa-edit" onClick={() => handleEditPortfolio(index)}></button>

        <button className="fas fa-trash" onClick={() => handleDeletePortfolio(index)}></button>
      </div>
    </button>

            </div>
          ))}
        </div>

        {/* Right Side - Current Balance and Assets */}
        <div className="right-side">
  <div className="card">
    <div className="current-balance-header">
      <h2>Current Balance</h2>
      {/* Ensure activePortfolioIndex is set correctly */}
      {portfolios.length > 0 && activePortfolioIndex !== null && (
  <button className="button" onClick={() => handleBuyStock(activePortfolioIndex)}>
    Buy Stock
  </button>
)}


    </div>
    <div className="pro-loss">
      <p className="balance">$872,043.00</p>
      <p>Profit/Loss: $52,384.00</p>
    </div>
  </div>

  <div className="card-asset">
    <h2>Your Assets</h2>
    <table className="assets-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>24%</th>
          <th>Holdings</th>
          <th>Avg. Buy Price</th>
          <th>Profit/Loss</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {activePortfolioIndex !== null &&
          portfolios[activePortfolioIndex]?.assets.map((asset, assetIndex) => (
            <tr key={assetIndex}>
              <td>{asset.id}</td>
              <td className="asset-name">
                <img className="asset-logo" src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png" alt="BNB logo" />
                {asset.name}
              </td>
              <td>${asset.price.toFixed(2)}</td>
              <td style={{ color: asset.percentChange < 0 ? "red" : "green" }}>
                {asset.percentChange.toFixed(2)}%
              </td>
              <td>${asset.holdings.toFixed(2)}</td>
              <td>${asset.avgBuyPrice.toFixed(2)}</td>
              <td>${asset.profitLoss.toFixed(2)}</td>
              <td className="action">
                <button>Sell</button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</div>


      </div>

      {/* Modal for Adding Portfolio */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Portfolio</h2>
            <div>
              <input
                type="text"
                placeholder="Portfolio Name"
                value={newPortfolio.name}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
              />
            </div>
            <div>
              <textarea
                placeholder="Portfolio Description"
                value={newPortfolio.description}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSavePortfolio}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

{showBuyStockModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Select Digital Currency</h2>
      <div className="stocks">
        <ul>
          <li onClick={() => handleSelectCurrency({ name: 'Bitcoin', price: 45000, percentChange: 2.5, holdings: 10000, avgBuyPrice: 42000, profitLoss: 5000 })}>
            <button>Bitcoin</button>
          </li>
          <li onClick={() => handleSelectCurrency({ name: 'Ethereum', price: 3000, percentChange: 1.2, holdings: 5000, avgBuyPrice: 2800, profitLoss: 4000 })}>
            <button>Ethereum</button>
          </li>
          <li onClick={() => handleSelectCurrency({ name: 'BNB', price: 450, percentChange: -1.5, holdings: 3000, avgBuyPrice: 440, profitLoss: 300 })}>
            <button>BNB</button>
          </li>
          <li onClick={() => handleSelectCurrency({ name: 'Solana', price: 150, percentChange: 0.8, holdings: 1500, avgBuyPrice: 140, profitLoss: 100 })}>
            <button>Solana</button>
          </li>
        </ul>
        <p>Selected Currency: {selectedCurrency ? selectedCurrency.name : 'None'}</p>
        <div className="modal-actions">
          <button onClick={() => handleConfirmStock(activePortfolioIndex)}>Select</button>
          <button onClick={handleCancelBuyStock}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}

{showEditModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Portfolio</h2>
      <div>
        <input
          type="text"
          placeholder="Portfolio Name"
          value={editPortfolio.name}
          onChange={(e) => setEditPortfolio({ ...editPortfolio, name: e.target.value })}
        />
      </div>
      <div>
        <textarea
          placeholder="Portfolio Description"
          value={editPortfolio.description}
          onChange={(e) => setEditPortfolio({ ...editPortfolio, description: e.target.value })}
        />
      </div>
      <div className="modal-actions">
        <button onClick={handleSaveEdit}>Save</button>
        <button onClick={() => setShowEditModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default Portfolio;
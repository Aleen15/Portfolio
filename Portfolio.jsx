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

  const [showSellStockModal, setShowSellStockModal] = useState(false);
  const [stockToSell, setStockToSell] = useState({ id: null, name: "", quantity: 0 });

  const [assets, setAssets] = useState([
    {
      id: 1,
      name: 'Bitcoin',
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
      const updatedPortfolios = [...portfolios];
      const selectedPortfolio = updatedPortfolios[portfolioIndex];
  
      const quantity = selectedCurrency.holdings; // Quantity entered by user
      const totalCost = selectedCurrency.price * quantity;
  
      // Create a new asset
      const newAsset = {
        id: selectedPortfolio.assets.length + 1,
        name: selectedCurrency.name,
        price: selectedCurrency.price,
        percentChange: selectedCurrency.percentChange,
        holdings: quantity,
        avgBuyPrice: selectedCurrency.price,
        profitLoss: 0, // Default to 0, calculate later based on real-time price
      };
  
      // Add the new asset to the selected portfolio's assets array
      selectedPortfolio.assets.push(newAsset);
  
      // Update the portfolios state
      setPortfolios(updatedPortfolios);
  
      // Reset modal and selected stock
      setShowBuyStockModal(false);
      setSelectedCurrency(null);
    }
  };

  const handleSellStock = (asset) => {
    setStockToSell({ ...asset, quantity: 0 }); // Prepopulate the modal with the asset details
    setShowSellStockModal(true);
  };

  const handleConfirmSell = () => {
    const { id, quantity } = stockToSell;
    if (quantity > 0 && activePortfolioIndex !== null) {
      const updatedPortfolios = [...portfolios];
      const selectedPortfolio = updatedPortfolios[activePortfolioIndex];

      // Find the asset and update its holdings
      const assetIndex = selectedPortfolio.assets.findIndex((asset) => asset.id === id);
      if (assetIndex !== -1) {
        const asset = selectedPortfolio.assets[assetIndex];
        asset.holdings -= quantity; // Deduct the sold quantity

        // Remove the asset if holdings become zero
        if (asset.holdings <= 0) {
          selectedPortfolio.assets.splice(assetIndex, 1);
        }
      }

      setPortfolios(updatedPortfolios);
      setShowSellStockModal(false);
    }
  };

  const handleCancelSell = () => {
    setShowSellStockModal(false);
    setStockToSell({ id: null, name: "", quantity: 0 });
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
              <button onClick={() => handleSellStock(asset)}>Sell</button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
    </div>
   </div>


      </div>

            {/* Sell Stock Modal */}
            {showSellStockModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sell Stock</h2>
            <div>
              <p><strong>Stock Name:</strong> {stockToSell.name}</p>
              <p><strong>Stock ID:</strong> {stockToSell.id}</p>
            </div>
            <div>
              <label htmlFor="quantity">Quantity to Sell:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={stockToSell.holdings}
                value={stockToSell.quantity}
                onChange={(e) => setStockToSell({ ...stockToSell, quantity: parseFloat(e.target.value) })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleConfirmSell}>Sell</button>
              <button onClick={handleCancelSell}>Cancel</button>
            </div>
          </div>
        </div>
      )}

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
      <h2>Buy Digital Currency</h2>
      
      {/* Dropdown to select stock */}
      <div className="stocks">
        <label htmlFor="currency-select">Select Currency:</label>
        <select
          id="currency-select"
          value={selectedCurrency ? selectedCurrency.name : ''}
          onChange={(e) => {
            const selected = e.target.value;
            const currencyOptions = [
              { name: 'Bitcoin', price: 45000, percentChange: 2.5, holdings: 0, avgBuyPrice: 0, profitLoss: 0 },
              { name: 'Ethereum', price: 3000, percentChange: 1.2, holdings: 0, avgBuyPrice: 0, profitLoss: 0 },
              { name: 'BNB', price: 450, percentChange: -1.5, holdings: 0, avgBuyPrice: 0, profitLoss: 0 },
              { name: 'Solana', price: 150, percentChange: 0.8, holdings: 0, avgBuyPrice: 0, profitLoss: 0 },
            ];
            const selectedCurrency = currencyOptions.find((currency) => currency.name === selected);
            setSelectedCurrency(selectedCurrency);
          }}
        >
          <option value="" disabled>Select a currency</option>
          <option value="Bitcoin">bitcoin</option>
          <option value="Ethereum">ethereum</option>
          <option value="BNB">bnb</option>
          <option value="Solana">solana</option>
        </select>
      </div>

      {/* Input for quantity */}
      <div className="quantity-input">
        <label htmlFor="quantity">Enter Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          placeholder="0"
          onChange={(e) => {
            const quantity = parseFloat(e.target.value);
            setSelectedCurrency((prev) =>
              prev ? { ...prev, holdings: quantity } : null
            );
          }}
        />
      </div>

      {/* Selected Currency Info */}
      <div className="selected-info">
        <p><strong>Selected Currency:</strong> {selectedCurrency ? selectedCurrency.name : 'None'}</p>
        <p><strong>Price per Unit:</strong> ${selectedCurrency ? selectedCurrency.price.toFixed(2) : '0.00'}</p>
        <p><strong>Total Cost:</strong> ${selectedCurrency && selectedCurrency.holdings ? (selectedCurrency.price * selectedCurrency.holdings).toFixed(2) : '0.00'}</p>
      </div>

      {/* Modal Actions */}
      <div className="modal-actions">
        <button
          onClick={() => handleConfirmStock(activePortfolioIndex)}
          disabled={!selectedCurrency || !selectedCurrency.holdings}
        >
          Buy Stock
        </button>
        <button onClick={handleCancelBuyStock}>Cancel</button>
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

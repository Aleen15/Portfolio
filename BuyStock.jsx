import React, { useState, useEffect } from 'react';
import './BuyStock.css';

const BuyStock = ({ portfolioId, onAddToPortfolio }) => {
    const [cryptoCoins, setCryptoCoins] = useState([]);

    useEffect(() => {
        fetchCryptoCoins();
    }, []);

    const fetchCryptoCoins = async () => {
        try {
            const response = await fetch('/cryptocoins'); // Replace with the actual API endpoint
            if (!response.ok) throw new Error('Failed to fetch cryptocurrency data');
            const data = await response.json();
            setCryptoCoins(data);
        } catch (error) {
            console.error('Error fetching cryptocurrency data:', error);
        }
    };

    const handleAddToPortfolio = async (coin) => {
        try {
            const response = await fetch(`/portfolios/${portfolioId}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    coinId: coin.id,
                    coinName: coin.name,
                    price: coin.price,
                }),
            });
            if (response.ok) {
                alert(`${coin.name} has been added to your portfolio!`);
                if (onAddToPortfolio) onAddToPortfolio();
            } else {
                alert('Failed to add coin to portfolio.');
            }
        } catch (error) {
            console.error('Error adding coin to portfolio:', error);
        }
    };

    return (
        <div className="buy-crypto-container">
            <h2>Select Cryptocurrency</h2>
            <table className="crypto-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>24h%</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cryptoCoins.length > 0 ? (
                        cryptoCoins.map((coin, index) => (
                            <tr key={coin.id}>
                                <td>{index + 1}</td>
                                <td>{coin.name}</td>
                                <td>₹{coin.price}</td>
                                <td className={coin.percentChange24h >= 0 ? 'positive' : 'negative'}>
                                    {coin.percentChange24h}%
                                </td>
                                <td>
                                    <button
                                        className="select-coin"
                                        onClick={() => handleAddToPortfolio(coin)}
                                    >
                                        Select
                                    </button>
                                    <button
                                        className="cancel-coin"
                                        onClick={() => window.location.href = '/portfolio'}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No cryptocurrencies found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BuyStock;

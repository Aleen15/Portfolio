import React, { useState, useEffect } from 'react';
import './BuyStock.css';

const CryptoPage = () => {
    const [portfolioId, setPortfolioId] = useState('');
    const [stocks, setStocks] = useState([]);
    const [selectedStocks, setSelectedStocks] = useState([]);

    useEffect(() => {
        // Fetch initial stock data (replace with actual API endpoint)
        fetch('/api/stocks')
            .then((response) => response.json())
            .then((data) => setStocks(data))
            .catch((error) => console.error('Error fetching stocks:', error));
    }, []);

    const handleRowSelection = (stock, holdings, isSelected) => {
        if (!holdings || holdings <= 0) {
            alert('Please enter a valid holdings value before selecting.');
            return;
        }

        if (isSelected) {
            setSelectedStocks((prev) =>
                prev.filter((item) => item.stockId !== stock.id)
            );
        } else {
            setSelectedStocks((prev) => [
                ...prev,
                { ...stock, holdings: parseFloat(holdings) },
            ]);
        }
    };

    const handleSubmit = () => {
        if (!portfolioId) {
            alert('Please enter a Portfolio ID.');
            return;
        }

        if (selectedStocks.length === 0) {
            alert('No stocks selected.');
            return;
        }

        fetch(`/stock/bulk-insert/${portfolioId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedStocks),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Stocks purchased successfully!');
                    setSelectedStocks([]);
                    setPortfolioId('');
                } else {
                    alert('Failed to buy stocks.');
                }
            })
            .catch((error) => {
                console.error('Error purchasing stocks:', error);
            });
    };

    return (
        <div className="container">
            <h1>CRYPTO-CURRENCIES</h1>
            <div className="form-group">
                <label htmlFor="portfolioId">Enter Portfolio ID:</label>
                <input
                    type="number"
                    id="portfolioId"
                    placeholder="Enter Portfolio ID"
                    value={portfolioId}
                    onChange={(e) => setPortfolioId(e.target.value)}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Stock Name</th>
                        <th>Current Price</th>
                        <th>Avg. Buy Price</th>
                        <th>Percentage Change (24h)</th>
                        <th>Holdings</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => {
                        const isSelected = selectedStocks.some(
                            (item) => item.stockId === stock.id
                        );

                        return (
                            <StockRow
                                key={stock.id}
                                stock={stock}
                                index={index + 1}
                                isSelected={isSelected}
                                onRowSelection={handleRowSelection}
                            />
                        );
                    })}
                </tbody>
            </table>

            <div className="form-group">
                <button
                    className="submit-btn"
                    type="button"
                    onClick={handleSubmit}
                >
                    Buy Selected Stocks
                </button>
            </div>
        </div>
    );
};

const StockRow = ({ stock, index, isSelected, onRowSelection }) => {
    const [holdings, setHoldings] = useState(stock.holdings || '');

    const handleSelect = () => {
        onRowSelection(stock, holdings, isSelected);
    };

    return (
        <tr className={isSelected ? 'highlight' : ''}>
            <td>{index}</td>
            <td>{stock.stockName}</td>
            <td>${stock.currentPrice.toFixed(2)}</td>
            <td>${stock.avgBuyPrice.toFixed(2)}</td>
            <td className={stock.percentChange24h >= 0 ? 'positive' : 'negative'}>
                {stock.percentChange24h >= 0 ? '+' : ''}
                {stock.percentChange24h.toFixed(2)}%
            </td>
            <td>
                <input
                    type="number"
                    value={holdings}
                    min="0"
                    onChange={(e) => setHoldings(e.target.value)}
                />
            </td>
            <td>
                <div
                    className={`select-circle ${isSelected ? 'selected' : ''}`}
                    onClick={handleSelect}
                ></div>
            </td>
        </tr>
    );
};

export default CryptoPage;

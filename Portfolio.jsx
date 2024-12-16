import React, { useState, useEffect } from 'react';
import './Portfolio.css';
import Navbar from '../LandingPage/Navbar';


const PortfolioCard = ({ portfolio, onEdit, onDelete, onViewStocks }) => (
    <li className="portfolio-card">
        <div className="card-actions">
            <button onClick={() => onEdit(portfolio)} className="edit-portfolio">📝</button>
            <button onClick={() => onDelete(portfolio.portfolioId)} className="delete-portfolio">🗑️</button>
        </div>
        <h3 className="portfolio-name">{portfolio.portfolioName}</h3>
        <p className="investment-agenda">{portfolio.investmentAgenda}</p>
        <p className="portfolio-id">Portfolio ID: <strong>{portfolio.portfolioId}</strong></p>
        <button onClick={() => onViewStocks(portfolio.portfolioId)} className="view-stocks">View Stocks</button>
    </li>
);

const StockTable = ({ stocks }) => (
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
        <tbody>
            {stocks.length > 0 ? stocks.map((stock, index) => (
                <tr key={stock.id}>
                    <td>{index + 1}</td>
                    <td>{stock.stockName}</td>
                    <td>{stock.currentPrice}</td>
                    <td className={stock.percentChange24h >= 0 ? 'positive' : 'negative'}>
                        {stock.percentChange24h}%
                    </td>
                    <td>{stock.holdings}</td>
                    <td>{stock.avgBuyPrice}</td>
                    <td className={stock.profitLoss >= 0 ? 'positive' : 'negative'}>
                        {stock.profitLoss}
                    </td>
                    <td><button className="sell-stock">Sell</button></td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="8">No stocks found</td>
                </tr>
            )}
        </tbody>
    </table>
);

const PortfolioPage = () => {
    const [userName, setUserName] = useState('User');
    const [portfolios, setPortfolios] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [currentPortfolioId, setCurrentPortfolioId] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [profitLoss, setProfitLoss] = useState(0);

    useEffect(() => {
        fetchUserName();
        fetchPortfolios();
    }, []);

    const fetchUserName = () => {
        // Fetch the user's name from the server (replace with actual API call if available)
        setUserName('John Doe'); // Example static data
    };

    const fetchPortfolios = async () => {
        try {
            const response = await fetch('/portfolios/user');
            if (!response.ok) throw new Error('Failed to fetch portfolios');
            const data = await response.json();
            setPortfolios(data);
        } catch (error) {
            console.error('Error fetching portfolios:', error);
        }
    };

    const fetchStocks = async (portfolioId) => {
        try {
            const response = await fetch(`/stock/${portfolioId}`);
            if (!response.ok) throw new Error('Failed to fetch stocks');
            const data = await response.json();
            setStocks(data);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    const fetchPortfolioSummary = async (portfolioId) => {
        try {
            const response = await fetch(`/portfolios/${portfolioId}/summary`);
            if (!response.ok) throw new Error('Failed to fetch portfolio summary');
            const { totalValue, totalProfitLoss } = await response.json();
            setCurrentBalance(totalValue);
            setProfitLoss(totalProfitLoss);
        } catch (error) {
            console.error('Error fetching portfolio summary:', error);
        }
    };

    const handleLogout = () => {
        fetch('/logout', { method: 'POST', credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login?logout';
                } else {
                    alert('Logout failed.');
                }
            })
            .catch(error => console.error('Logout error:', error));
    };

    const handleEditPortfolio = (portfolio) => {
        // Logic for editing portfolio
    };

    const handleDeletePortfolio = async (portfolioId) => {
        if (window.confirm('Are you sure you want to delete this portfolio?')) {
            try {
                const response = await fetch(`/portfolios/${portfolioId}`, { method: 'DELETE' });
                if (response.ok) {
                    setPortfolios(portfolios.filter(p => p.portfolioId !== portfolioId));
                } else {
                    alert('Failed to delete portfolio.');
                }
            } catch (error) {
                console.error('Error deleting portfolio:', error);
            }
        }
    };

    const handleViewStocks = (portfolioId) => {
        setCurrentPortfolioId(portfolioId);
        fetchStocks(portfolioId);
        fetchPortfolioSummary(portfolioId);
    };

    return (
        <div>
             <Navbar/>
            <main className="main-content">
                <section className="portfolio">
                    <div className="portfolio-header">
                        <h2>My Portfolios</h2>
                        <button
                            className="btn add-portfolio"
                            onClick={() => window.location.href = `/create-portfolio/${1}`} // Replace with actual userId
                        >
                            +
                        </button>
                    </div>
                    <ul id="portfolio-list">
                        {portfolios.map(portfolio => (
                            <PortfolioCard
                                key={portfolio.portfolioId}
                                portfolio={portfolio}
                                onEdit={handleEditPortfolio}
                                onDelete={handleDeletePortfolio}
                                onViewStocks={handleViewStocks}
                            />
                        ))}
                    </ul>
                </section>
                <section className="portfolio-details">
                    <div className="balance">
                        <h3>Current Balance</h3>
                        <p id="current-balance" className="balance-amount">₹{currentBalance.toFixed(2)}</p>
                        <p
                            id="profit-loss"
                            className={profitLoss >= 0 ? 'positive' : 'negative'}
                        >
                            {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toFixed(2)}
                        </p>
                    </div>
                    <button className="btn buy-stocks" onClick={() => window.location.href = '/buy-stock'}>
                        BUY STOCKS
                    </button>
                    <StockTable stocks={stocks} />
                </section>
            </main>
        </div>
    );
};

export default PortfolioPage;

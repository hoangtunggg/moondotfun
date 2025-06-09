import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('coins held');
  const { address } = useParams();
  
  const tabs = ['coins held', 'replies', 'notifications', 'coins created', 'followers', 'following'];

  const mockCoins = [
    { id: '217047', name: 'DRPEPE', amount: '0.0061 SOL', image: 'https://pump.fun/logo.png' },
    { id: '174569', name: 'SOUL', amount: '0.0052 SOL', image: 'https://pump.fun/logo.png' },
    // ... add more mock data as needed
  ];
  
  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="https://pump.fun/logo.png" alt="Profile" className="avatar-image" />
        </div>
        <div className="profile-info">
          <h2 className="profile-name">@qiwihui</h2>
          <p className="profile-followers">4 followers</p>
          <p className="profile-bio">asdfasdfasdfasdf</p>
          <button className="edit-profile-btn">edit profile ↗</button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-label">likes received: </span>
          <span className="stat-value">0 ❤️</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">mentions received: </span>
          <span className="stat-value">0 💭</span>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="wallet-address">
        <code>{address}</code>
        <a href="#" className="profile-address-link">view on etherscan↗</a>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Coins Actions */}
      <div className="coins-actions">
        <button className="action-button">[add coin]</button>
        <button className="action-button">[show dust coins]</button>
      </div>

      {/* Coins List */}
      <div className="coins-list">
        {mockCoins.map(coin => (
          <div key={coin.id} className="coin-item">
            <div className="coin-info">
              <img src={coin.image} alt={coin.name} className="coin-image" />
              <div className="coin-details">
                <span className="coin-id">{coin.id}</span>
                <span className="coin-name">{coin.name}</span>
                <span className="coin-amount">{coin.amount}</span>
              </div>
            </div>
            <div className="coin-actions">
              <button className="refresh-button">[refresh]</button>
              <button className="view-button">[view coin]</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="page-button">[ left ]</button>
        <span className="current-page">1</span>
        <button className="page-button">[ right ]</button>
      </div>
    </div>
  );
};

export default Profile; 
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const NavBar = () => {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const userAddress = accounts[0];
        setAddress(userAddress);

        const balance = await provider.getBalance(userAddress);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
    setIsDropdownOpen(false);
  };

  const handleViewProfile = () => {
    if (address) {
      navigate(`/profile/${address}`);
      setIsDropdownOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img
            src="https://pump.fun/logo.png"
            alt="Logo"
            className="logo-image"
          />
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? "show" : ""}`}>
          <Link
            to="/how-it-works"
            className="nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            [how it works]
          </Link>
          <Link
            to="/"
            className="nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            [advanced]
          </Link>
        </div>
      </div>

      <div className="nav-right">
        {address ? (
          <div className="wallet-info">
            <span className="balance">
              ({parseFloat(balance || 0).toFixed(2)} ETH)
            </span>
            <div
              className="profile-dropdown"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src="https://pump.fun/logo.png"
                alt="Profile"
                className="nav-profile-avatar"
              />
              <span className="username">qiwihui</span>
              <span className="dropdown-arrow">▼</span>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleViewProfile}>
                    [view profile]
                  </button>
                  <button className="dropdown-item" onClick={disconnectWallet}>
                    [disconnect]
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button className="connect-wallet-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

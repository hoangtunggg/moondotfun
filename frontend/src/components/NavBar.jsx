import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useContext } from 'react';
import { WalletContext } from './WalletContext';

const NavBar = () => {
  const { address, setAddress, balance, setBalance } = useContext(WalletContext);
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

        const balanceBigInt = await provider.getBalance(userAddress);
        const balanceInEth = ethers.formatEther(balanceBigInt);
        setBalance(balanceInEth);
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

  const shortenAddress = (addr) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
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
              ({parseFloat(balance || 0).toFixed(4)} ETH)
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
              <span className="username">{shortenAddress(address)}</span>
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

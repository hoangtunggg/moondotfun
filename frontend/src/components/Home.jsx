  /*
  1. App vừa mở → useEffect chạy → gọi fetchMemeTokens.
  2. fetchMemeTokens kết nối blockchain → gọi smart contract → lấy danh sách meme tokens.
  3. Sau khi lấy về:
      - Token đầu tiên (cards[0]) sẽ được hiển thị nổi bật.
      - Các token còn lại sẽ được render bên dưới.
  4. Người dùng có thể:
      - Click vào nút "start a new coin" để chuyển trang `/token-create`.
      - Click vào token bất kỳ → sang trang chi tiết `/token-detail/:tokenAddress`.
      - Nhập từ khóa vào ô search (chưa có chức năng tìm kiếm thực sự, mới log ra console).
  */


  import React, { useState, useEffect } from 'react';
  import '../App.css'; 
  import { useNavigate } from 'react-router-dom'; 
  const { ethers } = require('ethers');
  const {abi} = require("./abi")


  const App = () => {
    const [cards, setCards] = useState([]); // danh sach cac the la cac token, dang array;
    const [loading, setLoading] = useState(true); // trang thai loading;
    const [searchTerm, setSearchTerm] = useState(''); // tu khoa tim kiem;
    const navigate = useNavigate();  // dung de chuyen trang;
    const [filteredCards, setFilteredCards] = useState([]);

    const [sortOption, setSortOption] = useState("featured");
    const [showSortDropdown, setShowSortDropdown] = useState(false);

  // useEffect se chay lan dau tien khi render component
    useEffect(() => {
      const fetchMemeTokens = async () => { 
        try {
        
          const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL) // ket noi blockchain RPC node

          console.log(provider)
          const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, provider); // ket noi smart contract voi dia chi va ABI;

          const memeTokens = await contract.getAllMemeTokens(); // goi ham getAllMemeTokens de lay danh sach cac meme token

          const mappedTokens = memeTokens.map(token => ({
            name: token.name,
            symbol: token.symbol,
            description: token.description,
            tokenImageUrl: token.tokenImageUrl,
            fundingRaised: ethers.formatUnits(token.fundingRaised, 'ether'),
            tokenAddress: token.tokenAddress,
            creatorAddress: token.creatorAddress,
          }));
          setCards(mappedTokens);
          setFilteredCards(mappedTokens);
        } catch (error) {
          console.error('Error fetching meme tokens:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMemeTokens();
    }, []);


    useEffect(() => {
      const lowerTerm = searchTerm.toLowerCase();
      if (searchTerm.trim() === "") {
        setFilteredCards(cards);
      } else {
        const results = cards.filter(card =>
          card.name.toLowerCase().includes(lowerTerm) ||
          card.symbol.toLowerCase().includes(lowerTerm) ||
          card.description.toLowerCase().includes(lowerTerm)
        );
        setFilteredCards(results);
      }
    }, [searchTerm, cards]);


    useEffect(() => {
      let sortedCards = [...cards];
      if (sortOption === "newest") {
        sortedCards.reverse(); // hoặc sort theo timestamp nếu có
      }
      setFilteredCards(sortedCards);
    }, [sortOption, cards]);


    const navigateToTokenDetail = (card) => {
      navigate(`/token-detail/${card.tokenAddress}`, { state: { card } }); // chuyen den trang chi tiet token voi dia chi tokenAddress, state la thong tin cua the
    };

    return (
    <div className="app">
      <div className="main-layout">
        {/* Main content */}
        <div className="card-container">
          <h3 className="start-new-coin" onClick={() => navigate('/token-create')}>
            [start a new coin]
          </h3>
          <img src="https://pump.fun/_next/image?url=%2Fking-of-the-hill.png&w=256&q=75" alt="Start a new coin" className="start-new-image"/>

          {/* {cards.length > 0 && (
            <div className="card main-card" onClick={() => navigateToTokenDetail(cards[0])}>  */}
          {filteredCards.length > 0 && (
            <div className="card main-card" onClick={() => navigateToTokenDetail(filteredCards[0])}>
              <div className="card-content">
                <img src={cards[0].tokenImageUrl} alt={cards[0].name} className="card-image"/>
                <div className="card-text">
                  <h2>Created by {cards[0].creatorAddress}</h2>
                  <p>Funding Raised: {cards[0].fundingRaised} ETH</p>
                  <p>{cards[0].name} (ticker: {cards[0].symbol})</p>
                  <p>{cards[0].description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="search for token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

          <div className="sort-container">
            <div
              className="sort-dropdown"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span className="sort-text">
                sort: {sortOption} {sortOption === "featured" && "🔥"}
              </span>
              <span className="dropdown-arrow">▼</span>
            </div>

            {showSortDropdown && (
              <div className="sort-options">
                <div
                  className={`sort-option ${
                    sortOption === "featured" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSortOption("featured");
                    setShowSortDropdown(false);
                  }}
                >
                  featured 🔥
                </div>
                <div
                  className={`sort-option ${
                    sortOption === "newest" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSortOption("newest");
                    setShowSortDropdown(false);
                  }}
                >
                  newest
                </div>
                <div
                  className={`sort-option ${
                    sortOption === "oldest" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSortOption("oldest");
                    setShowSortDropdown(false);
                  }}
                >
                  oldest
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="card-list">
              {(searchTerm ? filteredCards : cards.slice(1)).map((card, index) => (
                <div key={index} className="card" onClick={() => navigateToTokenDetail(card)}>
                  <div className="card-content">
                    <img src={card.tokenImageUrl} alt={card.name} className="card-image"/>
                    <div className="card-text">
                      <h2>Created by {card.creatorAddress}</h2>
                      <p>Funding Raised: {card.fundingRaised} ETH</p>
                      <p>{card.name} (ticker: {card.symbol})</p>
                      <p>{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );


  };

  export default App;
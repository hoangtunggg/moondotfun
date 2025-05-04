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

import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
const { ethers } = require('ethers');
const { abi } = require("./abi");

const App = () => {
    const [cards, setCards] = useState([]); // danh sach cac the la cac token, dang array;
    const [loading, setLoading] = useState(true); // trang thai loading;
    const [searchTerm, setSearchTerm] = useState(''); // tu khoa tim kiem;
    const navigate = useNavigate(); // dung de chuyen trang;

    // useEffect se chay lan dau tien khi render component
    useEffect = (() => {
        const fetchMemeTokens = async () => { // khai bao ham fetch meme token
            try{
                const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_CONTRACT_ADDRESS) // ket noi bloack chain RPC node
                console.log(provider)
                const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, provider); // ket noi smart contract voi dia chi va ABI;
                const memeTokens = await contract.getAllMemeTokens();

                setCards( // xu li khi nhan token ve
                    memeTokens.map(token => ({
                        name: token.name,
                        symbol: token.symbol,
                        description: token.description,
                        tokenImageUrl: token.tokenImageUrl,
                        fundingRaised: ethers.formatUnits(token.fundingRaised, 'ether'), // doi don vi tu 'wei' sang ether;
                        tokenAddress: token.tokenAddress,
                        creatorAddress: token.creatorAddress,
                    }))
                );
            } catch (error) {
                console.log('Error fetching meme tokens:', error);
            } finally {
                setLoading(false);
            }
        }; 
        fetchMemeTokens();
    }, []);

    const handleSearch = () => {
        console.log('Searching for:', searchTerm);
      };

    const navigateToTokenDetail = (card) => {
        navigate(`/token-detail/${card.tokenAddress}`, { state: {card}}); // su dung token address lam url va truyen data card sang trang token detail;
    }
    
    return (
        <div className="app">
            <nav className="navbar"> 
                <a href="#" className="nav-link">[moralis]</a>
                <a href="#" className="nav-link">[docs]</a>
                <button className="nav-button">[connect wallet]</button>
            </nav>

            <div className="card-container">
                <h3 className="start-new-coin" onClick={() => navigate('/token-create')}>[start a new coin]</h3>
                <img src="https://pump.fun/_next/image?url=%2Fking-of-the-hill.png&w=256&q=75" alt="Start a new coin" className="start-new-image"/>
                
                {cards.length > 0 && ( // it nhat 1 token trong cards moi hien thi;
                // hien thi 1 token chinh trong mang
                    <div className="card main-card" onClick={() => navigateToTokenDetail(cards[0])}>
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

                <div className="search-container"> 
                    <input
                        type="text"
                        className="search-input"
                        placeholder="search for token"
                        value={searchTerm} // luu du lieu vao searchterm
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>

                
            </div>
        </div>
    )
}

export default App;



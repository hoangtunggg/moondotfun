import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import '../App.css'; 
import { abi } from './abi'; 
import { tokenAbi } from './tokenAbi';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';


const TokenDetail = () => {
  const { tokenAddress } = useParams();
  const location = useLocation();
  const { card } = location.state || {}; // lấy dữ liệu card được truyền qua từ trang home.jsx

  const [owners, setOwners] = useState([]); // mang luu nhung nguoi so huu
  const [transfers, setTransfers] = useState([]); // mang luu nhung giao dich
  const [loading, setLoading] = useState(true); // trang thai loading
  const [purchaseAmount, setPurchaseAmount] = useState(''); // so luong token muon mua
  const [totalSupply, setTotalSupply] = useState('0'); // tong so luong cung token
  const [remainingTokens, setRemainingTokens] = useState('0'); // so luong token con lai
  const [cost, setCost] = useState('0'); // chi phi mua token
  const [isModalOpen, setIsModalOpen] = useState(false); // trang thai modal (cua so bat ra khi muon mua)
  const navigate = useNavigate(); // dung de dieu huong trang web
  const [ownerList, setOwnerList] = useState([]);
  const [tokensSold, setTokensSold] = useState([]);

  // khoi tao token detail
  const tokenDetails = card || { // neu khong co card thi tra ve object co dang tu dinh nghia
      name: 'Unknown',
      symbol: 'Unknown',
      description: 'No description available',
      tokenImageUrl: 'https://via.placeholder.com/200',
      fundingRaised: '0 ETH',
      creatorAddress: '0x0000000000000000000000000000000000000000',
  }; 

  const fundingRaised = parseFloat(tokenDetails.fundingRaised.replace(' ETH', '')); // chuyen doi fundingRaised tu string sang so

  // Hang so
  const maxSupply = parseInt(800000); // tong so luong token cung toi da
  const fundingGoal = 24; // muc tieu goi von

  useEffect(() => {
    const fetchData = async () => {
      try{
        const ownersResponse = await fetch(
          `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/owners?chain=sepolia&order=DESC`,
          {
            headers: {
              accept: 'application/json',
              'X-API-Key': process.env.REACT_APP_X_API_KEY,
            },
          }
        );
        const ownersData = await ownersResponse.json();
        setOwners(ownersData.result || []); // luu du lieu owner vao state owners

        const transfersResponse = await fetch(
          `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/transfers?chain=sepolia&order=DESC`,
          {
            headers: {
              accept: 'application/json',
              'X-API-Key': process.env.REACT_APP_X_API_KEY,
            },
          }
        );
        const transfersData = await transfersResponse.json();
        setTransfers(transfersData.result || []); // luu du lieu giao dich vao state transfers

        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL); // ket noi toi blockchain Sepolia
        const contract = new ethers.Contract(tokenAddress, tokenAbi, provider); // khoi tao contract token
        const totalSupplyResponse = await contract.totalSupply(); // lay tong so luong token
        var totalSupplyFormatted = parseInt(ethers.formatUnits(totalSupplyResponse, 'ether')) - 200000; // dinh dang lai tong so luong token
        setTotalSupply(parseInt(totalSupplyFormatted)); // luu tong so luong token vao state totalSupply
        setRemainingTokens(maxSupply - totalSupplyFormatted); // tinh so luong token con lai va luu vao state remainingTokens
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();   
  }, [tokenAddress]); // useEffect se chay lai khi tokenAddress thay doi

  // tinh toan phan tram funding
  const fundingRaisedPercentage = (fundingRaised / fundingGoal) * 100; // tinh phan tram funding da goi von
  const totalSupplyPercentage =
    ((parseFloat(totalSupply) - 200000) / ethers.formatUnits(maxSupply - 200000, 'ether')) * 100; // tinh phan tram tong cung token

  // ham tinh toan chi phi mua token
  const getCost = async () => {
    if (!purchaseAmount) return; // neu khong co so luong mua thi khong tinh toan

    try {
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL); // ket noi toi blockchain Sepolia
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, provider); // khoi tao contract voi dia chi smart contract
      const costInWei = await contract.calculateCost(totalSupply, purchaseAmount); // goi ham getCost de lay chi phi mua token
      setCost(ethers.formatUnits(costInWei, 'ether')); // dinh dang chi phi tu wei sang ether va luu vao state cost
      setIsModalOpen(true); // mo modal de xac nhan mua token
    } catch (error) {
      console.error('Error calculating cost:', error);
    }
  };

  const handlePurchase = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // ket noi toi blockchain qua trinh duyet
      const signer = await provider.getSigner(); // lay signer de ky giao dich
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer); // khoi tao contract voi signer

      const transaction = await contract.buyMemeToken(tokenAddress, purchaseAmount,{
        value: ethers.parseUnits(cost, 'ether'),
      });  // chuyen doi chi phi sang ether

      const receipt = await transaction.wait(); // cho giao dich hoan thanh
      alert(`Transaction successful! Hash: ${receipt.hash}`); // thong bao giao dich thanh cong
      setIsModalOpen(false);  // dong modal sau khi mua token thanh cong
    } catch (error) {
      console.error('Error purchasing tokens:', error);
    }
  };

  return (
    <div className="token-detail-container">
            <nav className="navbar">
      </nav>

      <h3 className="start-new-coin" onClick={() => navigate('/')}>[go back]</h3>

      <div className="token-details-section">

        <div className="token-details">
          <h2>Token Detail for {tokenDetails.name}</h2>
          <img src={tokenDetails.tokenImageUrl} alt={tokenDetails.name} className="token-detail-image" />
          <p><strong>Creator Address:</strong> {tokenDetails.creatorAddress}</p>
          <p><strong>Token Address:</strong> {tokenAddress}</p>
          <p><strong>Funding Raised:</strong> {tokenDetails.fundingRaised}</p>
          <p><strong>Token Symbol:</strong> {tokenDetails.symbol}</p>
          <p><strong>Description:</strong> {tokenDetails.description}</p>
        </div>

        <div className="right-column">
          <div className="progress-bars">
            <div className="progress-container">
              <p><strong>Bonding Curve Progress:</strong> {fundingRaised} / {fundingGoal} ETH</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${fundingRaisedPercentage}%` }}></div>
              </div>
              <p>When the market cap reaches {fundingGoal} ETH, all the liquidity from the bonding curve will be deposited into Uniswap, and the LP tokens will be burned. Progression increases as the price goes up.</p>
            </div>

            <div className="progress-container">
              <p><strong>Remaining Tokens Available for Sale:</strong> {remainingTokens} / 800,000</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${totalSupplyPercentage}%` }}></div>
              </div>
            </div>
          </div>

       
          <div className="buy-tokens">
            <h3>Buy Tokens</h3>
            <input
              type="number"
              placeholder="Enter amount of tokens to buy"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              className="buy-input"
            />
            <button onClick={getCost} className="buy-button">Purchase</button>
          </div>
        </div>
      </div>


      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Confirm Purchase</h4>
            <p>Cost of {purchaseAmount} tokens: {cost} ETH</p>
            <button onClick={handlePurchase} className="confirm-button">Confirm</button>
            <button onClick={() => setIsModalOpen(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}


      <h3>Owners</h3>
      {loading ? (
        <p>Loading owners...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Owner Address</th>
              <th>Percentage of Total Supply</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner, index) => (
              <tr key={index}>
                <td>{owner.owner_address}</td>
                <td>{owner.percentage_relative_to_total_supply}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Transfers</h3>
      {loading ? (
        <p>Loading transfers...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>From Address</th>
              <th>To Address</th>
              <th>Value (ETH)</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer, index) => (
              <tr key={index}>
                <td>{transfer.from_address}</td>
                <td>{transfer.to_address}</td>
                <td>{transfer.value_decimal}</td>
                <td><a style={{color:"white"}} href={`https://sepolia.etherscan.io/tx/${transfer.transaction_hash}`} target="_blank" rel="noopener noreferrer">{transfer.transaction_hash}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="text-xl font-semibold my-4">Token Sold Over Time</h2>
      <LineChart width={600} height={300} data={tokensSold}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </LineChart>

      <h2 className="text-xl font-semibold my-4">Top Token Holders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {ownerList.slice(0, 10).map((owner, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 break-all">{owner.address}</td>
                <td className="px-4 py-2">{owner.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
}
export default TokenDetail;




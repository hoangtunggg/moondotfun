import React, { useState } from 'react';
import '../App.css'; 
import { useNavigate } from 'react-router-dom';
import { abi } from './abi'; 
import { ethers } from 'ethers';
import BeatLoader from "react-spinners/BeatLoader";
import { WalletContext } from './WalletContext';
import { useContext } from 'react';

const TokenCreate = () => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState(''); 
  const [description, setDescription] = useState(''); 
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { address } = useContext(WalletContext);
  const navigate = useNavigate();

//   const handleCreate = async () => {

//     const newErrors = {};
//     if (!name.trim()) newErrors.name = "Name is required";
//     if (!ticker.trim()) newErrors.ticker = "Symbol is required";
//     if (!description.trim()) newErrors.description = "Description is required";


//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum); // kết nối với ví MetaMask
//       const signer = await provider.getSigner(); // lấy signer để thực hiện giao dịch
//       console.log(signer)
//       const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer); // tạo instance của contract với signer

//       const transaction = await contract.createMemeToken(name, ticker, imageUrl, description,{ // gọi hàm createMemeToken trên contract
//         // gửi kèm phí tạo token là 0.0001 ETH
//         value: ethers.parseUnits("0.0001", 'ether'),
//       }); 
//       const receipt = await transaction.wait(); // chờ giao dịch được xác nhận trên blockchain
//       // Hiển thị thông báo thành công và hash của giao dịch

//       alert(`Transaction successful! Hash: ${receipt.hash}`);
//       console.log('Creating token:', { name, ticker, description, imageUrl });
//       navigate('/'); 
//     } catch (error) {
//       console.error("Error creating token:", error);
//       // alert("Failed to create token. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
// };

  const handleCreate = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected.");
      return;
    }

    if (!address) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
      } catch (err) {
        console.error("Wallet connection failed:", err);
        alert("Please connect your wallet to proceed.");
        return;
      }
    }

    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!ticker.trim()) newErrors.ticker = "Symbol is required";
    if (!description.trim()) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const transaction = await contract.createMemeToken(
        name,
        ticker,
        imageUrl,
        description,
        {
          value: ethers.parseUnits("0.0001", "ether"),
        }
      );
      const receipt = await transaction.wait();

      alert(`Transaction successful! Hash: ${receipt.hash}`);
      navigate("/");
    } catch (error) {
      console.error("Error creating token:", error);
      alert("Failed to create token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="token-create-page">
      <div className="token-create-container">
      <button className="go-back-button" onClick={() => navigate('/')}>
          ⬅ Go Back
      </button>
        <p className="info-text">MemeCoin creation fee: 0.0001 ETH</p>
        <p className="info-text">Max supply: 1 million tokens. Initial mint: 200k tokens.</p>
        <p className="info-text">If funding target of 24 ETH is met, a liquidity pool will be created on Uniswap.</p>
        <div className="input-container">
          <label className="input-label">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Token Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: "" });
            }}
            className={`input-field ${errors.name ? "error-field" : ""}`}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}

          <label className="input-label">
            Symbol <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Ticker Symbol"
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value);
              setErrors({ ...errors, ticker: "" });
            }}
            className={`input-field ${errors.ticker ? "error-field" : ""}`}
          />
          {errors.ticker && (
            <span className="error-message">{errors.ticker}</span>
          )}

          <label className="input-label">Description</label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />


          <label className="input-label">
            Image Url <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input-field"
          />
          {address ? (
            <button className="create-button" onClick={handleCreate}>
              {isLoading ? <BeatLoader size={10} color={"#fff"} /> : "Create Coin"}
            </button>
          ) : (
            <button className="create-button disabled-button" disabled>
              Wallet not connected
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCreate;
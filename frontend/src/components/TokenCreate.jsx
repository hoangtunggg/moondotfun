import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { abi } from './abi';
import { ethers } from 'ethers';

/*
Tóm tắt Flow hoạt động
Người dùng nhập thông tin token (name, ticker, image, description).

Nhấn nút “Create”.

dApp kết nối ví MetaMask bằng BrowserProvider.

Lấy signer (người gửi giao dịch).

Tạo instance contract với signer.

Gọi hàm createMemeToken(...) trên contract và gửi kèm 0.0001 ETH.

Chờ giao dịch được xác nhận (wait()).

Hiển thị thông báo thành công + quay về trang chính.

*/

const TokenCreate = () => {
    // luu thong tin ma nguoi dung cung cap
    const [name, setName] = useState(''); // ten token muon tao
    const [ticker, setTicker] = useState(''); // ky hieu token muon tao
    const [description, setDescription] = useState(''); // mo ta token muon tao
    const [imageUrl, setImageUrl] = useState(''); // url anh dai dien token muon tao
    const navigate = useNavigate(); // dung de dieu huong trang web

    const handleCreate = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum); // ket noi voi vi de thuc hien giao dich, window.ethereum la doi tuong cua MetaMask
        const signer = await provider.getSigner(); //  lay dia chi nguoi dung dang ky va ky giao dich
        console.log(signer); // in dia chi nguoi dung dang ky va ky giao dich ra man hinh console (chi muc dich kiem tra
        const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer); // ket noi voi hop dong da trien khai tren mang blockchain, su dung dia chi hop dong va ABI (Application Binary Interface) cua hop dong, signer de ky giao dich

        const transaction = await contract.createMemeToken(name, ticker, imageUrl, description,{
            value: ethers.parseUnits("0.0001", 'ethers'), // gui kem phi la 0.0001 ETH de tao token
        });

        const receipt = await transaction.wait; // cho giao dich duoc xac nhan tren mang blockchain

        alert(`Transaction succesfully! Hash: ${receipt.hash}`); // hien thi thong bao giao dich thanh cong va hash cua giao dich
        console.log('Creating token:', { name, ticker, description, imageUrl }); // in thong tin token ra man hinh console (chi muc dich kiem tra)
        navigate('/'); // quay ve trang chu sau khi tao token thanh cong
    };
    

    return (
        <div className="app">
            <nav className="nav-bar">
                <a href="#" className="nav-link">[moralis]</a>
                <a href="#" className="nav-link">[docs]</a>
                <button className="nav-button">[connect wallet]</button>
            </nav>

            <div className="token-create-container">
                <h3 className="start-new-coin" onClick={() => navigate('/')}>[go back]</h3>
                <p className="info-text">MemeCoin creation fee: 0.0001 ETH</p>
                <p className="info-text">Max supply: 1 million tokens. Initial mint: 200k tokens.</p>
                <p className="info-text">If funding target of 24 ETH is met, a liquidity pool will be created on Uniswap.</p>

                <div className="input-container">
                    <input
                    type="text"
                    placeholder="Token Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field" 
                    />
                    <input
                        type="text"
                        placeholder="Ticker Symbol"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        className="input-field"
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="input-field"
                    />
                    <button className="create-button" onClick={handleCreate}>Create MemeToken</button>
                </div>
            </div>
        </div>
    );
};

export default TokenCreate;

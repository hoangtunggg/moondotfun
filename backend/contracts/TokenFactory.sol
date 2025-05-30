// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Token.sol";
import "hardhat/console.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract TokenFactory {


    struct memeToken {
        string name;
        string symbol;
        string description;
        string tokenImageUrl;
        uint fundingRaised;
        address tokenAddress;
        address creatorAddress;
    }

    address[] public memeTokenAddresses;

    mapping(address => memeToken) public addressToMemeTokenMapping;

    uint constant MEMETOKEN_CREATION_PLATFORM_FEE = 0.0001 ether;
    uint constant MEMECOIN_FUNDING_DEADLINE_DURATION = 10 days;
    uint constant MEMECOIN_FUNDING_GOAL = 24 ether;

    address constant UNISWAP_V2_FACTORY_ADDRESS = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; //  tạo ra các cặp giao dịch (liquidity pairs)
    address constant UNISWAP_V2_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; // Giao dịch token , cung cấp thanh khoản, rút thanh khoản,...


    uint256 public constant INITIAL_PRICE = 30000000000000;  // KHởi tạo giá ban đầu (P0), tránh precision loss (30 * 10^15 wei = 0.03 ether)
    // Hằng số k cho công thức bonding curve, được scale để tránh mất mát độ chính xác (0.01 * 10^18)
    uint256 public constant K = 8 * 10**15;  

    uint constant DECIMALS = 10 ** 18; // 1 token = 10^18 wei
    uint constant MAX_SUPPLY = 1000000 * DECIMALS; // 1 million tokens with 18 decimals
    uint constant INIT_SUPPLY = 20 * MAX_SUPPLY / 100;
    // mint trước 20% tổng cung (200,000 token) cho owner hoặc mục đích khởi tạo.

     // hàm tính toán chi phí mua token dựa trên công thức bonding curve mũ
    function calculateCost(uint256 currentSupply, uint256 tokensToBuy) public pure returns (uint256) {
        
            // Tính toán phần mũ của công thức
        uint256 exponent1 = (K * (currentSupply + tokensToBuy)) / 10**18;
        uint256 exponent2 = (K * currentSupply) / 10**18;

        // Tính toán e^(kx) với k là hằng số đã được định nghĩa
        uint256 exp1 = exp(exponent1);
        uint256 exp2 = exp(exponent2);
        // công thức chi phí mua token dựa trên bonding curve: P0 / k * (e^(k * (currentSupply + tokensToBuy)) - e^(k * currentSupply))

        // Sử dụng (P0 * 10^18) / k để giữ an toàn với phép chia không bằng 0
        uint256 cost = (INITIAL_PRICE * 10**18 * (exp1 - exp2)) / K;  // điều chinh để tránh mất mát độ chính xác
        // Trả về chi phí mua token đã được tính toán
        return cost;
    }


    // Cải thiện hàm tính e^x bằng cách sử dụng chuỗi Taylor với nhiều vòng lặp hơn để tăng độ chính xác
    function exp(uint256 x) internal pure returns (uint256) {
        uint256 sum = 10**18;  // Bắt đầu với 1 * 10^18 (tương đương với e^0)
        uint256 term = 10**18;  // khởi tạo hạng số hạng đầu tiên (1)
        uint256 xPower = x;  // khởi tạo x^1
        // Sử dụng chuỗi Taylor để tính e^x
        
        for (uint256 i = 1; i <= 20; i++) {  // Tăng số vòng lặp để tăng độ chính xác
            term = (term * xPower) / (i * 10**18);  // x^i / i!
            sum += term;

            // Tránh tràn số và tính toán không cần thiết
            if (term < 1) break;
        }

        return sum;
    }


    function createMemeToken(string memory name, string memory symbol, string memory imageUrl, string memory description) public payable returns(address) {


        require(msg.value>= MEMETOKEN_CREATION_PLATFORM_FEE, "fee not paid for memetoken creation");
        Token ct = new Token(name, symbol, INIT_SUPPLY);
        address memeTokenAddress = address(ct);
        memeToken memory newlyCreatedToken = memeToken(name, symbol, description, imageUrl, 0, memeTokenAddress, msg.sender);
        memeTokenAddresses.push(memeTokenAddress);
        addressToMemeTokenMapping[memeTokenAddress] = newlyCreatedToken;
        return memeTokenAddress;
    }

    function getAllMemeTokens() public view returns(memeToken[] memory) {
        memeToken[] memory allTokens = new memeToken[](memeTokenAddresses.length);
        for (uint i = 0; i < memeTokenAddresses.length; i++) {
            allTokens[i] = addressToMemeTokenMapping[memeTokenAddresses[i]];
        }
        return allTokens;
    }

     function buyMemeToken(address memeTokenAddress, uint tokenQty) public payable returns(uint) {

        require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress!=address(0), "Token is not listed"); // kiem tra token có tồn tại hay không
        memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress]; //  biến kiểu memeToken (struct) lưu trong bộ nhớ storage của hợp đồng.

         Token memeTokenCt = Token(memeTokenAddress); // khởi tạo từ địa chỉ hợp đồng token thực tế

        require(listedToken.fundingRaised <= MEMECOIN_FUNDING_GOAL, "Funding has already been raised"); // kiểm tra xem đã đạt được mục tiêu huy động vốn chưa


        uint currentSupply = memeTokenCt.totalSupply(); // lấy tổng cung hiện tại của token
        console.log("Current supply of token is ", currentSupply);
        console.log("Max supply of token is ", MAX_SUPPLY);
        uint available_qty = MAX_SUPPLY - currentSupply; // tính toán số lượng token có sẵn để bán
        console.log("Qty available for purchase ",available_qty);


        uint scaled_available_qty = available_qty / DECIMALS; // chuyển đổi số lượng token có sẵn sang đơn vị nguoi dung hieu
        uint tokenQty_scaled = tokenQty * DECIMALS; // chuyển đổi số lượng token người dùng muốn mua sang đơn vị wei

       require(tokenQty <= scaled_available_qty, "Not enough available supply"); // kiểm tra xem số lượng token người dùng muốn mua có vượt quá số lượng có sẵn hay không

        uint currentSupplyScaled = (currentSupply - INIT_SUPPLY) / DECIMALS; // tính toán tổng cung hiện tại đã trừ đi lượng token đã được mint ban đầu
        uint requiredEth = calculateCost(currentSupplyScaled, tokenQty); // tính toán chi phí mua token dựa trên bonding curve
         console.log("ETH required for purchasing meme tokens is ",requiredEth);

        // kiểm tra xem người dùng đã gửi đủ ETH để mua token hay chưa
        require(msg.value >= requiredEth, "Incorrect value of ETH sent");

        // tăng số lượng token đã huy động vốn
        listedToken.fundingRaised+= msg.value;

        // nếu số lượng token đã huy động vốn đạt đến mục tiêu huy động vốn, thì tạo pool thanh khoản và cung cấp thanh khoản
        if(listedToken.fundingRaised >= MEMECOIN_FUNDING_GOAL){
            // tạo pool thanh khoản trên Uniswap V2
            address pool = _createLiquidityPool(memeTokenAddress);
            console.log("Pool address ", pool);

            // cung cấp thanh khoản cho Uniswap V2
            uint tokenAmount = INIT_SUPPLY;
            uint ethAmount = listedToken.fundingRaised;
            uint liquidity = _provideLiquidity(memeTokenAddress, tokenAmount, ethAmount);
            console.log("UNiswap provided liquidty ", liquidity);

            // burn LP tokens sau khi cung cấp thanh khoản
            _burnLpTokens(pool, liquidity);

        }

        // mint the tokens
        memeTokenCt.mint(tokenQty_scaled, msg.sender);

        console.log("User balance of the tokens is ", memeTokenCt.balanceOf(msg.sender));

        console.log("New available qty ", MAX_SUPPLY - memeTokenCt.totalSupply());

        return 1;
    
    }


    // Hàm cung cấp thanh khoản cho Uniswap V2
    function _createLiquidityPool(address memeTokenAddress) internal returns (address){
        IUniswapV2Factory factory = IUniswapV2Factory(UNISWAP_V2_FACTORY_ADDRESS);
        IUniswapV2Router01 router = IUniswapV2Router01(UNISWAP_V2_ROUTER_ADDRESS);
        // Tạo cặp giao dịch (liquidity pair) cho token mới
        address pair = factory.createPair(memeTokenAddress, router.WETH()); // Tạo cặp giao dịch với WETH (phiên bản ERC20 của ETH)
        return pair;
    }

     function _provideLiquidity(address memeTokenAddress, uint tokenAmount, uint ethAmount) internal returns(uint){ // Hàm cung cấp thanh khoản cho Uniswap V2
        
        uint minToken = tokenAmount * 95 / 100; // cho phép lệch 5%
        uint minETH = ethAmount * 95 / 100;

        Token memeTokenCt = Token(memeTokenAddress);
        memeTokenCt.approve(UNISWAP_V2_ROUTER_ADDRESS, tokenAmount); // Cấp quyền cho Uniswap Router để sử dụng token của người dùng
        IUniswapV2Router01 router = IUniswapV2Router01(UNISWAP_V2_ROUTER_ADDRESS);
        // ham tra ve luong token, eth  va LP token đã cung cấp thanh khoản
        (uint amountToken, uint amountETH, uint liquidity) = router.addLiquidityETH{
            value: ethAmount
        }(memeTokenAddress, tokenAmount, tokenAmount, ethAmount, address(this), block.timestamp); // dia chi token, so luong token, so luong eth, dia chi nhan thanh khoan, thoi gian het han giao dich
        return liquidity;
    }

    function _burnLpTokens(address pool, uint liquidity) internal returns(uint){ // Hàm đốt LP token sau khi cung cấp thanh khoản
        IUniswapV2Pair uniswapv2pairct = IUniswapV2Pair(pool);
        uniswapv2pairct.transfer(address(0), liquidity); // Chuyển LP token đến địa chỉ 0 để đốt
        console.log("Uni v2 tokens burnt");
        return 1;
    }

}



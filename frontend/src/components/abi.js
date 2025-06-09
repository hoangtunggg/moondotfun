export const abi = [ // tao, luu tru va truy xuat meme token
    {
        "inputs" : [
            {
                "internalType": "address", //dang address trong solidity
                "name": "memeTokenAddress", //dia chi memetoken
                "type": "address" //dang du lieu torng blockchain
            },
            {
                "internalType": "uint256", 
                "name": "tokenQuantity", //so luong token muon mua
                "type": "uint256"   
            }
        ],
        "name": "buyMemeToken",
        "outputs" : [
            {
                "internalType": "uint256", //dau ra la so luong can tra ve
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs" : [
            {
                "internalType": "string",
                "name": "name", // ten token
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol", // ki hieu token 
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "imageUrl", //link anh
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description", // mo ta
                "type": "string"
            },
        ],
        "name" : "createMemeToken",
        "outputs" : [
            {
                "internalType": "address", // tra ve dia chi token moi
                "name": "",
                "type": "address"
            },
        ],
        "stateMutability": "payable",
        "type" : "function"
    },
    {
        "inputs" : [
            {
                "internalType": "address", 
                "name": "",
                "type": "address"
            },
        ],
        "name" : "addressToMemeTokenMapping",
        "outputs" : [
            {
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "tokenImageUrl",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "fundingRaised", // von da duoc huy dong
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenAddress", // dia chi token
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "creatorAddress", // thong tin creator
				"type": "address"
			}
        ],
        "stateMutability": "view",
        "type" : "function"
    },
    {
        "inputs" : [
            {
				"internalType": "uint256",
				"name": "currentSupply", //tong cung
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokensToBuy", //so token muon mua
				"type": "uint256"
			}
        ],
        "name" : "calculateCost",
        "outputs" : [
            {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
        ],
        "stateMutability": "pure",
        "type" : "function"
    },
    {
        "inputs" : [],
        "name" : "getAllMemeTokens",
        "outputs" : [
            {
                "components": [ // cấu trúc của mỗi đối tượng trong mảng
                    {
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "symbol",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "tokenImageUrl",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fundingRaised",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "tokenAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creatorAddress",
						"type": "address"
					}
                ],
                "internalType": "struct TokenFactory.memeToken[]", //cấu trúc TokenFactory.memeToken
				"name": "",
				"type": "tuple[]" //trả về một mảng các đối tượng có kiểu tuple[]
            }
        ],
        "stateMutability": "view",
        "type" : "function"
    },
    {
        "inputs": [],
		"name": "INITIAL_PRICE", // gia khoi tao ban dau
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
    },
    {
		"inputs": [],
		"name": "K", // he so k trong cong thuc
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
    {
        "inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "memeTokenAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]


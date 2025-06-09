// abi lien quan den trao doi, mua token theo bonding curve

export const tokenAbi = [
    {
        // constructor khoi tao token khi contract duoc deploy
        "inputs": [
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
                "internalType": "uint256",
                "name": "initialMintValue",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        // loi khong du allowance, allow < needed
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        // loi tai khoan khong du token de chuyen
        "input": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        // dia chi phe duyet khong hop le
        "input": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        // dia chi nhan token khong hop le
        "input": [
            {
                "internalType": "address",
                "name": "reciever",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReciever",
        "type": "error"
    },
    {
        "input": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "input": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "error"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        // event duyet allowance cho spender
        "anonymous": false, // ho tro khi tim trong log
        "input": [
            {
                "indexed": true, // ho tro tim kiem log 
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false, // khong cho tim kiem allowance
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    }
]



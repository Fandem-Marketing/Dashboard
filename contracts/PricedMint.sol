// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ERC721A.sol";
import "./ReentrancyGuard.sol";
import "./Percentages.sol";
import "./MerkleProof.sol";

contract PricedMint is ERC721A, Ownable, ReentrancyGuard, Percentages {
    bytes32 public merkleRoot;

    // Price Per NFT
    uint256 public price;
    uint256 public alPrice;

    // Max Supply
    uint256 maxSupply;

    // Sale States
    bool public saleOpen;
    bool public alOnly;

    // Mint Count Mapping
    mapping(address => uint256) public mints;
    uint256 public mintsPerPN = 2; 
    uint256 public mintsPerAL = 2;
    uint256 public maxPerTx = 10;

    // Events
    event minted(address minter, uint256 price, address recipient, uint256 amount);
    event burned(address from, address to, uint256 id);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _price,
        uint256 _alPrice,
        uint256 _maxSupply,
        string memory _uri
    ) 
    ERC721A(name, symbol, 100, _maxSupply) 
    {
        maxSupply = _maxSupply;
        price = _price;
        alPrice = _alPrice;
        URI = _uri;
        alOnly = true;
    }

    function isAllowListed(address _recipient, bytes32[] calldata _merkleProof) public view returns(bool) {
        bytes32 leaf = keccak256(abi.encodePacked(_recipient));
        bool isal = MerkleProof.verify(_merkleProof, merkleRoot, leaf);
        return isal;
    }
    
    function mint(uint256 amount, bytes32[] calldata _merkleProof) external payable nonReentrant {
        require(saleOpen, "Sale is closed");
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        require(amount <= maxPerTx, "Exceeds maximum per transaction");

        uint256 mintPrice = price;

       if(isAllowListed(_msgSender(), _merkleProof) && (mints[_msgSender()] + amount <= mintsPerAL)) {
                require(mints[_msgSender()] + amount <= mintsPerAL, "Amount exceeds max per allow list");
                mints[_msgSender()] += amount;
                mintPrice = alPrice;
        } else {
            require(!alOnly, "Allow list only");
        }

        require(msg.value == mintPrice * amount, "Incorrect amount of ETH sent");

        _safeMint(_msgSender(), amount);
        emit minted(_msgSender(), mintPrice * amount, _msgSender(), amount);
    }

    function burn(uint256 tokenId) external {
        transferFrom(_msgSender(), address(0), tokenId);
        emit burned(_msgSender(), address(0), tokenId);
    }

    function ownerMint(uint amount, address _recipient) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Not enough left to mint");
        _safeMint(_recipient, amount);
        emit minted(_msgSender(), 0, _recipient, amount);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = _msgSender().call{value: balance}("");
        require(success, "Transfer fail");
    }

    function setURI(string memory _uri) external onlyOwner {
        URI = _uri;
    }

    function flipSaleState() external onlyOwner {
        saleOpen = !saleOpen;
    }

    function flipALState() external onlyOwner {
        alOnly = !alOnly;
    }

    function setALPrice(uint256 _alPrice) external onlyOwner {
        alPrice = _alPrice;
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function setMintsPerPN(uint256 _mintsPerPN) external onlyOwner {
        mintsPerPN = _mintsPerPN;
    }

    function setMintsPerAL(uint256 _mintsPerAL) external onlyOwner {
        mintsPerAL = _mintsPerAL;
    }

    function setMaxPerTX(uint256 _maxPerTx) external onlyOwner {
        maxPerTx = _maxPerTx;
    }

    function setRoot(bytes32 root) external onlyOwner {
        merkleRoot = root;
    }

    function pay() external payable {

    }

}
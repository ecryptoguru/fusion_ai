// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Marketplace
 * @notice Multi-chain AI model marketplace supporting native token payments, subscriptions, and reporting.
 * @dev Deploy this contract on each supported chain. Discount logic for FAI staking must be handled off-chain or via oracle.
 */
contract Marketplace is ReentrancyGuard {
    // Replace with actual deployed FAI token address on Base
    address public constant FAI_TOKEN = 0x0000000000000000000000000000000000000000;
    uint256 public constant DISCOUNT_THRESHOLD = 10 ether; // 10 FAI
    uint256 public constant DISCOUNT_PERCENT = 10; // 10%
    uint256 public constant FEE_PERCENT = 3; // 3% fee
    uint256 public constant COOLDOWN = 1 days;

    struct Model {
        uint256 id;
        string name;
        string description;
        uint256 price; // in native token (e.g., ETH, AVAX)
        address developer;
        string ipfsHash;
        uint256 ratingSum;
        uint256 ratingCount;
        uint256 totalCopies;
        uint256 copiesSold;
        uint256 subPrice; // subscription price
        uint256 subDuration; // in seconds
    }

    uint256 public nextModelId;
    mapping(uint256 => Model) public models;
    mapping(uint256 => mapping(address => uint256)) public subscriptions; // modelId => (user => expiry)
    mapping(uint256 => mapping(address => bool)) public purchases; // modelId => (user => bought)
    mapping(address => uint256) public lastListedAt; // cooldown for listModel

    // Events
    event ModelListed(uint256 indexed modelId, address indexed developer);
    event ModelPurchased(uint256 indexed modelId, address indexed buyer);
    event ModelSubscribed(uint256 indexed modelId, address indexed subscriber);
    event ModelRated(uint256 indexed modelId, uint8 rating);
    event ModelReported(uint256 indexed modelId, address indexed reporter);

    /**
     * @notice List a new AI model for sale or subscription
     */
    function listModel(
        string memory name,
        string memory description,
        uint256 price,
        string memory ipfsHash,
        uint256 totalCopies,
        uint256 subPrice,
        uint256 subDuration
    ) external {
        require(
            totalCopies > 0 || subPrice > 0,
            "Must set copies or subscription price"
        );
        require(
            block.timestamp - lastListedAt[msg.sender] >= COOLDOWN,
            "Cooldown: wait before listing again"
        );
        models[nextModelId] = Model({
            id: nextModelId,
            name: name,
            description: description,
            price: price,
            developer: msg.sender,
            ipfsHash: ipfsHash,
            ratingSum: 0,
            ratingCount: 0,
            totalCopies: totalCopies,
            copiesSold: 0,
            subPrice: subPrice,
            subDuration: subDuration
        });
        lastListedAt[msg.sender] = block.timestamp;
        emit ModelListed(nextModelId, msg.sender);
        nextModelId++;
    }

    /**
     * @notice Buy a copy of a model (native token payment, 10% discount if 10 FAI staked on Base)
     * @dev Discount eligibility must be checked off-chain or by oracle (not enforceable on-chain cross-chain)
     * @param modelId Model to purchase
     * @param discountEligible true if user is eligible for discount (must be validated off-chain)
     */
    function buyModel(uint256 modelId, bool discountEligible) external payable nonReentrant {
        Model storage m = models[modelId];
        require(m.totalCopies > 0, "No copies for sale");
        require(m.copiesSold < m.totalCopies, "All copies sold");
        require(!purchases[modelId][msg.sender], "Already purchased");
        uint256 price = m.price;
        if (discountEligible) {
            price = (price * (100 - DISCOUNT_PERCENT)) / 100;
        }
        require(msg.value == price, "Incorrect payment");
        purchases[modelId][msg.sender] = true;
        m.copiesSold++;
        uint256 fee = (msg.value * FEE_PERCENT) / 100;
        (bool sent, ) = m.developer.call{value: msg.value - fee}("");
        require(sent, "Payment failed");
        emit ModelPurchased(modelId, msg.sender);
    }

    /**
     * @notice Subscribe to a model (native token payment, 10% discount if 10 FAI staked on Base)
     * @dev Discount eligibility must be checked off-chain or by oracle (not enforceable on-chain cross-chain)
     * @param modelId Model to subscribe to
     * @param discountEligible true if user is eligible for discount (must be validated off-chain)
     */
    function subscribeModel(uint256 modelId, bool discountEligible) external payable nonReentrant {
        Model storage m = models[modelId];
        require(m.subPrice > 0, "No subscription available");
        uint256 price = m.subPrice;
        if (discountEligible) {
            price = (price * (100 - DISCOUNT_PERCENT)) / 100;
        }
        require(msg.value == price, "Incorrect payment");
        subscriptions[modelId][msg.sender] = block.timestamp + m.subDuration;
        uint256 fee = (msg.value * FEE_PERCENT) / 100;
        (bool sent, ) = m.developer.call{value: msg.value - fee}("");
        require(sent, "Payment failed");
        emit ModelSubscribed(modelId, msg.sender);
    }

    /**
     * @notice Renew a subscription for a model (native token payment, 10% discount if 10 FAI staked on Base)
     * @dev Discount eligibility must be checked off-chain or by oracle (not enforceable on-chain cross-chain)
     * @param modelId Model to renew subscription for
     * @param discountEligible true if user is eligible for discount (must be validated off-chain)
     */
    function renewSubscription(uint256 modelId, bool discountEligible) external payable nonReentrant {
        Model storage m = models[modelId];
        require(m.subPrice > 0, "No subscription available");
        uint256 price = m.subPrice;
        if (discountEligible) {
            price = (price * (100 - DISCOUNT_PERCENT)) / 100;
        }
        require(msg.value == price, "Incorrect payment");
        uint256 currentExpiry = subscriptions[modelId][msg.sender];
        if (currentExpiry < block.timestamp) {
            // Subscription expired, start new period
            subscriptions[modelId][msg.sender] = block.timestamp + m.subDuration;
        } else {
            // Extend current subscription
            subscriptions[modelId][msg.sender] = currentExpiry + m.subDuration;
        }
        uint256 fee = (msg.value * FEE_PERCENT) / 100;
        (bool sent, ) = m.developer.call{value: msg.value - fee}("");
        require(sent, "Payment failed");
        emit ModelSubscribed(modelId, msg.sender);
    }

    /**
     * @notice Rate a model (1-5) if purchased or subscribed
     */
    function rateModel(uint256 modelId, uint8 rating) external {
        require(rating >= 1 && rating <= 5, "Rating must be 1-5");
        require(
            purchases[modelId][msg.sender] || subscriptions[modelId][msg.sender] > block.timestamp,
            "Not eligible to rate"
        );
        Model storage m = models[modelId];
        m.ratingSum += rating;
        m.ratingCount++;
        emit ModelRated(modelId, rating);
    }

    /**
     * @notice Report a model for review
     */
    function reportModel(uint256 modelId) external {
        emit ModelReported(modelId, msg.sender);
    }

    /**
     * @notice Returns true if the user has purchased the model
     */
    function hasPurchased(address user, uint256 modelId) public view returns (bool) {
        return purchases[modelId][user];
    }

    /**
     * @notice Returns true if the user is currently subscribed to the model
     */
    function isSubscribed(address user, uint256 modelId) public view returns (bool) {
        return subscriptions[modelId][user] > block.timestamp;
    }
}

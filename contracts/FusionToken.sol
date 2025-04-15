// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FusionToken (FAI)
 * @notice ERC-20 token with staking functionality for the Fusion AI Marketplace.
 * @dev Deployed on Base chain (testnet: Base Sepolia, chain ID 84532)
 */
contract FusionToken is ERC20, Ownable {
    // Mapping of user address to staked token amount
    mapping(address => uint256) public stakedBalances;

    // Events for staking actions
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    constructor() ERC20("Fusion", "FAI") {
        // 18 decimals by default
    }

    /**
     * @notice Mint FAI tokens (for testing, onlyOwner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Stake FAI tokens (lock tokens in contract)
     */
    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        _transfer(msg.sender, address(this), amount);
        stakedBalances[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Unstake FAI tokens (unlock tokens from contract)
     */
    function unstake(uint256 amount) external {
        require(amount > 0, "Cannot unstake 0");
        require(stakedBalances[msg.sender] >= amount, "Not enough staked");
        stakedBalances[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @notice Get staked balance of a user
     */
    function getStakedBalance(address user) external view returns (uint256) {
        return stakedBalances[user];
    }
}

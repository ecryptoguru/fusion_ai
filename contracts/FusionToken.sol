// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FusionToken is ERC20, Ownable {
    mapping(address => uint256) public staked;

    constructor() ERC20("Fusion AI Token", "FAI") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function stake(uint256 amount) public {
        _transfer(msg.sender, address(this), amount);
        staked[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        require(staked[msg.sender] >= amount, "Not enough staked");
        staked[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
    }

    function stakedBalance(address user) public view returns (uint256) {
        return staked[user];
    }
}

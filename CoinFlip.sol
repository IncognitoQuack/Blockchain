// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    event FlipResult(address indexed player, uint256 amount, bool won);

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool _guess) public payable returns (bool) {
        require(msg.value > 0, "You must bet some ETH");
        require(address(this).balance >= msg.value * 2, "Contract does not have enough funds to cover potential winnings");

        bool coinFlip = (block.timestamp % 2) == 0;

        if (coinFlip == _guess) {
            uint256 winnings = msg.value * 2;
            payable(msg.sender).transfer(winnings);
            emit FlipResult(msg.sender, msg.value, true);
            return true;
        } else {
            emit FlipResult(msg.sender, msg.value, false);
            return false;
        }
    }

    // Function to fund the contract
    function fundContract() public payable {}

    // Function to check the contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Fallback function to receive ETH
    receive() external payable {}
}

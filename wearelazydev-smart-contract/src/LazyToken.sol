// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LazyToken is ERC20, Ownable {
    constructor() ERC20("LazyDevToken", "LAZY") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}

// contract LazyToken is ERC20 {
//     constructor() ERC20("LazyToken", "LAZY") {
//         // Mint 1 juta token ke alamat deployer
//         _mint(msg.sender, 1_000_000 * 10 ** decimals());
//     }
// }

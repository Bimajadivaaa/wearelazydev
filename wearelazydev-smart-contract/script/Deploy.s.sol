// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {SwapToken} from "../src/SwapToken.sol";
import {IssuesClaim} from "../src/IssuesClaim.sol";
import {MockERC20} from "../test/ContractTest.t.sol";

contract DeployScript is Script {
    function run() external {
        // Retrieve private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy LazyToken first
        MockERC20 lazyToken = new MockERC20();
        // console.log("LazyToken deployed at:", address(lazyToken));

        // Deploy SwapToken
        new SwapToken(address(lazyToken));
        // console.log("SwapToken deployed at:", address(swapToken));

        // Deploy IssuesClaim
        new IssuesClaim(address(lazyToken));
        // console.log("IssuesClaim deployed at:", address(issuesClaim));

        // Optional: Setup initial liquidity or configuration
        // Example: Mint some tokens to deployer
        lazyToken.mint(msg.sender, 1000000 * 10 ** 18);
        // console.log("Minted initial tokens to:", msg.sender);

        vm.stopBroadcast();

        // Log deployment summary
        // console.log("\nDeployment Summary:");
        // console.log("------------------");
        // console.log("Network:", block.chainid);
        // console.log("LazyToken:", address(lazyToken));
        // console.log("SwapToken:", address(swapToken));
        // console.log("IssuesClaim:", address(issuesClaim));
    }
}

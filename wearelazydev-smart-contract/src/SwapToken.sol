// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapToken {
    IERC20 public lazyToken;
    mapping(address => uint256) public tokenBalances;
    mapping(address => uint256) public ethBalances;

    event LiquidityAdded(address token, uint256 amount);
    event LiquidityRemoved(address token, uint256 amount);
    event Swapped(
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(address _lazyToken) {
        lazyToken = IERC20(_lazyToken);
    }

    function addLiquidity(address token, uint256 amount) external payable {
        if (token == address(0)) {
            require(msg.value == amount, "Incorrect ETH amount");
            ethBalances[token] += amount;
        } else {
            require(msg.value == 0, "ETH not needed");
            require(
                lazyToken.transferFrom(msg.sender, address(this), amount),
                "Transfer failed"
            );
            tokenBalances[token] += amount;
        }

        emit LiquidityAdded(token, amount);
    }

    function removeLiquidity(address token, uint256 amount) external {
        if (token == address(0)) {
            require(ethBalances[token] >= amount, "Insufficient liquidity");
            ethBalances[token] -= amount;
            payable(msg.sender).transfer(amount);
        } else {
            require(tokenBalances[token] >= amount, "Insufficient liquidity");
            tokenBalances[token] -= amount;
            require(lazyToken.transfer(msg.sender, amount), "Transfer failed");
        }

        emit LiquidityRemoved(token, amount);
    }

    function calculateSwap(
        address fromToken,
        address toToken,
        uint256 amountIn
    ) public view returns (uint256) {
        uint256 fromBalance = fromToken == address(0)
            ? ethBalances[fromToken]
            : tokenBalances[fromToken];
        uint256 toBalance = toToken == address(0)
            ? ethBalances[toToken]
            : tokenBalances[toToken];

        // Using constant product formula: x * y = k
        uint256 amountOut = (amountIn * toBalance) / (fromBalance + amountIn);
        return amountOut;
    }

    function swap(
        address fromToken,
        address toToken,
        uint256 amount
    ) external payable {
        require(fromToken != toToken, "Same token");
        uint256 amountIn = amount;

        if (fromToken == address(0)) {
            require(msg.value == amountIn, "Incorrect ETH sent");
            ethBalances[fromToken] += amountIn;
        } else {
            require(msg.value == 0, "ETH not needed");
            require(
                lazyToken.transferFrom(msg.sender, address(this), amountIn),
                "Transfer failed"
            );
            tokenBalances[fromToken] += amountIn;
        }

        uint256 amountOut = calculateSwap(fromToken, toToken, amountIn);

        if (toToken == address(0)) {
            require(ethBalances[toToken] >= amountOut, "Insufficient liquidity");
            ethBalances[toToken] -= amountOut;
            payable(msg.sender).transfer(amountOut);
        } else {
            require(
                tokenBalances[toToken] >= amountOut,
                "Insufficient liquidity"
            );
            tokenBalances[toToken] -= amountOut;
            require(lazyToken.transfer(msg.sender, amountOut), "Transfer failed");
        }

        emit Swapped(fromToken, toToken, amountIn, amountOut);
    }
}
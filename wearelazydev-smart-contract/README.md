# 🛠 Deploy & Test Smart Contracts using Foundry

This guide provides step-by-step instructions on how to **deploy, test, and verify** the smart contracts in the **wearelazydev** project using [Foundry](https://github.com/foundry-rs/foundry).

---

## 📌 Prerequisites
Ensure you have the following installed:
- **Foundry** → Install it using:
  ```sh
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```
- **Git** → Clone the repository
- **Ethereum Node Provider** (e.g., Alchemy, Infura, or Anvil for local testing)

---

## 📥 Clone the Repository
```sh
git clone https://github.com/wearelazydev/smart-contracts.git
cd smart-contracts
```

---

## 🔧 Install Dependencies
```sh
forge install
```

---

## ⚙️ Configure Environment Variables
Create a `.env` file and add the required variables:
```sh
touch .env
```
Add the following values:
```env
PRIVATE_KEY=
ETHERSCAN_API_KEY=
RPC_URL=
```
Replace with your actual credentials:
- **PRIVATE_KEY** → Your deployer wallet's private key
- **ETHERSCAN_API_KEY** → API key for contract verification
- **RPC_URL** → Ethereum RPC URL (Sepolia, Mainnet, or other networks)

---

## 🚀 Compile Smart Contracts
```sh
forge build
```
This will compile the contracts located in the `src/` folder.

---

## 🧪 Run Tests
Run unit tests using Foundry:
```sh
forge test
```
For detailed logs, use:
```sh
forge test -vvvv
```

---

## 🔥 Deploy Smart Contracts
Deploy contracts to a testnet (e.g., Sepolia) using:
```sh
forge script scripts/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```
If you are deploying locally using Anvil:
```sh
anvil &
forge script scripts/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --private-key $PRIVATE_KEY --broadcast
```

---

## ✅ Verify Smart Contracts
After deploying, verify the contract on Etherscan:
```sh
forge verify-contract --chain-id 11155111 --num-of-optimizations 200 --watch <DEPLOYED_CONTRACT_ADDRESS> <CONTRACT_PATH>:<CONTRACT_NAME> --etherscan-api-key $ETHERSCAN_API_KEY
```
Example for `IssuesClaim.sol`:
```sh
forge verify-contract --chain-id 11155111 --num-of-optimizations 200 --watch 0xab104a8271eb37f2c244130afbc574a80dcd5c09 src/IssuesClaim.sol:IssuesClaim --etherscan-api-key $ETHERSCAN_API_KEY
```

---

## 📌 Smart Contracts in this Repository
| Contract Name       | Description |
|--------------------|-------------|
| **IssuesClaim.sol** | Handles issue bounties and developer claims |
| **LazyToken.sol**   | ERC-20 token used for bounty rewards ($LAZY) |
| **SwapToken.sol**   | Enables swapping between ETH and $LAZY |

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🎯 Conclusion
Congratulations! 🎉 You have successfully deployed, tested, and verified the smart contracts for **wearelazydev** using Foundry.

If you encounter issues, check the `.env` values or refer to Foundry's official [documentation](https://book.getfoundry.sh/). 🚀

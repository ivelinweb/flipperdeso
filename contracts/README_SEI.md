# Flipper Contracts for Sei EVM Testnet (Atlantic-2)

This README provides instructions for deploying and using the Flipper contracts on the Sei EVM Testnet (Atlantic-2).

## Network Information

- **Network**: Sei EVM Testnet (Atlantic-2)
- **Currency**: SEI
- **Chain ID**: 1328
- **RPC URL**: https://evm-rpc-testnet.sei-apis.com
- **Explorer**: https://seitrace.com/?chain=atlantic-2

## Prerequisites

1. Install Node.js and npm
2. Install Truffle: `npm install -g truffle`
3. Configure MetaMask with Sei EVM Testnet (Atlantic-2)
4. Get some testnet SEI tokens

## Setting Up MetaMask for Sei EVM Testnet

1. Open MetaMask
2. Click on the network dropdown
3. Click "Add Network"
4. Click "Add a network manually"
5. Enter the following details:
   - Network Name: Sei EVM Testnet (Atlantic-2)
   - New RPC URL: https://evm-rpc-testnet.sei-apis.com
   - Chain ID: 1328
   - Currency Symbol: SEI
   - Block Explorer URL: https://seitrace.com/?chain=atlantic-2
6. Click "Save"

## Deploying Contracts

1. Create a `.env` file in the `contracts` directory with the following content:
   ```
   MNEMONIC="your mnemonic phrase here"
   SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com
   ```

2. Deploy the contracts to Sei EVM Testnet:
   ```
   cd contracts
   truffle migrate --network sei
   ```

3. After deployment, note the contract addresses printed in the console.

4. Update the contract address in `frontend/services/oracleConsumerService.js` with the deployed Donation contract address.

## Interacting with the Contracts

### Using the Mock Price Feed

The Donation contract deploys a mock price feed for SEI/USD. The initial price is set to $0.50 with 8 decimals (50000000).

To update the price feed:

1. Get the Donation contract instance
2. Call the `updatePriceFeed` function with the new price (with 8 decimals)

Example:
```javascript
// Update price to $0.75 (75000000)
await donationContract.updatePriceFeed(75000000);
```

### Converting SEI to USD

To convert SEI to USD:

```javascript
const seiAmount = ethers.parseEther("1.0"); // 1 SEI
const usdAmount = await donationContract.convertSEIToUSD(seiAmount);
console.log(`1 SEI = $${ethers.formatUnits(usdAmount, 18)} USD`);
```

### Converting USD to SEI

To convert USD to SEI:

```javascript
const usdAmount = ethers.parseEther("1.0"); // $1 USD
const seiAmount = await donationContract.convertUSDToSEI(usdAmount);
console.log(`$1 USD = ${ethers.formatUnits(seiAmount, 18)} SEI`);
```

### Making Donations

To make a donation:

```javascript
const recipient = "0xRecipientAddress";
const usdAmount = 10; // $10 USD
await donateAmount(provider, recipient, usdAmount);
```

## Notes

- The mock price feed is for demonstration purposes only and should be replaced with a real Chainlink price feed when available on Sei EVM Testnet.
- Make sure to have enough testnet SEI tokens in your wallet for gas fees and transactions.

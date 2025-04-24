// Script to deploy contracts to Sei EVM Testnet (Atlantic-2)
const ethers = require("ethers");
require('dotenv').config();

async function main() {
  console.log("Deploying contracts to Sei EVM Testnet (Atlantic-2)...");

  // Connect to the Sei EVM Testnet
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEI_RPC_URL || "https://evm-rpc-testnet.sei-apis.co");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log(`Deploying contracts with the account: ${wallet.address}`);
  console.log(`Account balance: ${ethers.utils.formatEther(await provider.getBalance(wallet.address))} SEI`);

  // Deploy the Donation contract
  console.log("Deploying Donation contract...");

  // Get the contract artifacts
  const DonationArtifact = require('../build/contracts/Donation.json');

  // Create a contract factory
  const factory = new ethers.ContractFactory(
    DonationArtifact.abi,
    DonationArtifact.bytecode,
    wallet
  );

  // Deploy the contract
  const donation = await factory.deploy();
  await donation.deployed();

  console.log(`Donation contract deployed to: ${donation.address}`);

  // Get the address of the mock price feed
  const priceFeedAddress = await donation.priceFeedAddress();
  console.log(`Mock SEI/USD Price Feed deployed to: ${priceFeedAddress}`);

  // Update the price feed to a realistic value (e.g., $0.75 with 8 decimals)
  console.log("Updating price feed to $0.75...");
  await donation.updatePriceFeed(75000000);

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

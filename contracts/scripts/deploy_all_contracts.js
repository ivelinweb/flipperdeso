// Script to deploy all contracts to Sei EVM Testnet (Atlantic-2)
const ethers = require("ethers");
require('dotenv').config();

// Import contract artifacts
const DonationArtifact = require('../build/contracts/Donation.json');
const PostFactoryArtifact = require('../build/contracts/PostFactory.json');
const ProfileImageFactoryArtifact = require('../build/contracts/ProfileImageFactory.json');

async function main() {
  console.log("Deploying contracts to Sei EVM Testnet (Atlantic-2)...");
  
  // Connect to the Sei EVM Testnet
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEI_RPC_URL || "https://evm-rpc-testnet.sei-apis.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log(`Deploying contracts with the account: ${wallet.address}`);
  console.log(`Account balance: ${ethers.utils.formatEther(await provider.getBalance(wallet.address))} SEI`);
  
  // Deploy the Donation contract
  console.log("\n1. Deploying Donation contract...");
  const donationFactory = new ethers.ContractFactory(
    DonationArtifact.abi,
    DonationArtifact.bytecode,
    wallet
  );
  
  const donation = await donationFactory.deploy();
  await donation.deployed();
  console.log(`Donation contract deployed to: ${donation.address}`);
  
  // Get the address of the mock price feed
  const priceFeedAddress = await donation.priceFeedAddress();
  console.log(`Mock SEI/USD Price Feed deployed to: ${priceFeedAddress}`);
  
  // Update the price feed to a realistic value (e.g., $0.75 with 8 decimals)
  console.log("Updating price feed to $0.75...");
  await donation.updatePriceFeed(75000000);
  
  // Wait for 10 seconds to avoid rate limiting
  console.log("Waiting for 10 seconds to avoid rate limiting...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Deploy the PostFactory contract
  console.log("\n2. Deploying PostFactory contract...");
  const postFactoryFactory = new ethers.ContractFactory(
    PostFactoryArtifact.abi,
    PostFactoryArtifact.bytecode,
    wallet
  );
  
  const postFactory = await postFactoryFactory.deploy();
  await postFactory.deployed();
  console.log(`PostFactory contract deployed to: ${postFactory.address}`);
  
  // Wait for 10 seconds to avoid rate limiting
  console.log("Waiting for 10 seconds to avoid rate limiting...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Deploy the ProfileImageFactory contract
  console.log("\n3. Deploying ProfileImageFactory contract...");
  const profileImageFactoryFactory = new ethers.ContractFactory(
    ProfileImageFactoryArtifact.abi,
    ProfileImageFactoryArtifact.bytecode,
    wallet
  );
  
  const profileImageFactory = await profileImageFactoryFactory.deploy();
  await profileImageFactory.deployed();
  console.log(`ProfileImageFactory contract deployed to: ${profileImageFactory.address}`);
  
  // Summary of deployed contracts
  console.log("\n=== Deployed Contracts Summary ===");
  console.log(`Donation: ${donation.address}`);
  console.log(`Mock SEI/USD Price Feed: ${priceFeedAddress}`);
  console.log(`PostFactory: ${postFactory.address}`);
  console.log(`ProfileImageFactory: ${profileImageFactory.address}`);
  
  // Update the backend .env file with the deployed contract addresses
  console.log("\nUpdate your backend/.env file with the following:");
  console.log(`POST_FACTORY_CONTRACT_ADDRESS=${postFactory.address}`);
  
  // Update the frontend services with the deployed contract addresses
  console.log("\nUpdate your frontend/services/userContractCreator.js with:");
  console.log(`const contractAddress = '${profileImageFactory.address}'`);
  
  console.log("\nUpdate your frontend/services/oracleConsumerService.js with:");
  console.log(`const contractAddress = '${donation.address}'`);
  
  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

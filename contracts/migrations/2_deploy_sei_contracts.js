const contractDonation = artifacts.require("Donation");

module.exports = function(deployer) {
  // Deploy the Donation contract which will automatically deploy the MockSeiUsdPriceFeed
  deployer.deploy(contractDonation);
};

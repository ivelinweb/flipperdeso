// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "../../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../Mocks/MockSeiUsdPriceFeed.sol";

contract Donation {
    using SafeMath for uint256; // For versions < 0.6

    mapping(address => uint256) public addressToFunded;
    address public owner;

    // Funders test is by array index
    address[] public funders;

    AggregatorV3Interface internal dataFeed;
    address public priceFeedAddress;

     /**
     * Network: Sei EVM Testnet (Atlantic-2)
     * Aggregator: SEI/USD
     * Using a mock price feed for SEI/USD since Chainlink price feeds may not be available on Sei EVM Testnet yet
     */

    constructor() {
        // Deploy a mock price feed for SEI/USD
        // Initial price: $0.50 with 8 decimals (50000000)
        MockSeiUsdPriceFeed mockPriceFeed = new MockSeiUsdPriceFeed(
            50000000,           // Initial price: $0.50 with 8 decimals
            8,                  // Decimals: 8 (standard for Chainlink price feeds)
            "SEI / USD",        // Description
            1                   // Version
        );

        dataFeed = AggregatorV3Interface(address(mockPriceFeed));
        priceFeedAddress = address(mockPriceFeed);
        owner = msg.sender;
    }

    // Function that allows user to deposit
    function transferFunds(address payable recipient) public payable {
        // Optional: minimum input value
        // uint256 minimumUSD = 1 * 10 ** 18;
        // require(convertETHToUSD(msg.value) >= minimumUSD, "The minimum value(1 U$) was not reached!");

        addressToFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
        recipient.transfer(address(this).balance);
    }

    // Function that returns the balance of contract
    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function that converts get the price from data feed
    function getPriceData() public view returns (uint256) {
        (,int256 price,,,) = dataFeed.latestRoundData();
        return uint256(price *  100000000);
        // 190275000000 -> 8 decimals -> 1,902.75000000
    }

    // Function that get the version of data feed
    function getVersion() public view returns(uint256) {
        return dataFeed.version();
    }

    // Function that get the conversion rate SEI/USD
    function convertSEIToUSD(uint256 seiAmount) public view returns (uint256) {
        uint256 seiPrice = getPriceData();
        uint256 seiAmountInUsd = (seiPrice * seiAmount) / 1000000000000000000;

        return seiAmountInUsd;
        // 1 gwei(1000000000) to U$
    }

    // Function that get the conversion rate USD/SEI
    function convertUSDToSEI(uint256 usdAmount) public view returns (uint256) {
        uint256 seiPrice = getPriceData();
        // uint256 seiAmount = (usdAmount * 10 **10)/ (seiPrice);
        uint256 seiAmount = (usdAmount  * 10 ** 18 / seiPrice);

        return seiAmount;
    }

    // Modifier that checks if the user is the contract owner
    modifier isOwner {
        require(msg.sender == owner, "You're not the contract owner");
        _;
    }

    // Function that withdraw the amount sent to the fund
    function withdraw() payable isOwner public {
        // Send the money deposited to the contract owner
        payable(msg.sender).transfer(address(this).balance);

        // Reseting all the variables
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToFunded[funder] = 0;
        }
        funders = new address[](0);
    }

    // Function to update the price feed (only for testing purposes)
    function updatePriceFeed(int256 _newPrice) external isOwner {
        MockSeiUsdPriceFeed(priceFeedAddress).updatePrice(_newPrice);
    }
}
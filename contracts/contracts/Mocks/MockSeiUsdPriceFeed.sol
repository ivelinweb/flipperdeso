// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title MockSeiUsdPriceFeed
 * @dev This contract mocks a Chainlink price feed for SEI/USD on Sei EVM Testnet (Atlantic-2)
 */
contract MockSeiUsdPriceFeed is AggregatorV3Interface {
    // Mock price data
    int256 private s_price;
    uint8 private s_decimals;
    string private s_description;
    uint256 private s_version;

    constructor(
        int256 _initialPrice,
        uint8 _decimals,
        string memory _description,
        uint256 _version
    ) {
        s_price = _initialPrice;
        s_decimals = _decimals;
        s_description = _description;
        s_version = _version;
    }

    function decimals() external view override returns (uint8) {
        return s_decimals;
    }

    function description() external view override returns (string memory) {
        return s_description;
    }

    function version() external view override returns (uint256) {
        return s_version;
    }

    function getRoundData(uint80 _roundId)
        external
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        // Not implemented for the mock
        return (_roundId, 0, 0, 0, 0);
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            uint80(0),          // roundId
            s_price,            // answer (price)
            block.timestamp,    // startedAt
            block.timestamp,    // updatedAt
            uint80(0)           // answeredInRound
        );
    }

    // Function to update the price (only for testing purposes)
    function updatePrice(int256 _newPrice) external {
        s_price = _newPrice;
    }
}

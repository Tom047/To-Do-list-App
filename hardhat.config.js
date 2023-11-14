require("@nomicfoundation/hardhat-toolbox");

const BSC_TESTNET_PRIVATE_KEY = process.env.BSC_TESTNET_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // hardhat.config.ts
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          evmVersion: 'paris'
        }
      }
    ]
  },
  networks: {
    bsctestnet: {
      url: "https://endpoints.omniatech.io/v1/bsc/testnet/public",
      accounts: [BSC_TESTNET_PRIVATE_KEY].filter(Boolean) // Ensures that undefined or empty values are not included
    }
  }
};

// require("@nomicfoundation/hardhat-toolbox");
//
// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.19",
// };

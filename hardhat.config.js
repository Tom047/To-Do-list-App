require("@nomicfoundation/hardhat-toolbox");

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
  }
};

// require("@nomicfoundation/hardhat-toolbox");
//
// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.19",
// };

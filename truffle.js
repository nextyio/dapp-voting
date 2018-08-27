/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

//module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
//};

require('dotenv').config();
require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('truffle-hdwallet-provider');
const HDmnemonic= "accident people carpet dice ring diary produce base want shrimp melt side"

const providerWithMnemonic = (mnemonic, rpcEndpoint) =>
  new HDWalletProvider(mnemonic, rpcEndpoint);

const infuraProvider = network => providerWithMnemonic(
  process.env.MNEMONIC || '',
  `https://${network}.infura.io/${process.env.INFURA_API_KEY}`
);

const PrivateKeyProvider = require('truffle-privatekey-provider');
const pkey= 'B72F001329A170CB0F64851EE3B03779B17865003F95CC0BDF4BAB981F5FB257';

const ropstenProvider = process.env.SOLIDITY_COVERAGE
  ? undefined
  : infuraProvider('ropsten');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    },
    testnetGanache: {
      provider: () =>
      new PrivateKeyProvider(
        pkey,
        `http://127.0.0.1:8545`,
      ),
      network_id: '5777', // eslint-disable-line camelcase
    },
    testnetNexty: {
      provider: () =>
      new PrivateKeyProvider(
        pkey,
        `http://125.212.250.61:11111`,
      ),
      //gas: 21000000000000,
      //gas: 3e18,
      //gasPrice: 10000000000,
      gas: 21000000000,
      gasPrice: 300000,
      network_id: 66666, // eslint-disable-line camelcase
    },
    ropsten: {
      provider: ropstenProvider,
      network_id: 3, // eslint-disable-line camelcase
    },
    coverage: {
      host: 'localhost',
      network_id: '*', // eslint-disable-line camelcase
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    }
  }
}

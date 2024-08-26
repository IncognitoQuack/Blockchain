import web3 from './web3';
import CoinFlip from './CoinFlip.json';

const contractAddress = '  Demo address  ';  // Ensure this is the correct deployed contract address

const instance = new web3.eth.Contract(
  CoinFlip.abi,
  contractAddress
);

export default instance; 
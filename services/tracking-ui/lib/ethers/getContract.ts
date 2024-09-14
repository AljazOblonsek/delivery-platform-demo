import { AbstractProvider, Contract, InfuraProvider, JsonRpcProvider } from 'ethers';
import smartContractJSON from '../assets/Delivery.json';

const createProvider = (): AbstractProvider => {
  if (process.env.ETHEREUM_PROVIDER === 'localhost') {
    return new JsonRpcProvider(process.env.LOCAL_NODE_URL);
  } else {
    return new InfuraProvider(process.env.ETHEREUM_PROVIDER, process.env.INFURA_API_KEY);
  }
};

export const getContract = (): Contract => {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('No contract address provided');
    }

    return new Contract(contractAddress, smartContractJSON.abi, createProvider());
  } catch (e) {
    throw e;
  }
};

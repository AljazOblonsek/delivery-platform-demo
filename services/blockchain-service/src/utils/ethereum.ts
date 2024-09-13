import { AbstractProvider, Contract, InfuraProvider, JsonRpcProvider, Wallet } from 'ethers';
// @ts-expect-error Allow import of JSON file
import smartContractJson from '../../assets/Delivery.json';
import { env } from '../config/env';

const createProvider = (): AbstractProvider => {
  if (env.ETHEREUM_PROVIDER === 'localhost') {
    return new JsonRpcProvider(env.LOCAL_NODE_URL);
  } else {
    return new InfuraProvider(env.ETHEREUM_PROVIDER, env.INFURA_API_KEY);
  }
};

export const getWallet = (privateKey: string): Wallet => {
  return new Wallet(privateKey, createProvider());
};

export const getContract = (): Contract => {
  return new Contract(env.CONTRACT_ADDRESS, smartContractJson.abi, createProvider());
};

export const getContractWithWallet = (privateKey: string): Contract => {
  const wallet = new Wallet(privateKey, createProvider());
  return new Contract(env.CONTRACT_ADDRESS, smartContractJson.abi, wallet);
};

import { join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

dotenvConfig({ path: join(__dirname, '.env') });

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  paths: {
    cache: './cache',
    artifacts: './artifacts',
    sources: './src',
  },
  networks:
    process.env.NODE_ENV === 'test'
      ? undefined
      : {
          testnet: {
            url: process.env.SEPOLIA_INFURA_URL,
            accounts: [process.env.DEPLOYMENT_WALLET_PRIVATE_KEY as string],
          },
        },
  etherscan:
    process.env.NODE_ENV === 'test'
      ? undefined
      : {
          apiKey: {
            sepolia: process.env.ETHERSCAN_API_KEY as string,
          },
        },
};

export default config;

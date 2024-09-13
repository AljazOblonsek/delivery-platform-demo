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
};

export default config;

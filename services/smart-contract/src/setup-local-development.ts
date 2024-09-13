import chalk from 'chalk';
import { NonceManager } from 'ethers';
import { ethers } from 'hardhat';

const main = async (): Promise<void> => {
  const walletsJson = process.env.LOCAL_DEVELOPMENT_SETUP_DATA;

  if (!walletsJson) {
    console.log(
      chalk.red(
        `You must provide contents of the ${chalk.bold('/scripts/startup/local-development-setup-data.json')} as ${chalk.bold('LOCAL_DEVELOPMENT_SETUP_DATA')} environment variable when running this file.`
      )
    );
    return;
  }

  const wallets = JSON.parse(walletsJson) as {
    contractWalletPrivateKey: string;
    deliveryWalletOnePrivateKey: string;
    deliveryWalletTwoPrivateKey: string;
  };

  const localProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');

  const deploymentWallet = new NonceManager(
    new ethers.Wallet(wallets.contractWalletPrivateKey, localProvider)
  );

  const contract = await ethers.deployContract('Delivery', { signer: deploymentWallet });

  console.log(`Contract being deployed by address: ${contract.deploymentTransaction()!.from}`);
  console.log(
    `Contract being deployed with transaction id: ${contract.deploymentTransaction()!.hash}`
  );

  await contract.waitForDeployment();

  console.log('Contract deployed 🎉');
  console.log(`Contract address: ${chalk.greenBright(contract.target)}`);

  const deliveryWalletOne = new ethers.Wallet(wallets.deliveryWalletOnePrivateKey, localProvider);
  const deliveryWalletTwo = new ethers.Wallet(wallets.deliveryWalletTwoPrivateKey, localProvider);

  await contract.addDeliveryCompanyAddress(deliveryWalletOne.address);
  await contract.addDeliveryCompanyAddress(deliveryWalletTwo.address);

  console.log(
    `Added two wallets as delivery company wallets: ${chalk.greenBright(deliveryWalletOne.address)}, ${chalk.greenBright(deliveryWalletTwo.address)}`
  );
};

main();

import chalk from 'chalk';
import { ethers } from 'hardhat';

const main = async (): Promise<void> => {
  const contract = await ethers.deployContract('Delivery');

  console.log(`Contract being deployed by address: ${contract.deploymentTransaction()!.from}`);
  console.log(
    `Contract being deployed with transaction id: ${contract.deploymentTransaction()!.hash}`
  );

  await contract.waitForDeployment();

  console.log('Contract deployed 🎉');
  console.log(`Contract address: ${chalk.greenBright(contract.target)}`);
};

main();

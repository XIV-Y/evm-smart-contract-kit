const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address)

  const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(deployerBalance));

  const XIVYToken = await hre.ethers.getContractFactory("XIVYToken");
  const xivyToken = await XIVYToken.deploy();

  await xivyToken.waitForDeployment();

  const deployedAddress = await xivyToken.getAddress();
  console.log("Token deployed to:", deployedAddress);

  return {
    tokenAddress: deployedAddress,
  };
}

main()
  .then((deployInfo) => {
    console.log("Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed!");
    console.error(error);
    process.exit(1);
  });
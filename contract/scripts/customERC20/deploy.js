const hre = require("hardhat");

async function main() {
  const tokenName = "Sample Token";
  const tokenSymbol = "SAMPLE";

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address)

  const CustomERC20 = await hre.ethers.getContractFactory("CustomERC20");
  const customERC20 = await CustomERC20.deploy(tokenName, tokenSymbol, deployer.address);

  await customERC20.waitForDeployment();

  const contractAddress = await customERC20.getAddress();
  console.log("CustomERC20 deployed to:", contractAddress);
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

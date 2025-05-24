const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address)


  const XIVYRandomToken = await ethers.getContractFactory("XIVYRandomToken");
  const SimpleRandomOracle = await ethers.getContractFactory("SimpleRandomOracle");

  const oracle = await SimpleRandomOracle.deploy();
  await oracle.waitForDeployment();
  console.log("SimpleRandomOracle deployed to:", oracle.target);

  const token = await XIVYRandomToken.deploy();
  await token.waitForDeployment();
  console.log("XIVYRandomToken deployed to:", token.target);

  const tx = await token.setRandomOracle(oracle.target);
  await tx.wait();
  console.log("Random oracle set:", oracle.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
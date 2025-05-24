const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address)

  const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(deployerBalance));

  // await deploy()

  await upgrade()
}

const deploy = async () => {
  const XIVYToken = await hre.ethers.getContractFactory("UpgradeXIVYToken");
  const xivyToken = await hre.upgrades.deployProxy(XIVYToken, ["UXIVY", "UXIV", 1000000, 1000000], { initializer: "initialize" });

  await xivyToken.waitForDeployment();

  const deployedAddress = await xivyToken.getAddress();
  console.log("Token deployed to:", deployedAddress);
}

const upgrade = async () => {
  const proxyAddress = "0x16cF66F2228Bf62D2D20d90d14373B0ecF65A5b4";
  const xivyToken = await ethers.getContractFactory("UpgradeXIVYToken");
  await hre.upgrades.upgradeProxy(proxyAddress, xivyToken);

  console.log("Token deployed to:", proxyAddress);
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
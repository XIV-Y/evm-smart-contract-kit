const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() { 
  await hre.run("compile");

  console.log("Compiling contracts...");
  
  const artifactPath = path.join(__dirname, "../../artifacts/contracts/customERC20.sol/CustomERC20.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const jsContent = `
export const CUSTOM_ERC20_ABI = ${JSON.stringify(artifact.abi, null, 2)};

export const CUSTOM_ERC20_BYTECODE = "${artifact.bytecode}";

export default {
  abi: CUSTOM_ERC20_ABI,
  bytecode: CUSTOM_ERC20_BYTECODE
};
`;

  const outputPath = path.join(__dirname, "./customERC20.js");
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, jsContent);
  
  console.log("Contract ABI and bytecode exported to:", outputPath);
  console.log("You can now import this in your React app:");
  console.log('import { CUSTOM_ERC20_ABI, CUSTOM_ERC20_BYTECODE } from "./contracts/customERC20";');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
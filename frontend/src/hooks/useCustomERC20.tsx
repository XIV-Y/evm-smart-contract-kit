import { ethers } from "ethers";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";

import {
  CUSTOM_ERC20_ABI,
  CUSTOM_ERC20_BYTECODE,
} from "../contracts/compiled-customERC20.js";

import { getProvider } from "../lib/ethers.js";
import { confirmAndOpenExplorer } from "../lib/utils.js";

const useCustomERC20 = () => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const deploy = async () => {
    try {
      if (!address || !isConnected) {
        alert("Wallet address is required.");
        return;
      }

      const tokenName = "Test1";
      const tokenSymbol = "Test1Symbol";
      const ownerAddress = address;

      const provider = getProvider(walletProvider);

      const contractFactory = new ethers.ContractFactory(
        CUSTOM_ERC20_ABI,
        CUSTOM_ERC20_BYTECODE,
        provider.getSigner()
      );

      const deployTransaction = contractFactory.getDeployTransaction(
        tokenName,
        tokenSymbol,
        ownerAddress
      );

      const estimatedGas = await provider.estimateGas(deployTransaction);
      console.log("Estimated gas:", estimatedGas.toString());

      const contract = await contractFactory.deploy(
        tokenName,
        tokenSymbol,
        ownerAddress,
        {
          gasLimit: estimatedGas.add(ethers.BigNumber.from(50000)),
        }
      );

      const deployedContract = await contract.deployed();
      const contractAddress = deployedContract.address;

      const name = await deployedContract.name();
      const symbol = await deployedContract.symbol();
      const owner = await deployedContract.owner();
      const txHash = contract.deployTransaction.hash;

      const deployedInfo = {
        address: contractAddress,
        name,
        symbol,
        owner,
        transactionHash: txHash,
      };

      console.log("Contract deployed successfully:", deployedInfo);

      const network = await provider.getNetwork();

      confirmAndOpenExplorer(network.chainId, txHash);
    } catch (error) {
      alert(`作成失敗: ${error}`);
    }
  };

  return {
    deploy,
  };
};

export default useCustomERC20;

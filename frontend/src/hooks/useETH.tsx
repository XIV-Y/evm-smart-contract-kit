import { ethers } from "ethers";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { getProvider } from "../lib/ethers";
import { confirmAndOpenExplorer } from "../lib/utils";

const useETH = () => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const transfer = async (recipientAddress: string) => {
    try {
      if (!address || !isConnected) {
        alert("Wallet address is required.");
        return;
      }

      const provider = getProvider(walletProvider);
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther("0.000001");

      // トランザクションオブジェクトを作成
      const tx = {
        to: recipientAddress,
        value: amountInWei,
      };

      const txResponse = await signer.sendTransaction(tx);
      const receipt = await txResponse.wait();

      confirmAndOpenExplorer(receipt.transactionHash);
    } catch (error) {
      alert(`転送失敗: ${error}`);
      throw error;
    }
  };

  const balanceOf = async (walletAddress: string) => {
    try {
      const targetAddress = walletAddress;

      if (!targetAddress || !isConnected) {
        alert("Wallet address is required.");
        return;
      }

      const provider = getProvider(walletProvider);
      const balanceWei = await provider.getBalance(targetAddress);
      const balance = ethers.utils.formatEther(balanceWei);

      return {
        balance,
        symbol: "ETH",
      };
    } catch (error) {
      alert(`残高取得エラー: ${error}`);
      throw error;
    }
  };

  return {
    transfer,
    balanceOf,
  };
};

export default useETH;

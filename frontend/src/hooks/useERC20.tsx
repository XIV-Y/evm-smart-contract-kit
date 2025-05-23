import { ethers } from "ethers";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";

import { ERC20_ADDRESS } from "../consts";
import { getProvider, getTokenContract } from "../lib/ethers";
import { confirmAndOpenExplorer } from "../lib/utils";

const useERC20 = () => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  // トークンの転送
  const transfer = async (recipientAddress: string) => {
    try {
      if (!address || !isConnected) {
        alert("Wallet address is required.");
        return;
      }

      const provider = getProvider(walletProvider);
      const tokenContract = getTokenContract(provider.getSigner());
      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.utils.parseUnits(String(1), decimals);
      const tx = await tokenContract.transfer(recipientAddress, amountInWei);
      const receipt = await tx.wait();

      confirmAndOpenExplorer(receipt.transactionHash);
    } catch (error) {
      alert(`"転送失敗: ${error}`);
    }
  };

  // トークンの転送（署名付きトランザクションの送信）
  const signatureTransfer = async (recipientAddress: string) => {
    try {
      if (!address || !isConnected) {
        alert("Wallet address is required.");
        return;
      }

      const provider = getProvider(walletProvider);
      const signer = provider.getSigner();
      const tokenContract = getTokenContract(provider.getSigner());
      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.utils.parseUnits(String(1), decimals);
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      // 署名のためのドメイン情報
      const domain = {
        version: "1",
        chainId,
        verifyingContract: ERC20_ADDRESS,
      };

      // 署名のためのドメイン名
      const currentTimestamp = Math.floor(Date.now() / 1000);

      // 署名の有効期限（180秒後）
      const deadline = currentTimestamp + 180;

      const types = {
        ERC20Transfer: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      // 署名する値
      const value = {
        owner: address, // 送信元（自分のアドレス）
        spender: recipientAddress, // 送信先
        value: amountInWei.toString(), // 送金額
        nonce: Date.now(), // リプレイ攻撃防止用のnonce
        deadline, // 署名の有効期限
      };

      // 署名を取得
      await signer._signTypedData(domain, types, value);

      const tokenWithSigner = tokenContract.connect(signer);
      const tx = await tokenWithSigner.transfer(recipientAddress, amountInWei);
      const receipt = await tx.wait();

      confirmAndOpenExplorer(receipt.transactionHash);
    } catch (error) {
      alert(`"転送失敗: ${error}`);
    }
  };

  const balanceOf = async (walletAddress: string) => {
    try {
      if (!walletAddress || !isConnected) {
        alert("Wallet address is required.");
        return;
      }

      const provider = getProvider(walletProvider);
      const tokenContract = getTokenContract(provider);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      const balanceWei = await tokenContract.balanceOf(walletAddress);
      const balance = ethers.utils.formatUnits(balanceWei, decimals);

      return {
        balance,
        symbol,
      };
    } catch (error) {
      alert(`残高取得エラー: ${error}`);
    }
  };

  return {
    transfer,
    signatureTransfer,
    balanceOf,
  };
};

export default useERC20;

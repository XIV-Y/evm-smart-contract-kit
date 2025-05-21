import { ethers } from "ethers";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";

import type { ExternalProvider } from "@ethersproject/providers";

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const ERC20_ADDRESS = "0x85368B4dFd4a13a5d20ba7183204C854bC05Ea9E";

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

      const provider = new ethers.providers.Web3Provider(
        walletProvider as ExternalProvider
      );

      const tokenContract = new ethers.Contract(
        ERC20_ADDRESS,
        ERC20_ABI,
        provider.getSigner()
      );

      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.utils.parseUnits(String(1), decimals);
      const tx = await tokenContract.transfer(recipientAddress, amountInWei);
      const receipt = await tx.wait();

      alert(`転送成功: ${receipt.transactionHash}`);
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

      const provider = new ethers.providers.Web3Provider(
        walletProvider as ExternalProvider
      );

      const signer = provider.getSigner();

      const tokenContract = new ethers.Contract(
        ERC20_ADDRESS,
        ERC20_ABI,
        provider.getSigner()
      );

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

      alert(`転送成功: ${receipt.transactionHash}`);
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

      const provider = new ethers.providers.Web3Provider(
        walletProvider as ExternalProvider
      );

      const tokenContract = new ethers.Contract(
        ERC20_ADDRESS,
        ERC20_ABI,
        provider
      );

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

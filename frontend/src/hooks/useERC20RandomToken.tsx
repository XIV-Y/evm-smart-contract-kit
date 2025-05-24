/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "ethers";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { getERC20RandomTokenTokenContract, getProvider } from "../lib/ethers";
import { confirmAndOpenExplorer } from "../lib/utils";
import { XIVY_RANDOM_TOKEN_ABI, XIVY_RANDOM_TOKEN_ADDRESS } from "../consts";

const useERC20RandomToken = () => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const dailyLuckyDraw = async () => {
    try {
      if (!address || !isConnected) {
        alert("Wallet address is required.");
        return;
      }

      const provider = getProvider(walletProvider);
      const tokenContract = getERC20RandomTokenTokenContract(
        provider.getSigner()
      );

      // コントラクト側で emit したイベントの取得
      // コントラクト側で生成した乱数の値をプログラム上で取得できる
      // const event = await provider.getTransactionReceipt("txHash");
      // const iface = new ethers.utils.Interface(XIVY_RANDOM_TOKEN_ABI);

      // for (const log of event.logs) {
      //   try {
      //     const parsed = iface.parseLog(log);

      //     if (parsed.name === "RandomReward") {
      //       console.log("randomNumber:", parsed.args.randomNumber.toString());
      //     }
      //   } catch (e) {
      //     console.log("Error parsing logs:", e);
      //     continue;
      //   }
      // }

      const isClaimable = await tokenContract.canClaim(address);
      if (!isClaimable) {
        alert("You cannot claim the daily lucky draw.");
        return;
      }

      const tx = await tokenContract.dailyLuckyDraw();
      const receipt = await tx.wait();
      const network = await provider.getNetwork();

      confirmAndOpenExplorer(network.chainId, receipt.transactionHash);
    } catch (error) {
      alert(`dailyLuckyDraw 失敗: ${error}`);
    }
  };

  return { dailyLuckyDraw };
};

export default useERC20RandomToken;

import { ethers } from "ethers";

import { ERC20_ADDRESS, ERC20_ABI } from "../consts";

import type { ExternalProvider } from "@ethersproject/providers";

export const getProvider = (walletProvider: unknown) => {
  if (!walletProvider) throw new Error("No wallet provider");

  return new ethers.providers.Web3Provider(walletProvider as ExternalProvider);
};

export  const getTokenContract = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) => {
  return new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, signerOrProvider);
};

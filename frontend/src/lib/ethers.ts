import { ethers } from "ethers";

import type { ExternalProvider } from "@ethersproject/providers";

export const getProvider = (walletProvider: unknown) => {
  if (!walletProvider) throw new Error("No wallet provider");

  return new ethers.providers.Web3Provider(walletProvider as ExternalProvider);
};

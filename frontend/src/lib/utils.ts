import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const confirmAndOpenExplorer = (txHash: string) => {
  const result = window.confirm(
    `転送成功: ${txHash}\nエクスプローラーで確認しますか？`
  );

  if (result) {
    window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank");
  }
};

export const getSymbolByChainId = (chainId: number) => {
  switch (chainId) {
    case 80002:
      return "AMOY";
    case 11155111:
      return "Sepolia";
    default:
      throw new Error("Unsupported chain ID");
  }
};

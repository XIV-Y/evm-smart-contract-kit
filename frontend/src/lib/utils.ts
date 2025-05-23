import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getExplorerTxUrl = (chainId: number, txHash: string) => {
  switch (chainId) {
    case 80002:
      return `https://www.oklink.com/ja/amoy/tx/${txHash}`;
    case 11155111:
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    default:
      throw new Error("Unsupported chain ID");
  }
};

export const confirmAndOpenExplorer = (chainId: number,txHash: string) => {
  const result = window.confirm(
    `トランザクション成功: ${txHash}\nエクスプローラーで確認しますか？`
  );

  if (result) {
    const url = getExplorerTxUrl(chainId, txHash);

    window.open(url, "_blank");
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

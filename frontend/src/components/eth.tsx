import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import useETH from "../hooks/useETH";

export default function ETH() {
  const { address, isConnected } = useAppKitAccount();
  const { transfer, balanceOf } = useETH();

  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const getBalance = async () => {
      if (!address) return;

      const balance = await balanceOf(address);

      setBalance(`${balance?.balance} ${balance?.symbol}`);
    };

    getBalance();
  }, [address, balanceOf]);

  const handleTransfer = async () => {
    await transfer("0x51a39Aaa111CD9B73b837BD078FBd7a26E13B7CE");
  };

  return (
    <>
      {isConnected && (
        <div className="flex flex-col gap-4 mt-8 w-40">
          {balance && (
            <div className="text-white text-center mb-2">
              <span>残高: {balance}</span>
            </div>
          )}
          <button
            className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={handleTransfer}
          >
            Transfer
          </button>
        </div>
      )}
    </>
  );
}

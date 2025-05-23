import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { useEffect } from "react";
import useETH from "../hooks/useNative";
import { useBalanceStore } from "../store/useBalance";

export default function Native() {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { transfer, balanceOf } = useETH();
  const { setBalance } = useBalanceStore();

  useEffect(() => {
    const getBalance = async () => {
      if (!address) return;

      const balance = await balanceOf(address);

      setBalance(`${balance?.balance} ${balance?.symbol}`);
    };

    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chainId]);

  return (
    <>
      <button
        className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={async () => {
          await transfer("0x51a39Aaa111CD9B73b837BD078FBd7a26E13B7CE");
        }}
      >
        Transfer
      </button>
    </>
  );
}

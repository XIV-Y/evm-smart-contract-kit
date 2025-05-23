import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";
import useERC20 from "../hooks/useERC20";
import { useBalanceStore } from "../store/useBalance";

export default function ERC20() {
  const { address } = useAppKitAccount();
  const { transfer, signatureTransfer, balanceOf } = useERC20();
  const { setBalance } = useBalanceStore();

  useEffect(() => {
    const getBalance = async () => {
      if (!address) return;

      const balance = await balanceOf(address);

      setBalance(`${balance?.balance} ${balance?.symbol}`);
    };

    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

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

      <button
        className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={async () => {
          await signatureTransfer("0x51a39Aaa111CD9B73b837BD078FBd7a26E13B7CE");
        }}
      >
        Signature Transfer
      </button>
    </>
  );
}

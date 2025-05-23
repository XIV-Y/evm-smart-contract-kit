import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";
import useETH from "../hooks/useETH";

type Props = {
  setBalance: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ETH(props: Props) {
  const { address } = useAppKitAccount();
  const { transfer, balanceOf } = useETH();

  useEffect(() => {
    const getBalance = async () => {
      if (!address) return;

      const balance = await balanceOf(address);

      props.setBalance(`${balance?.balance} ${balance?.symbol}`);
    };

    getBalance();
  }, [address, balanceOf, props]);

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

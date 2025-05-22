import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";
import useERC20 from "../hooks/useERC20";

type Props = {
  setBalance: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ERC20(props: Props) {
  const { address, isConnected } = useAppKitAccount();
  const { transfer, signatureTransfer, balanceOf } = useERC20();

  useEffect(() => {
    const getBalance = async () => {
      if (!address) return;

      const balance = await balanceOf(address);

      props.setBalance(`${balance?.balance} ${balance?.symbol}`);
    };

    getBalance();
  }, [address, balanceOf, props]);

  const handleTransfer = async () => {
    await transfer("0x51a39Aaa111CD9B73b837BD078FBd7a26E13B7CE");
  };

  const handleSignatureTransfer = async () => {
    if (!address) return;

    await signatureTransfer("0x51a39Aaa111CD9B73b837BD078FBd7a26E13B7CE");
  };

  return (
    <>
      {isConnected && (
        <>
          <button
            className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={handleTransfer}
          >
            Transfer
          </button>

          <button
            className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={handleSignatureTransfer}
          >
            Signature Transfer
          </button>
        </>
      )}
    </>
  );
}

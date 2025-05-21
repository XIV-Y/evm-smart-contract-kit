import {
  createAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { sepolia } from "@reown/appkit/networks";
import useERC20 from "./hooks/useERC20";
import { useEffect, useState } from "react";
import ETH from "./components/eth";

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: "eth-erc20-token-react",
  description: "AppKit Example",
  url: "",
  icons: [],
};

createAppKit({
  adapters: [new Ethers5Adapter()],
  networks: [sepolia],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

export default function App() {
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { transfer, signatureTransfer, balanceOf } = useERC20();

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

  const handleSignatureTransfer = async () => {
    if (!address) return;

    await signatureTransfer("0x51a39Aaa111CD9B73b837BD078FBd7a26E13B7CE");
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#1a202c]">
      <w3m-button />

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

          <button
            className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={handleSignatureTransfer}
          >
            Signature Transfer
          </button>

          <button
            className="py-2 px-4 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>

          <ETH />
        </div>
      )}
    </div>
  );
}

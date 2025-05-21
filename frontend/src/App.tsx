import { createAppKit, useDisconnect } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { sepolia } from "@reown/appkit/networks";
import useERC20 from "./hooks/useERC20";

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
  const { disconnect } = useDisconnect();

  const { transfer } = useERC20();

  const handleTransfer = async () => {
    await transfer("0x51a39Aaa111CD9B73b837BD078FBd7a26E13B7CE");
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#1a202c]">
      <w3m-button />

      <button onClick={handleTransfer}>Transfer</button>

      <button className="text-white bg" onClick={handleDisconnect}>
        Disconnect
      </button>
    </div>
  );
}

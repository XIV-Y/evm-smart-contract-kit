import {
  createAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { sepolia } from "@reown/appkit/networks";

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
  const { address } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    await disconnect();
  };

  console.log("address", address);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#1a202c]">
      <w3m-button />

      <button className="text-white bg" onClick={handleDisconnect}>
        Disconnect
      </button>
    </div>
  );
}

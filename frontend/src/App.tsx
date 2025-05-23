import {
  createAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { sepolia } from "@reown/appkit/networks";
import ETH from "./components/ETH";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ERC20 from "./components/ERC20";
import CustomERC20 from "./components/CustomERC20";
import { useBalanceStore } from "./store/useBalance";

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
  const { isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { balance } = useBalanceStore();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#1a202c]">
      <w3m-button />

      {isConnected && (
        <>
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="py-2 px-4 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              onClick={async () => {
                await disconnect();
              }}
            >
              Disconnect
            </button>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="Sepolia" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Sepolia">Sepolia</TabsTrigger>
                <TabsTrigger value="ERC20">ERC20</TabsTrigger>
                <TabsTrigger value="CustomERC20">Custom ERC20</TabsTrigger>
              </TabsList>

              <div className="text-white text-center mb-2 min-h-[24px] flex items-center justify-center">
                {balance ? (
                  <span>残高: {balance}</span>
                ) : (
                  <span className="opacity-0 select-none">
                    残高: 0.0000 TOKEN
                  </span>
                )}
              </div>

              <TabsContent value="Sepolia" className="space-y-2">
                <div className="flex justify-center items-center gap-2">
                  <ETH />
                </div>
              </TabsContent>
              <TabsContent value="ERC20" className="space-y-2">
                <div className="flex justify-center items-center gap-2">
                  <ERC20 />
                </div>
              </TabsContent>
              <TabsContent value="CustomERC20" className="space-y-2">
                <div className="flex justify-center items-center gap-2">
                  <CustomERC20 />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}

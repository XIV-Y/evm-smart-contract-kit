import { useEffect } from "react";
import useCustomERC20 from "../hooks/useCustomERC20";
import { useBalanceStore } from "../store/useBalance";

export default function CustomERC20() {
  const { deploy } = useCustomERC20();
  const { setBalance } = useBalanceStore();

  useEffect(() => {
    setBalance(null);
  }, [setBalance]);

  return (
    <>
      <button
        className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={async () => {
          await deploy();
        }}
      >
        Deploy
      </button>
    </>
  );
}

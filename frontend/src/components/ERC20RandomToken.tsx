import { useEffect } from "react";
import { useBalanceStore } from "../store/useBalance";
import useERC20RandomToken from "../hooks/useERC20RandomToken";

export default function ERC20RandomToken() {
  const { dailyLuckyDraw } = useERC20RandomToken();
  const { setBalance } = useBalanceStore();

  useEffect(() => {
    setBalance(null);
  }, [setBalance]);

  return (
    <>
      <button
        className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={async () => {
          await dailyLuckyDraw();
        }}
      >
        Deploy
      </button>
    </>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        ERC20 Token Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Token Information</h2>
          <p className="mb-2">
            Explore your custom ERC20 token details including total supply,
            holders, and transactions.
          </p>
          <Link href="/token" className="btn btn-primary inline-block mt-2">
            View Token Details
          </Link>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Wallet</h2>
          <p className="mb-2">
            Connect your wallet to transfer tokens, check balances, and manage
            your holdings.
          </p>
          <Link href="/wallet" className="btn btn-primary inline-block mt-2">
            Open Wallet
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
        <p className="mb-4">
          This application demonstrates integration between a custom ERC20 token
          deployed on a local Ethereum network and a Next.js frontend.
        </p>
        <p>
          The project uses Hardhat for Ethereum development and Next.js App
          Router for the user interface.
        </p>
      </div>
    </div>
  );
}

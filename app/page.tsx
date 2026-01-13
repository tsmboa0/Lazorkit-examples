"use client";

import { FingerprintIcon, LockIcon, PasskeyIcon, LogOutIcon } from "./components/icons";
import { useWallet } from "@lazorkit/wallet";
import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function Home() {
  // Hook is called at the top level of the component
  const { connect, wallet, isConnected, disconnect, signAndSendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = async () => {
    if (wallet?.smartWallet) {
      try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const pubkey = new PublicKey(wallet.smartWallet);
        const bal = await connection.getBalance(pubkey);
        setBalance(bal / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
  };

  useEffect(() => {
    if (isConnected && wallet?.smartWallet) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [isConnected, wallet?.smartWallet]);

  const handleAuth = async () => {
    console.log("Biometric auth triggered");
    await connect();
    console.log(`connect, wallet address is ${wallet?.smartWallet}`);
  };

  const handleLogout = async () => {
    await disconnect();
    setBalance(null);
    setRecipient("");
    setAmount("");
    setStatus("");
  };

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      setStatus("Please enter recipient and amount.");
      return;
    }

    setIsLoading(true);
    setStatus("Processing transfer...");

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const toPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const instruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet!.smartWallet!),
        toPubkey,
        lamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: "SOL"
        }
      });

      console.log("Transfer signature:", signature);
      setStatus(`Transfer successful! Signature: ${signature.slice(0, 8)}...`);
      setRecipient("");
      setAmount("");
      await fetchBalance(); // Refresh balance
    } catch (error: any) {
      console.error("Transfer failed:", error);
      setStatus(`Transfer failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-950 text-white selection:bg-rose-500/30">

      {/* Abstract Background Gradient */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-950">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <main className="flex w-full max-w-md flex-col items-center gap-8 px-6">

        {isConnected ? (
          /* Dashboard View */
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 shadow-xl ring-1 ring-emerald-500/30">
                <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_theme(colors.emerald.500)]" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                Welcome Back
              </h1>
              <p className="text-sm text-zinc-400">
                Wallet Connected
              </p>
            </div>

            <div className="w-full rounded-3xl bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur-xl">
              <div className="flex flex-col gap-6 rounded-[20px] bg-zinc-900/50 p-6">
                {/* Wallet Details */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Your Wallet</label>
                    <div className="flex items-center gap-2 rounded-xl bg-black/40 p-3 ring-1 ring-white/5">
                      <code className="text-sm font-mono text-zinc-300 break-all">
                        {wallet?.smartWallet || "Not Available"}
                      </code>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Balance</label>
                    <div className="flex items-center gap-2 rounded-xl bg-black/40 p-3 ring-1 ring-white/5">
                      <span className="text-xl font-semibold text-white">
                        {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transfer Section */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="mb-4 text-sm font-semibold text-white">Transfer SOL</h3>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-rose-500/50"
                    />
                    <input
                      type="number"
                      placeholder="Amount (SOL)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-rose-500/50"
                    />
                    <button
                      onClick={handleTransfer}
                      disabled={isLoading}
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-rose-900/20 ring-1 ring-white/10 transition-all hover:bg-rose-500 disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Send SOL"}
                    </button>
                    {status && (
                      <p className={`mt-2 text-center text-xs ${status.includes("failed") ? "text-red-400" : "text-emerald-400"}`}>
                        {status}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </button>
          </>
        ) : (
          /* Login View */
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-xl ring-1 ring-white/10">
                <LockIcon className="h-8 w-8 text-rose-500" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                Welcome Back
              </h1>
              <p className="text-sm text-zinc-400">
                Sign in to verify your identity
              </p>
            </div>

            {/* Auth Card */}
            <div className="w-full rounded-3xl bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur-xl">
              <div className="flex flex-col gap-4 rounded-[20px] bg-zinc-900/50 p-6">

                {/* Method Selector (Visual Only) */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/40 p-1">
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-white/10 transition-all">
                    <PasskeyIcon className="h-4 w-4" />
                    Passkey
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
                    Password
                  </button>
                </div>

                <div className="my-4 flex justify-center">
                  <div className="relative flex h-32 w-32 items-center justify-center">
                    {/* Pulse Rings */}
                    <div className="absolute inset-0 animate-ping rounded-full bg-rose-500/20 duration-[3s]" />
                    <div className="absolute inset-2 animate-ping rounded-full bg-rose-500/10 delay-75 duration-[3s]" />

                    {/* Main Button */}
                    <button
                      onClick={handleAuth}
                      className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-black shadow-2xl shadow-rose-900/20 ring-1 ring-white/10 transition-transform active:scale-95"
                    >
                      <FingerprintIcon className="h-12 w-12 text-rose-500 transition-colors group-hover:text-rose-400" />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs font-medium text-zinc-500">
                    Tap to authenticate with biometrics
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <a href="#" className="hover:text-zinc-400 transition-colors">Recover Account</a>
              <span>•</span>
              <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

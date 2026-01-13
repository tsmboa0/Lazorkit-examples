"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode } from "react";

const LAZOR_CONFIG = {
    RPC_URL: "https://api.devnet.solana.com",
    PORTAL_URL: "https://portal.lazor.sh",
    PAYMASTER: {
        paymasterUrl: "https://kora.devnet.lazorkit.com"
    }
};

export function Providers({ children }: { children: ReactNode }) {
    return (
        <LazorkitProvider
            rpcUrl={LAZOR_CONFIG.RPC_URL}
            portalUrl={LAZOR_CONFIG.PORTAL_URL}
            paymasterConfig={LAZOR_CONFIG.PAYMASTER}
        >
            {children}
        </LazorkitProvider>
    );
}

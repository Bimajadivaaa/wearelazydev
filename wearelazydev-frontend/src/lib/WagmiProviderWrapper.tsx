'use client'

import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
    darkTheme,
    getDefaultConfig,
    getDefaultWallets,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { rabbyWallet } from "@rainbow-me/rainbowkit/wallets";
import { useState, useEffect } from 'react';

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();
const { wallets } = getDefaultWallets();
const config = getDefaultConfig({
    appName: "wearelazydev",
    projectId: "fe575b36234dc9b54e34a40e332d7f92",
    wallets: [
        ...wallets,
        {
            groupName: "Other",
            wallets: [rabbyWallet],
        },
    ],
    chains: [sepolia],
    ssr: true,
});

export function WagmiProviderWrapper({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const theme = darkTheme({
        accentColor: '#7b3fe4',
        accentColorForeground: 'white',
        borderRadius: 'small',
        fontStack: 'system',
        overlayBlur: 'small',
    });

    if (!mounted) {
        return null;
    }

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider modalSize="compact" theme={theme}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
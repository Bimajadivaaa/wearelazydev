"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TokenList } from "@/components/ui/token-list";
import { useSwapToken } from "@/lib/hooks/use-swap-token";
import React from "react";
import { ethers } from "ethers";
import { Loader2 } from "lucide-react";
import { useWallet } from "@/lib/hooks/use-wallet";
import { toast } from "sonner";

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const LAZY_ADDRESS = "0x3924d7fe9f8a07753fcdc7192b36c58c238b61a6";

export default function SwapPage() {
  const [amount, setAmount] = React.useState<string>("");
  const [selectedToken, setSelectedToken] = React.useState({
    sell: ETH_ADDRESS,
    buy: LAZY_ADDRESS,
  });

  const {
    handleSwapToken,
    isApprovalPending,
    isSwapPending,
    calculateSwapData,
    isApprovalConfirming,
    isSwapConfirming,
    isSwapSuccess,
    loadingCalculate,
  } = useSwapToken(selectedToken.sell, selectedToken.buy, amount);

  const { address } = useWallet();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSwap = async () => {
    if (!amount) return;

    await handleSwapToken({
      swap: amount,
      fromToken: selectedToken.sell,
      toToken: selectedToken.buy,
      amount: amount,
    });
  };

  React.useEffect(() => {
    if (isSwapSuccess) {
      toast.success("Swap Token success!")
      setAmount("");
    }
  }, [isSwapSuccess]);

  const isLoading =
    isApprovalPending ||
    isSwapPending ||
    isApprovalConfirming ||
    isSwapConfirming;

  return (
    <main className="flex flex-col items-center justify-center gap-10 mt-20">
      <h1 className="text-3xl xl:text-5xl font-bold">
        Swap $Lazy for get earn.
      </h1>
      <div className="bg-primary text-primary-foreground p-4 space-y-5 rounded h-fit">
        <div className="flex items-center border p-3 rounded">
          <div className="flex flex-col gap-3 rounded">
            <Label className="text-xl">Sell</Label>
            <input
              placeholder="0.00"
              className="outline-none border-none bg-transparent text-3xl w-48"
              value={amount}
              onChange={handleAmountChange}
            />
            <span>
              ~
              {parseInt(
                calculateSwapData && calculateSwapData !== ""
                  ? ethers.formatEther(calculateSwapData.toString())
                  : "0"
              )}{" "}
              $LAZY
            </span>
          </div>
          <TokenList
            selectedAddress={selectedToken.sell}
            onSelect={(address) =>
              setSelectedToken((prev) => ({ ...prev, sell: address }))
            }
          />
        </div>

        <div className="flex items-center bg-secondary text-secondary-foreground p-3 rounded">
          <div className="flex flex-col gap-3 rounded">
            <Label className="text-xl">Buy</Label>
            <input
              placeholder="0.00"
              className="outline-none border-none bg-transparent text-3xl w-48"
              value={parseInt(
                calculateSwapData && calculateSwapData !== ""
                  ? ethers.formatEther(calculateSwapData.toString())
                  : "0"
              )}
              disabled={loadingCalculate}
              readOnly
            />
          </div>
          <TokenList
            selectedAddress={selectedToken.buy}
            onSelect={(address) =>
              setSelectedToken((prev) => ({ ...prev, buy: address }))
            }
          />
        </div>

        <Button
          className="w-full font-medium text-lg hover:text-gray-500 border border-gray-300 rounded-full"
          onClick={handleSwap}
          disabled={!amount || isLoading}
        >
          {!address ? (
            <div className="flex items-center space-x-2 disabled cursor-not-allowed">
              <p className="text-md">Connect your wallet</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin" />
              <p className="text-md">Swapping...</p>
            </div>
          ) : loadingCalculate ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin" />
              <p className="text-md">Calculating Price...</p>
            </div>
          ) : (
            "Swap"
          )}
        </Button>
      </div>
      <p className="text-lg xl:w-1/2 2xl:w-1/3 text-center">
        swap lazy token you can <strong>create, claim, and swap</strong> for
        using <strong>zkTLS</strong> feature of <strong>Pull Request</strong>
      </p>
    </main>
  );
}

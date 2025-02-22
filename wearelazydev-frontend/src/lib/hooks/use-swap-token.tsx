import {
  SWAPTOKEN_ADDRESS,
  SWAPTOKEN_ABI,
  LAZYTOKEN_ADDRESS,
  LAZY_TOKEN_ABI,
} from "@/config/const";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { toast } from "sonner";
import React from "react";
import { swapTokenParams } from "@/utils/types";
import { ethers } from "ethers";

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io/tx/";

export const useSwapToken = (
  fromToken: string,
  toToken: string,
  amount: string
) => {
  const [swapToken, setSwapToken] = React.useState<swapTokenParams | null>(
    null
  );

  const {
    data: approvalHash,
    isPending: isApprovalPending,
    writeContract: writeApproval,
  } = useWriteContract();

  const {
    data: swapHash,
    isPending: isSwapPending,
    writeContract: writeSwap,
    error: isErrorSwap,
  } = useWriteContract();

  const amountInWei =
    amount && amount !== "" 
      ? ethers.parseUnits(amount.toString(), 18)
      : BigInt(0);

  const { data: calculateSwapData, isPending : loadingCalculate } = useReadContract({
    address: SWAPTOKEN_ADDRESS,
    abi: SWAPTOKEN_ABI,
    functionName: "calculateSwap",
    args: [fromToken, toToken, amountInWei],
  });


  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  const { isLoading: isSwapConfirming, isSuccess: isSwapSuccess } =
    useWaitForTransactionReceipt({
      hash: swapHash,
    });

  const handleSwapToken = async (params: swapTokenParams) => {
    try {
      if (isErrorSwap) {
        console.error("Error swap:", isErrorSwap);
        toast.error("Failed to calculate token");
        return;
      }

      const tokenInWei = ethers.parseEther(params.amount);

      writeApproval({
        abi: LAZY_TOKEN_ABI,
        address: LAZYTOKEN_ADDRESS,
        functionName: "approve",
        args: [SWAPTOKEN_ADDRESS, tokenInWei],
      });

      setSwapToken(params);
    } catch (err) {
      toast.error("Transaction Failed", {
        description:
          err instanceof Error ? err.message : "Unexpected error occurred",
      });
      throw err;
    }
  };

  React.useEffect(() => {
    if (isApprovalSuccess && swapToken) {
      const tokenInWei = ethers.parseEther(swapToken.amount);
      const value = BigInt(ethers.parseEther(swapToken.amount).toString());

      writeSwap({
        address: SWAPTOKEN_ADDRESS,
        abi: SWAPTOKEN_ABI,
        functionName: "swap",
        args: [swapToken.fromToken, swapToken.toToken, tokenInWei],
        value: value,
      });
      setSwapToken(null);
    }
  }, [isApprovalSuccess, swapToken, writeSwap]);

  React.useEffect(() => {
    if (swapHash) {
      toast.success("Swap Token success!", {
        description: (
          <a
            href={`${SEPOLIA_EXPLORER}${swapHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Transaction on Sepolia Explorer
          </a>
        ),
      });
    }
  }, [swapHash]);

  React.useEffect(() => {
    if (approvalHash) {
      toast.success("Token Approval Initiated", {
        description: (
          <a
            href={`${SEPOLIA_EXPLORER}${approvalHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Transaction on Sepolia Explorer
          </a>
        ),
      });
    }
  }, [approvalHash]);

  return {
    handleSwapToken,
    isApprovalPending,
    isSwapPending,
    calculateSwapData,
    isApprovalConfirming,
    isSwapConfirming,
    isSwapSuccess,
    loadingCalculate
  };
};

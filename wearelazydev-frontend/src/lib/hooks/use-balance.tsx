import { LAZYTOKEN_ADDRESS, LAZY_TOKEN_ABI } from "@/config/const";
import { useReadContract } from "wagmi";
// import React from "react";
// import { lazyTokenBalanceParams } from "@/utils/types";

export const useBalance = (address: string) => {
  const { data: LazyTokenBalance } = useReadContract({
    address: LAZYTOKEN_ADDRESS,
    abi: LAZY_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  return {
    LazyTokenBalance,
  };
};

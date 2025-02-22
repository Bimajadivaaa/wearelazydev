'use client'
import { ISSUE_ADDRESS, ISSUE_ABI } from "@/config/const";
import { useReadContract } from "wagmi";

export const useGetIssueById = (issueId: string | undefined) => {

  const { data: issueDetails, isLoading, error } = useReadContract({
    address: ISSUE_ADDRESS,
    abi: ISSUE_ABI,
    functionName: "getIssueDetails",
    args: [issueId]
  });

  return {
    issueDetails,
    isLoading,
    error
  };
};

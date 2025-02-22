'use client'
import { ISSUE_ADDRESS, ISSUE_ABI } from "@/config/const";
import { useReadContract } from "wagmi";

export const useGetAllIssue = () => {
  const { data: allIssue, isPending: isFetchingData } = useReadContract({
    address: ISSUE_ADDRESS,
    abi: ISSUE_ABI,
    functionName: "getAllIssues",
  });

  return {
    allIssue,
    isFetchingData
  };
};

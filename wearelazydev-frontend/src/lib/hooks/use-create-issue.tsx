import {
  ISSUE_ADDRESS,
  ISSUE_ABI,
  LAZYTOKEN_ADDRESS,
  LAZY_TOKEN_ABI,
} from "@/config/const";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CreateIssueParams } from "@/utils/types";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io/tx/";

export const useCreateIssue = () => {
  const [issueParams, setIssueParams] = useState<CreateIssueParams | null>(null);

  const {
    data: approvalHash,
    isPending: isApprovalPending,
    writeContract: writeApproval,
  } = useWriteContract();

  const {
    data: createIssueHash,
    isPending: isCreateIssuePending,
    writeContract: writeCreateIssue,
  } = useWriteContract();

  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalSuccess,
  } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  const {
    isLoading: isCreateIssueConfirming,
    isSuccess: isCreateIssueConfirmed,
    isError: isCreateIssueError,
  } = useWaitForTransactionReceipt({
    hash: createIssueHash,
  });

  useEffect(() => {
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

  useEffect(() => {
    if (createIssueHash) {
      toast.success("Issue Creation Initiated", {
        description: (
          <a
            href={`${SEPOLIA_EXPLORER}${createIssueHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Transaction on Sepolia Explorer
          </a>
        ),
      });
    }
  }, [createIssueHash]);

  useEffect(() => {
    if (isApprovalSuccess && issueParams) {
      const bountyAmountWei = ethers.parseEther(issueParams.bountyAmount);
      writeCreateIssue({
        address: ISSUE_ADDRESS,
        abi: ISSUE_ABI,
        functionName: "createIssue",
        args: [
          issueParams.githubProjectId,
          bountyAmountWei,
          issueParams.projectName,
          issueParams.description,
          issueParams.repoLink,
          issueParams.deadline,
        ],
      });

      setIssueParams(null);
    }
  }, [isApprovalSuccess, issueParams, writeCreateIssue]);

  useEffect(() => {
    if (isCreateIssueConfirmed) {
      toast.success("Issue Created Successfully");
    }
    if (isCreateIssueError) {
      toast.error("Issue Creation Failed");
    }
  }, [isCreateIssueConfirmed, isCreateIssueError]);

  const handleCreateIssue = async (params: CreateIssueParams) => {
    try {
      const bountyAmountWei = ethers.parseEther(params.bountyAmount);
      writeApproval({
        abi: LAZY_TOKEN_ABI,
        address: LAZYTOKEN_ADDRESS,
        functionName: "approve",
        args: [ISSUE_ADDRESS, bountyAmountWei],
      });

      setIssueParams(params);
    } catch (err) {
      toast.error("Transaction Failed", {
        description: err instanceof Error ? err.message : "Unexpected error occurred",
      });
      throw err;
    }
  };

  return {
    handleCreateIssue,
    isApprovalPending,
    isCreateIssuePending,
    isApprovalConfirming,
    isCreateIssueConfirmed,
    isCreateIssueConfirming,
  };
};

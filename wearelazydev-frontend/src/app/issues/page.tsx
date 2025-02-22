"use client";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import React from "react";
import { useGetAllIssue } from "@/lib/hooks/use-get-all-issue";
import { formatDistanceToNow } from "date-fns";
import { Issue } from "@/utils/types";
import Link from "next/link";
import { ethers } from "ethers";
import { useWallet } from "@/lib/hooks/use-wallet";
import WalletConnect from "@/components/ui/WalletConnect";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { allIssue = [], isFetchingData } = useGetAllIssue() as { 
    allIssue: Issue[];
    isFetchingData: boolean;
  };
  const { address } = useWallet();

  const renderIssueStatus = (deadline: bigint) => {
    const deadlineDate = new Date(Number(deadline) * 1000);
    const timeRemaining = formatDistanceToNow(deadlineDate);

    return deadlineDate > new Date() ? `ends in ${timeRemaining}` : "CLOSED";
  };

  const shortenAddress = (address: string, length: number = 5) => {
    if (!address) return "";
    return `${address.substring(0, length)}...${address.substring(
      address.length - length
    )}`;
  };

  return (
    <main>
      <div className="bg-primary text-primary-foreground p-10 space-y-5 rounded">
        <h1 className="text-xl xl:text-3xl font-bold">
          Do you have any issues to fix?
        </h1>
        <Button size={"lg"} variant={"secondary"} className="font-bold" asChild>
          <Link href="/issues/create">Create Issue</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-10">
        {address ? (
          isFetchingData ? (
            <div className="col-span-2 flex justify-center items-center min-h-[200px] space-x-3">
              <Loader2 className="h-8 w-8 animate-spin"/> 
              <p>Loading issues data..</p>
            </div>
          ) : allIssue.length > 0 ? (
            allIssue.map((issue, index) => (
              <Link href={`/issues/${issue.id}`} key={index}>
                <ShineBorder
                  className="w-full text-center bg-white dark:bg-secondary shadow-lg p-5 rounded space-y-3"
                  color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                >
                  <h1 className="text-xl font-bold">{issue.projectName}</h1>
                  <p className="truncate opacity-50">
                    Owner Issue: {shortenAddress(issue.owner)}
                  </p>
                  <div className="flex gap-20 justify-between">
                    <div>
                      <p>Reward</p>
                      <h2 className="font-bold text-xl">
                        {parseInt(
                          ethers.formatEther(issue.bountyAmount).toString()
                        )}{" "}
                        LAZY
                      </h2>
                    </div>
                    <div className="self-end outline p-2 rounded">
                      {renderIssueStatus(issue.deadline)}
                    </div>
                  </div>
                </ShineBorder>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-2">
              No issues found.
            </p>
          )
        ) : (
          <div className="flex items-center justify-center col-span-2 flex-col gap-5 mt-10">
            <h1 className="font-bold text-4xl text-center">Connect Your Wallet</h1>
            <p className="text-center text-white-500 mt-2">
              Please Connect your wallet to see all issue.
            </p>
            <WalletConnect />
          </div>
        )}
      </div>
    </main>
  );
}
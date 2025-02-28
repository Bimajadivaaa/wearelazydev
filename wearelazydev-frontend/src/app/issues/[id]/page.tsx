"use client";
import Image from "next/image";
import TimerIssue from "@/components/TimerIssue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetIssueById } from "@/lib/hooks/use-get-issue-by-id";
import { useParams } from "next/navigation";
import { IssueDetails } from "@/utils/types";
import Link from "next/link";
import { useGenerateProof } from "@/lib/hooks/use-generate-proof";
import { useGithubAuth } from "@/lib/hooks/use-github-auth";
import { useValidationRewards } from "@/lib/hooks/use-validation-rewards";
import { useClaimRewards } from "@/lib/hooks/use-claim-rewards";
import { toast } from "sonner";
import { ethers } from "ethers";
import { Loader2 } from "lucide-react";
import React from "react";

export default function Page() {
  const params = useParams();
  const issueId = params.id as string;

  const { issueDetails, isLoading, error } = useGetIssueById(issueId) as {
    issueDetails: IssueDetails | null;
    isLoading: boolean;
    error: Error | null;
  };

  const {
    proof,
    pullRequestUrl,
    isFetching,
    setPullRequestUrl,
    generateProof,
  } = useGenerateProof();

  const {
    isAuthenticated,
    loginWithGithub,
    logout: githubLogout,
  } = useGithubAuth(() => {
    setPullRequestUrl("");
  });

  const { validationResults } = useValidationRewards({
    proof,
    pullRequestUrl,
    issueDetails,
  });

  const {
    handleClaimRewards,
    isClaimPending,
    isClaimConfirming,
    isApprovalPending,
    isApprovalConfirming,
    usedPRLinksData,
    isClaimSuccess,
  } = useClaimRewards(pullRequestUrl);

  const isAllValid =
    validationResults.isValidRepo &&
    validationResults.isValidId &&
    validationResults.isValidUser &&
    validationResults.isMerged;

  const isProcessing =
    isClaimPending ||
    isClaimConfirming ||
    isApprovalPending ||
    isApprovalConfirming;

  const handleClaim = () => {
    if (usedPRLinksData == true) {
      toast.error("PR already used", {
        description: "This PR has already been claimed.",
      });
      return;
    }
    if (issueDetails && pullRequestUrl) {
      handleClaimRewards({
        issueId,
        prLink: pullRequestUrl,
        isMerged: validationResults.isMerged,
        bountyAmount: issueDetails.bountyAmount?.toString() || "0",
      });
    }
  };

  React.useEffect(() => {
    if (isClaimSuccess) {
      toast.success("Claim $Lazy Token success!");
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-bold">
        Loading Issue Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center font-bold">
        Failed to load issue details. Error: {error.message}
      </div>
    );
  }

  if (!issueDetails) {
    return (
      <div className="text-gray-500 text-center font-bold">
        No issue details found.
      </div>
    );
  }

  return (
    <main className="space-y-10">
      <TimerIssue deadline={issueDetails.deadline} />

      <section className="space-y-5">
        <div>
          <h1 className="text-2xl xl:text-3xl font-bold">
            {issueDetails.projectName || "N/A"}
          </h1>
          <p className="text-muted-foreground">
            Created by{" "}
            <span className="font-bold">{issueDetails.owner || "Unknown"}</span>
          </p>
        </div>

        <div className="flex items-center gap-5">
          <Image
            src={"/images/lazytoken.png"}
            alt="$LZYTKN Logo"
            width={50}
            height={50}
            priority={true}
            className="rounded-full"
          />
          <div>
            <p className="font-bold text-xl xl:text-2xl">
              {parseInt(
                ethers.formatEther(issueDetails.bountyAmount).toString()
              )}{" "}
              LAZY
            </p>

            <p className="text-sm">
              $
              {parseInt(
                ethers.formatEther(issueDetails.bountyAmount).toString()
              )}{" "}
              USDC
            </p>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="space-y-5">
            <div className="flex flex-col xl:flex-row gap-5 xl:w-1/2">
              <Input
                placeholder="Github Pull Request Link"
                value={pullRequestUrl}
                onChange={(e) => setPullRequestUrl(e.target.value)}
                disabled={isFetching}
              />
              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="font-bold flex-1"
                  onClick={generateProof}
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin" />
                      <p>Generating...</p>
                    </div>
                  ) : (
                    "Generate Proof"
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={githubLogout}
                  disabled={isFetching}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            size="lg"
            className="font-bold p-4 gap-[-10]"
            onClick={loginWithGithub}
          >
            <Image
              src={"/images/github.png"}
              alt="github"
              width={50}
              height={50}
            />
            Connect with GitHub
          </Button>
        )}
        <hr />

        <div className="space-y-2">
          <p className="font-bold text-lg xl:text-xl 2xl:text-2xl">
            Description Github Issue
          </p>
          <p className="text-sm text-muted-foreground whitespace-pre-line xl:text-base grid grid-cols-1 xl:grid-cols-2 text-justify">
            {issueDetails.description || "No description available."}
          </p>
        </div>

        <div className="pt-10">
          <p className="font-bold text-lg xl:text-xl 2xl:text-2xl">
            Github Repository Link
          </p>
          <div className="mt-3">
            <Link href={issueDetails.repoLink} className="hover:text-blue-500">
              {issueDetails.repoLink || "No repository link provided."}
            </Link>
          </div>

          <div className="mt-10">
            {proof && Object.keys(proof).length > 0 && (
              <div className="space-y-5">
                {/* <pre className="whitespace-pre-wrap overflow-x-auto p-4 bg-[#000000] rounded text-green-600">
                  {JSON.stringify(proof, null, 2)}
                </pre> */}
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <h3 className="font-bold text-lg">
                    <span className="font-bold text-xl">zkTLS</span> Validation
                    Results :
                  </h3>
                  <div className="space-y-2">
                    <ValidationItem
                      label="Repository Github Verification"
                      isValid={validationResults.isValidRepo}
                    />
                    <ValidationItem
                      label="ID Github Verification"
                      isValid={validationResults.isValidId}
                    />
                    <ValidationItem
                      label="Username Github Validation"
                      isValid={validationResults.isValidUser}
                    />
                    <ValidationItem
                      label="Pull Request Merged"
                      isValid={validationResults.isMerged}
                    />
                  </div>

                  {isAllValid && (
                    <div className="mt-4">
                      <Button
                        size="lg"
                        className="w-full font-bold bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleClaim}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="animate-spin" />
                            <p>Claiming...</p>
                          </div>
                        ) : (
                          "Claim Rewards"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const ValidationItem: React.FC<{ label: string; isValid: boolean }> = ({
  label,
  isValid,
}) => {
  return (
    <div className="flex justify-between items-center p-2 border-b last:border-none">
      <span className="font-medium">{label}</span>
      <div
        className={`flex items-center gap-2 font-bold ${
          isValid ? "text-green-600" : "text-red-600"
        }`}
      >
        {isValid ? (
          <>
            <Image
              src={"/images/checklist.png"}
              width={20}
              height={50}
              alt="cheklist"
            />{" "}
            <span className="font-bold">Valid</span>
          </>
        ) : (
          <>
            <Image
              src={"/images/remove.png"}
              width={20}
              height={50}
              alt="cheklist"
            />{" "}
            <span className="font-bold">Invalid</span>
          </>
        )}
      </div>
    </div>
  );
};

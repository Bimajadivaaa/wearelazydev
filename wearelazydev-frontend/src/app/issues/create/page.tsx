"use client";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useCreateIssue } from "@/lib/hooks/use-create-issue";
import { useWallet } from "@/lib/hooks/use-wallet";
import WalletConnect from "@/components/ui/WalletConnect";
import { Loader2 } from "lucide-react";

export default function Page() {
  const {
    handleCreateIssue,
    isCreateIssuePending,
    isApprovalPending,
    isCreateIssueConfirming,
    isApprovalConfirming,
  } = useCreateIssue();
  const { address } = useWallet();

  const [formData, setFormData] = useState({
    title: "",
    repoLink: "",
    description: "",
    deadline: new Date(),
    bountyAmount: "0",
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({
      ...prev,
      deadline: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const deadlineTimestamp = BigInt(
        Math.floor(formData.deadline.getTime() / 1000)
      );
      const bountyAmountBigInt = BigInt(formData.bountyAmount).toString();

      await handleCreateIssue({
        githubProjectId: formData.title,
        bountyAmount: bountyAmountBigInt,
        projectName: formData.title,
        description: formData.description,
        repoLink: formData.repoLink,
        deadline: deadlineTimestamp,
      });

      setFormData({
        title: "",
        repoLink: "",
        description: "",
        deadline: new Date(),
        bountyAmount: "0",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col space-y-4">
        <h1 className="font-bold text-4xl text-center">Connect Your Wallet</h1>
        <p className="text-center text-gray-500 text-lg font-semibold">
          Please Connect Your Wallet to Create an Issue.
        </p>
        <WalletConnect />
      </div>
    );
  }

  return (
    <main>
      <h1 className="text-3xl font-bold mb-4">Create Issue</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-secondary border-2 shadow-xl p-5 rounded space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title Issue</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter your issue title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repoLink">Link Repository</Label>
            <Input
              name="repoLink"
              value={formData.repoLink}
              onChange={handleInputChange}
              required
              placeholder="Enter your Github Repository"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
               placeholder="Enter your Description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bountyAmount">Reward (LAZY)</Label>
            <Input
              name="bountyAmount"
              type="number"
              value={formData.bountyAmount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <DatePicker date={formData.deadline} onSelect={handleDateChange} />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={
              isCreateIssuePending ||
              isApprovalPending ||
              isCreateIssueConfirming ||
              isApprovalConfirming
            }
          >
            {isCreateIssuePending ||
            isApprovalPending ||
            isCreateIssueConfirming ||
            isApprovalConfirming ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin" />
                <p>Creating...</p>
              </div>
            ) : (
              "Submit"
            )}
          </Button>

          {error && <p className="text-red-500">Error: {error}</p>}
        </form>

        <div className="bg-primary text-primary-foreground rounded p-5 space-y-3 2xl:col-span-2 h-fit">
          <p>
            Owner Issue <br /> <strong>{address}</strong>
          </p>
          <h1>
            Title Issue <br /> <strong>{formData.title || "Not set"}</strong>
          </h1>
          <p>
            Link Repository <br /> <strong>{formData.repoLink || "Not set"}</strong>
          </p>
          <span className="font-bold bg-slate-500 px-2 text-white">*Make sure your repository is public.</span>
          <p>
            Description <br />{" "}
            <strong>{formData.description || "Not set"}</strong>
          </p>
          <p>
            Reward <br /> <strong>{formData.bountyAmount ? formData.bountyAmount : '0'} $LAZY</strong>
          </p>
          <p>
            Deadline <br />{" "}
            <strong>{formData.deadline.toLocaleDateString()}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}

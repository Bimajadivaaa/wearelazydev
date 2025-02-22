import { useState } from "react";
import { toast } from "sonner";
import { UseGenerateProofReturn } from "@/utils/types";

export const useGenerateProof = (): UseGenerateProofReturn => {
  const [proof, setProof] = useState<Record<string, string>>({});
  const [pullRequestUrl, setPullRequestUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const generateProof = async () => {
    if (!pullRequestUrl) {
      toast.error("Invalid Input", {
        description: "Please enter a valid Pull Request URL.",
      });
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ZK_BACKEND_GENERATE_PROOF}?url=${encodeURIComponent(
          pullRequestUrl
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();
      setProof(data);
      toast.success("Success", {
        description: "Proof generated successfully!",
      });
    } catch (error) {
      console.error("Error generating proof:", error);
      toast.error("Error", {
        description: "Failed to generate proof. Please logout Github, and try to connect Github again.",
      });
    } finally {
      setIsFetching(false);
    }
  };

  return {
    proof,
    pullRequestUrl,
    isFetching,
    setPullRequestUrl,
    generateProof,
  };
};

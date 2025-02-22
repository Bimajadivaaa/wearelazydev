import { useMemo } from "react";
import { ValidationResults, UseValidationRewardsProps } from "@/utils/types";

export const useValidationRewards = ({
  proof,
  pullRequestUrl,
  issueDetails,
}: UseValidationRewardsProps) => {
  const parseJSONSafely = (jsonString: string) => {
    try {
      const cleanedString = jsonString.replace(/\\"/g, '"');
      return JSON.parse(cleanedString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {};
    }
  };

  const extractedContexts = useMemo(() => {
    if (!proof) return { prProofDataContext: "{}", userProofDataContext: "{}" };

    const proofString = JSON.stringify(proof);
    const regex = /"context":\s*"({.*?})"/g;
    const matches = [...proofString.matchAll(regex)];

    if (matches.length >= 2) {
      return {
        prProofDataContext: matches[0][1],
        userProofDataContext: matches[1][1],
      };
    }

    return { prProofDataContext: "{}", userProofDataContext: "{}" };
  }, [proof]);

  const { prProofData, userProofData } = useMemo(
    () => ({
      prProofData: parseJSONSafely(extractedContexts.prProofDataContext),
      userProofData: parseJSONSafely(extractedContexts.userProofDataContext),
    }),
    [extractedContexts]
  );

  const validationResults = useMemo((): ValidationResults => {
    if (!proof || !pullRequestUrl || !issueDetails) {
      return {
        isMerged: false,
        isValidUser: false,
        isValidId: false,
        isValidRepo: false,
      };
    }

    const prProofString = JSON.stringify(prProofData);
    const userProofString = JSON.stringify(userProofData);
    const mergedRegex = /"merged"\s*:\s*"(\w+)"/;
    const loginRegex = /"login"\s*:\s*"([^"]+)"/;
    const idRegex = /"id"\s*:\s*"(\d+)"/;
    const repoLink = pullRequestUrl.replace(/\/pull\/\d+.*$/, "");

    const prMergedMatch = prProofString.match(mergedRegex);
    const prLoginMatch = prProofString.match(loginRegex);
    const prIdMatch = prProofString.match(idRegex);

    const userLoginMatch = userProofString.match(loginRegex);
    const userIdMatch = userProofString.match(idRegex);

    return {
      isMerged: prMergedMatch ? prMergedMatch[1] === "true" : false,
      isValidUser:
        prLoginMatch && userLoginMatch
          ? prLoginMatch[1] === userLoginMatch[1]
          : false,
      isValidId:
        prIdMatch && userIdMatch ? prIdMatch[1] === userIdMatch[1] : false,
      isValidRepo: repoLink === issueDetails.repoLink,
    };
  }, [proof, pullRequestUrl, issueDetails, prProofData, userProofData]);

  return {
    validationResults,
    prProofData,
    userProofData,
  };
};

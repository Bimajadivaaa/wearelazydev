export interface CreateIssueParams {
  githubProjectId: string;
  bountyAmount: string;
  projectName: string;
  description: string;
  repoLink: string;
  deadline: bigint;
}

export interface DatePickerProps {
  date: Date;
  onSelect: (date: Date) => void;
}

export type Issue = {
  id: bigint;
  projectName: string;
  owner: string;
  bountyAmount: bigint;
  deadline: bigint;
};

export interface IssueDetails {
    deadline: number;
    projectName: string;
    owner: string;
    bountyAmount: number;
    repoLink: string;
    description: string;
}

export interface UseGithubAuthReturn {
  isAuthenticated: boolean;
  loginWithGithub: () => void;
  logout: () => void;
}

export interface UseGenerateProofReturn {
  proof: Record<string, string>;
  pullRequestUrl: string;
  isFetching: boolean;
  setPullRequestUrl: (url: string) => void;
  generateProof: () => Promise<void>;
}

export interface ValidationResults {
  isMerged: boolean;
  isValidUser: boolean;
  isValidId: boolean;
  isValidRepo: boolean;
}

export interface UseValidationRewardsProps {
  proof: Record<string, string> | null;
  pullRequestUrl: string;
  issueDetails: IssueDetails | null;
}

export interface claimRewardParams {
  issueId : string,
  prLink : string,
  isMerged : boolean
  bountyAmount: string;
}

export interface swapTokenParams {
  fromToken : string,
  swap : string,
  toToken : string,
  amount : string
}

// export interface lazyTokenBalanceParams {
//   balance : bigint,
//   address : string
// }
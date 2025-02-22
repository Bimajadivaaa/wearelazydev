// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract IssuesClaim {
    IERC20 public lazyToken;
    uint256 public issueCount;

    struct Issue {
        uint256 id;
        string githubProjectId;
        uint256 bountyAmount;
        string projectName;
        string description;
        string repoLink;
        uint256 deadline;
        bool isOpen;
        address owner;
    }

    struct ProofData {
        string prLink;
        bool isMerged;
        address developer;
    }

    struct Response {
        uint256 issueId;
        string prLink;
        uint256 bountyAmount;
        address developer;
        bool isApproved;
        uint256 timestamp;
    }

    mapping(uint256 => Issue) public issues;
    mapping(uint256 => ProofData) public claims;
    mapping(string => bool) public usedPRLinks;

    event RewardClaimed(
        uint256 indexed issueId,
        address indexed developer,
        string prLink,
        uint256 bountyAmount,
        uint256 timestamp
    );
    event PRVerified(uint256 issueId, bool isApproved);

    constructor(address _lazyToken) {
        lazyToken = IERC20(_lazyToken);
    }

    function createIssue(
        string memory _githubProjectId,
        uint256 _bountyAmount,
        string memory _projectName,
        string memory _description,
        string memory _repoLink,
        uint256 _deadline
    ) external {
        require(_bountyAmount > 0, "Bounty amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        require(
            lazyToken.transferFrom(msg.sender, address(this), _bountyAmount),
            "Transfer failed"
        );

        issues[issueCount] = Issue({
            id: issueCount,
            githubProjectId: _githubProjectId,
            bountyAmount: _bountyAmount,
            projectName: _projectName,
            description: _description,
            repoLink: _repoLink,
            deadline: _deadline,
            isOpen: true,
            owner: msg.sender
        });

        issueCount++;
    }

    function getIssueDetails(
        uint256 _issueId
    ) public view returns (Issue memory) {
        require(_issueId < issueCount, "Invalid issue ID");
        return issues[_issueId];
    }

    function getClaimResponse(
        uint256 issueId
    ) external view returns (Response memory) {
        ProofData memory proof = claims[issueId];
        Issue memory issue = getIssueDetails(issueId);

        return
            Response({
                issueId: issueId,
                prLink: proof.prLink,
                bountyAmount: issue.bountyAmount,
                developer: proof.developer,
                isApproved: proof.isMerged,
                timestamp: block.timestamp
            });
    }

    function claimReward(
        uint256 issueId,
        string memory prLink,
        bool isMerged
    ) external {
        require(!usedPRLinks[prLink], "PR already used");

        Issue memory issue = getIssueDetails(issueId);
        require(issue.isOpen, "Issue closed");
        require(block.timestamp <= issue.deadline, "Deadline passed");
        require(isMerged, "PR not merged");

        claims[issueId] = ProofData(prLink, isMerged, msg.sender);
        usedPRLinks[prLink] = true;

        require(
            lazyToken.transfer(msg.sender, issue.bountyAmount),
            "Transfer failed"
        );

        emit RewardClaimed(
            issueId,
            msg.sender,
            prLink,
            issue.bountyAmount,
            block.timestamp
        );
        emit PRVerified(issueId, true);
    }

    function verifyMergeStatus(
        string memory prLink
    ) external view returns (bool) {
        return usedPRLinks[prLink];
    }
}
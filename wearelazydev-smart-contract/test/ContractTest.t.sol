// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console2} from "forge-std/Test.sol";
import {SwapToken} from "../src/SwapToken.sol";
import {IssuesClaim} from "../src/IssuesClaim.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// mock token
contract MockERC20 is ERC20 {
    constructor() ERC20("LazyToken", "LAZY") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract ContractTest is Test {
    SwapToken public swapToken;
    IssuesClaim public issuesClaim;
    MockERC20 public lazyToken;
    
    address public owner;
    address public user;
    
    function setUp() public {
        owner = makeAddr("owner");
        user = makeAddr("user");
        
        lazyToken = new MockERC20();
        swapToken = new SwapToken(address(lazyToken));
        issuesClaim = new IssuesClaim(address(lazyToken));
        
        lazyToken.mint(owner, 1000000 * 10**18);
        lazyToken.mint(user, 1000000 * 10**18);
    }

    // ============ SwapToken Tests ============

    function testAddLiquidity() public {
        uint256 tokenAmount = 1000;
        uint256 ethAmount = 10 ether;

        vm.startPrank(owner);
        lazyToken.approve(address(swapToken), tokenAmount);
        swapToken.addLiquidity(address(lazyToken), tokenAmount);
        
        vm.deal(owner, ethAmount);
        swapToken.addLiquidity{value: ethAmount}(address(0), ethAmount);
        vm.stopPrank();

        assertEq(swapToken.tokenBalances(address(lazyToken)), tokenAmount);
        assertEq(swapToken.ethBalances(address(0)), ethAmount);
    }

    function testRemoveLiquidity() public {
        uint256 tokenAmount = 1000;
        uint256 ethAmount = 10 ether;

        vm.startPrank(owner);
        lazyToken.approve(address(swapToken), tokenAmount);
        swapToken.addLiquidity(address(lazyToken), tokenAmount);
        
        vm.deal(owner, ethAmount);
        swapToken.addLiquidity{value: ethAmount}(address(0), ethAmount);

        uint256 initialEthBalance = address(owner).balance;
        uint256 initialTokenBalance = lazyToken.balanceOf(owner);

        swapToken.removeLiquidity(address(0), ethAmount);
        swapToken.removeLiquidity(address(lazyToken), tokenAmount);
        vm.stopPrank();

        assertEq(address(owner).balance - initialEthBalance, ethAmount);
        assertEq(lazyToken.balanceOf(owner) - initialTokenBalance, tokenAmount);
    }

    
    function testSwapWithLiquidity() public {
        uint256 ethAmount = 10 ether;
        uint256 tokenAmount = 1000;


        vm.startPrank(owner);
        lazyToken.approve(address(swapToken), tokenAmount);
        swapToken.addLiquidity(address(lazyToken), tokenAmount);
        vm.deal(owner, ethAmount);
        swapToken.addLiquidity{value: ethAmount}(address(0), ethAmount);
        vm.stopPrank();

        uint256 swapAmount = 1 ether;
        vm.deal(user, swapAmount);
        
        uint256 initialBalance = lazyToken.balanceOf(user);
        
        console2.log("Initial ETH pool:", ethAmount);
        console2.log("Initial Token pool:", tokenAmount);
        console2.log("Swap amount:", swapAmount);
        

        vm.prank(user);
        swapToken.swap{value: swapAmount}(address(0), address(lazyToken), swapAmount);


        uint256 actualOutput = lazyToken.balanceOf(user) - initialBalance;
        
        assertTrue(actualOutput > 0, "Swap output should be greater than 0");
        assertTrue(actualOutput < tokenAmount, "Swap output should be less than total liquidity");

        console2.log("Actual output received:", actualOutput);
        
        uint256 initialProduct = ethAmount * tokenAmount;
        uint256 finalProduct = (ethAmount + swapAmount) * (tokenAmount - actualOutput);
        assertTrue(finalProduct >= initialProduct * 99 / 100, "Constant product should be maintained within 1% tolerance");
    }

    function test_RevertWhen_IncorrectEthAmount() public {
        uint256 ethAmount = 10 ether;
        uint256 tokenAmount = 1000;

        vm.startPrank(owner);
        lazyToken.approve(address(swapToken), tokenAmount);
        swapToken.addLiquidity(address(lazyToken), tokenAmount);
        vm.deal(owner, ethAmount);
        swapToken.addLiquidity{value: ethAmount}(address(0), ethAmount);
        vm.stopPrank();

        uint256 swapAmount = 1 ether;
        vm.deal(user, swapAmount + 1);
        vm.prank(user);
        vm.expectRevert();
        swapToken.swap{value: swapAmount + 1}(address(0), address(lazyToken), swapAmount);
    }

    function testCalculateSwap() public {
        uint256 ethAmount = 10 ether;
        uint256 tokenAmount = 1000;

        vm.startPrank(owner);
        lazyToken.approve(address(swapToken), tokenAmount);
        swapToken.addLiquidity(address(lazyToken), tokenAmount);
        vm.deal(owner, ethAmount);
        swapToken.addLiquidity{value: ethAmount}(address(0), ethAmount);
        vm.stopPrank();

        uint256 swapAmount = 1 ether;
        uint256 expectedOutput = swapToken.calculateSwap(
            address(0),
            address(lazyToken),
            swapAmount
        );

        assertTrue(expectedOutput > 0);
        assertTrue(expectedOutput < tokenAmount);
    }

    // ============ IssuesClaim Tests ============

    function test_CreateIssue() public {
        uint256 bountyAmount = 1000;
        uint256 deadline = block.timestamp + 1 days;
        
        vm.startPrank(owner);
        lazyToken.approve(address(issuesClaim), bountyAmount);
        
        issuesClaim.createIssue(
            "project-1",
            bountyAmount,
            "Test Project",
            "Test Description",
            "https://github.com/test",
            deadline
        );
        vm.stopPrank();

        IssuesClaim.Issue memory issue = issuesClaim.getIssueDetails(0);
        assertEq(issue.bountyAmount, bountyAmount);
        assertEq(issue.owner, owner);
        assertTrue(issue.isOpen);
    }

    function test_ClaimReward() public {
        uint256 bountyAmount = 1000;
        uint256 deadline = block.timestamp + 1 days;
        
        vm.startPrank(owner);
        lazyToken.approve(address(issuesClaim), bountyAmount);
        issuesClaim.createIssue(
            "project-1",
            bountyAmount,
            "Test Project",
            "Test Description",
            "https://github.com/test",
            deadline
        );
        vm.stopPrank();

        string memory prLink = "https://github.com/test/pull/1";
        vm.prank(user);
        issuesClaim.claimReward(0, prLink, true);

        assertEq(lazyToken.balanceOf(user), 1000000 * 10**18 + bountyAmount);
        assertTrue(issuesClaim.verifyMergeStatus(prLink));
    }

    function testFail_ClaimRewardAfterDeadline() public {
        uint256 bountyAmount = 1000;
        uint256 deadline = block.timestamp + 1 days;
        
        vm.startPrank(owner);
        lazyToken.approve(address(issuesClaim), bountyAmount);
        issuesClaim.createIssue(
            "project-1",
            bountyAmount,
            "Test Project",
            "Test Description",
            "https://github.com/test",
            deadline
        );
        vm.stopPrank();

        vm.warp(deadline + 1);

        vm.prank(user);
        issuesClaim.claimReward(0, "https://github.com/test/pull/1", true);
    }

    function test_GetClaimResponse() public {
        uint256 bountyAmount = 1000;
        uint256 deadline = block.timestamp + 1 days;
        string memory prLink = "https://github.com/test/pull/1";
        
        vm.startPrank(owner);
        lazyToken.approve(address(issuesClaim), bountyAmount);
        issuesClaim.createIssue(
            "project-1",
            bountyAmount,
            "Test Project",
            "Test Description",
            "https://github.com/test",
            deadline
        );
        vm.stopPrank();

        vm.prank(user);
        issuesClaim.claimReward(0, prLink, true);

        IssuesClaim.Response memory response = issuesClaim.getClaimResponse(0);
        assertEq(response.issueId, 0);
        assertEq(response.prLink, prLink);
        assertEq(response.bountyAmount, bountyAmount);
        assertEq(response.developer, user);
        assertTrue(response.isApproved);
    }

    function testFail_DuplicatePRLink() public {
        uint256 bountyAmount = 1000;
        uint256 deadline = block.timestamp + 1 days;
        string memory prLink = "https://github.com/test/pull/1";
        
        vm.startPrank(owner);
        lazyToken.approve(address(issuesClaim), bountyAmount * 2);
        
        issuesClaim.createIssue(
            "project-1",
            bountyAmount,
            "Test Project 1",
            "Test Description",
            "https://github.com/test",
            deadline
        );
        
        issuesClaim.createIssue(
            "project-2",
            bountyAmount,
            "Test Project 2",
            "Test Description",
            "https://github.com/test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(user);
        issuesClaim.claimReward(0, prLink, true);
        issuesClaim.claimReward(1, prLink, true); // This should fail
        vm.stopPrank();
    }
}
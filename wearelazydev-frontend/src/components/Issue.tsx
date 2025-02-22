import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Issue() {
  return (
    <main className="space-y-10">
      <div className="text-center">
        <h1 className="text-2xl xl:text-3xl font-semibold mt-10">
          Create, Claim, Swap—All in One Place
        </h1>
        <h2 className="text-sm opacity-70 mt-2">
          Join Pull Requests decentralized platform to collaborate, grow, and
          thrive in the Web3 economy.
        </h2>
      </div>

      <div className="grid xl:grid-cols-2 2xl:grid-cols-3 gap-5">
        <div className="p-5 shadow-inner shadow-primary bg-white text-black dark:bg-secondary dark:text-white rounded grid gap-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium">
              Empower Collaboration with{" "}
              <span className="font-bold">Create</span> Issue
            </h1>
            <h2 className="text-sm opacity-70">
              Pull Request makes it easy for developers and contributors to
              collaborate. Submit issues directly on our platform and get
              rewarded for your contributions. Whether your&apos;e reporting
              bugs, suggesting improvements, or proposing new features, every
              issue you create adds value to the ecosystem.
            </h2>
          </div>
          <ul className="list-disc list-inside mt-2">
            <li>Decentralized Issue Tracking</li>
            <li>Earn While You Contribute</li>
            <li>Community-Driven Development</li>
          </ul>
          <div className="self-end">
            <Button size={"lg"}>
              <Link href="/issues">Claim Issue</Link>
            </Button>
          </div>
        </div>

        <div className="shadow-inner shadow-primary bg-secondary p-5 rounded grid gap-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium">
              <span className="font-bold">Claim</span> Your Rewards Effortlessly
            </h1>
            <h2 className="text-sm opacity-70">
              Your contributions matter. With Pull Request, claiming rewards is
              as simple as clicking a button. Whether you have created an issue,
              resolved a bug, or participated in Sleep to Earn, your efforts are
              recognized and rewarded instantly.
            </h2>
          </div>
          <ul className="list-disc list-inside mt-2">
            <li>Instant Payouts</li>
            <li>Transparent Rewards System</li>
            <li>Flexible Earning Opportunities</li>
          </ul>
          <div className="self-end">
            <Button size={"lg"}>
              <Link href="/issues/create">Create Issue</Link>
            </Button>
          </div>
        </div>

        <div className="shadow-inner shadow-primary-foreground bg-primary text-primary-foreground p-5 rounded grid gap-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium">
              <span className="font-bold">Swap</span> Tokens with Ease
            </h1>
            <h2 className="text-sm opacity-70">
              Need liquidity? Pull Requests built-in token swapping feature
              allows you to exchange your earned tokens for other
              cryptocurrencies or stablecoins effortlessly. Enjoy low fees and
              fast transactions, all powered by our decentralized
              infrastructure.
            </h2>
          </div>
          <ul className="list-disc list-inside mt-2">
            <li>Low Fees</li>
            <li>Fast Transactions</li>
            <li>Wide Token Support</li>
          </ul>
          <div className="self-end">
            <Button variant={"secondary"} size={"lg"}>
            <Link href="/swap">Swap Token</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

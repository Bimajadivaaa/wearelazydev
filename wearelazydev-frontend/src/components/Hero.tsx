import React from "react";
import { Button } from "./ui/button";
import { Cover } from "@/components/ui/cover";
import Link from "next/link";

export default function Hero() {
  return (
    <main className="text-center space-y-5 xl:py-10">
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Unlock the Power of Web3 with Pull Request With <Cover>zkTLS</Cover>
      </h1>
      <h2 className="xl:text-lg xl:px-20">
        Wearelazydev rewards for Pull Requests & bug fixes using zkTLS for
        secure, private validation. Gamify coding, earn rewards, and join a
        community that values quality & innovation.
      </h2>
      <Button size={"lg"} className="font-bold">
        <Link href="/issues">Explore Issues</Link>
      </Button>
    </main>
  );
}

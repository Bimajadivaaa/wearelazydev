'use client'
import { useEffect } from "react";
import Hero from "@/components/Hero";
import Issue from "@/components/Issue";
import Work from "@/components/Work";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      localStorage.setItem("code", code);
    }
  }, [code]);

  return (
    <main>
      <Hero />
      <Work />
      <Issue />
    </main>
  );
}

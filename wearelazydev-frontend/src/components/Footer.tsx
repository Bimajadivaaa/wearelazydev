import React from "react";
import ThemeButton from "./ui/theme-button";

export default function Footer() {
  return (
    <main>
      <footer className="text-center py-5 mt-10">
        © 2024 Lazy. All rights reserved. <ThemeButton />
      </footer>
    </main>
  );
}

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { WagmiProviderWrapper } from "@/lib/WagmiProviderWrapper";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { Toaster } from 'sonner';

const poppins = Manrope({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wearelazydev",
  description: "Rewarding developer with zkTLS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.className} antialiased dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative`}
      >
        <WagmiProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <Header />
            <main className="space-y-10 px-5 xl:px-40 2xl:px-80 ">
              {children}
            </main>
            <Toaster position="bottom-right" toastOptions={{ duration: 3000 }}/>
            <Footer />
          </ThemeProvider>
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}

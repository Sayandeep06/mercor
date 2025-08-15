import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Providers } from "@/providers";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterVue.ai - AI-Powered Interview Platform",
  description: "Revolutionize your interview process with AI. Create, conduct, and analyze interviews with intelligent automation and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        <Providers>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar/>
              <main className="min-h-screen pt-20">
                {children}
              </main>
              <Footer/>
              <Toaster />
          </ThemeProvider>

        </Providers>
      </body>
    </html>
  );
}
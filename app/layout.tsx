import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InterVue - AI-Powered Interview Platform",
  description: "AI-powered interview platform with intelligent question generation, real-time candidate analysis, and actionable hiring insights.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased pattern`}>
        <Providers>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar/>
              <main className="min-h-screen">
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
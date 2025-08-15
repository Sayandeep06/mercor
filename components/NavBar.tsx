"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from 'lucide-react';
import { ModeToggle } from "./toogle-button";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Inter<span className="text-blue-600">Vue</span>
          </div>
        </Link>

        <div className="md:hidden">
          <Button 
            variant="ghost" 
            onClick={() => setMenuOpen(!menuOpen)} 
            size="icon"
            className="relative overflow-hidden transition-all duration-300 hover:bg-primary/10"
          >
            <div className={`transition-all duration-300 ${menuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
              <Menu size={20} />
            </div>
            <div className={`absolute transition-all duration-300 ${menuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
              <X size={20} />
            </div>
          </Button>
        </div>

        <nav className="hidden md:flex items-center gap-3">
          <ModeToggle />
          {isSignedIn ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              >
                <Link href="/#interviews">
                  <span>Interviews</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              >
                <Link href="/feedback">
                  <span>Feedback</span>
                </Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
              >
                <Link href="/generate-interview">
                  <span>Create Interview</span>
                </Link>
              </Button>
              <div className="h-6 w-px bg-border/50 mx-2"></div>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
                onClick={() => signIn('google', { callbackUrl: '/' })}
              >
                Sign In
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                onClick={() => signIn('google', { callbackUrl: '/' })}
              >
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 backdrop-blur-lg">
          <div className="container mx-auto px-6 py-4 space-y-3">
            <div className="flex justify-center mb-4">
              <ModeToggle />
            </div>
            {isSignedIn ? (
              <>
                <Link href="/#interviews" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
                    <span>My Interviews</span>
                  </Button>
                </Link>
                <Link href="/feedback" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start h-12 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
                    <span>Feedback</span>
                  </Button>
                </Link>
                <Link href="/generate-interview" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    <span>Create Interview</span>
                  </Button>
                </Link>
                <div className="h-px bg-border/50 my-4"></div>
                <Button 
                  onClick={() => {signOut(); setMenuOpen(false);}} 
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => {signIn('google', { callbackUrl: '/' }); setMenuOpen(false);}}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={() => {signIn('google', { callbackUrl: '/' }); setMenuOpen(false);}}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
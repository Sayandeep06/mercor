"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Bot } from 'lucide-react';
import { Video } from 'lucide-react';
import { NotepadText } from 'lucide-react';

import { ModeToggle } from "./toogle-button";

const Navbar = () => {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-primary"><Bot/></span>
          <span className="text-xl font-bold font-mono">
            Inter<span className="text-primary">vue</span>.ai
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          <ModeToggle />
          {isSignedIn ? (
            <>
              <Button
                  asChild
                  variant="outline"
                  className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  <Link
                      href="/#interviews"
                  >
                      <Video/>Interviews
                  </Link>
              </Button>
              <Button
                  asChild
                  variant="outline"
                  className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  <Link
                      href="/feedback"
                  >
                      <NotepadText/>Feedbacks
                  </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              >
                <Link href="/generate-interview">Create Interview</Link>
              </Button>

              <Button
                onClick={() => signOut()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                onClick={() => signIn('google', { callbackUrl: '/' })}
              >
                Sign In
              </Button>

              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() =>signIn('google', { callbackUrl: '/' })}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
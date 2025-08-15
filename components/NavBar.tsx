"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Bot, Video, NotepadText, Menu, X, Sparkles, Plus } from 'lucide-react';
import { ModeToggle } from "./toogle-button";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full transition-all duration-300 group-hover:bg-primary/30"></div>
            <span className="relative text-primary p-2 bg-primary/10 rounded-lg"><Bot size={24} /></span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            InterVue<span className="text-primary">.ai</span>
          </span>
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
                className="group relative overflow-hidden transition-all duration-300 hover:bg-primary/10 border border-transparent hover:border-primary/20"
              >
                <Link href="/#interviews" className="flex items-center gap-2">
                  <Video size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>Interviews</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="group relative overflow-hidden transition-all duration-300 hover:bg-primary/10 border border-transparent hover:border-primary/20"
              >
                <Link href="/feedback" className="flex items-center gap-2">
                  <NotepadText size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>Feedback</span>
                </Link>
              </Button>
              <Button
                asChild
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                <Link href="/generate-interview" className="flex items-center gap-2">
                  <Plus size={16} className="transition-transform duration-300 group-hover:rotate-90" />
                  <span>Create Interview</span>
                  <Sparkles size={14} className="opacity-70" />
                </Link>
              </Button>
              <div className="h-6 w-px bg-border/50 mx-2"></div>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                onClick={() => signIn('google', { callbackUrl: '/' })}
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                onClick={() => signIn('google', { callbackUrl: '/' })}
              >
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-6 py-4 space-y-3">
            <div className="flex justify-center mb-4">
              <ModeToggle />
            </div>
            {isSignedIn ? (
              <>
                <Link href="/#interviews" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12 hover:bg-primary/10 border border-transparent hover:border-primary/20">
                    <Video size={18} />
                    <span>My Interviews</span>
                  </Button>
                </Link>
                <Link href="/feedback" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12 hover:bg-primary/10 border border-transparent hover:border-primary/20">
                    <NotepadText size={18} />
                    <span>Feedback</span>
                  </Button>
                </Link>
                <Link href="/generate-interview" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Plus size={18} />
                    <span>Create Interview</span>
                    <Sparkles size={16} className="opacity-70" />
                  </Button>
                </Link>
                <div className="h-px bg-border/50 my-4"></div>
                <Button 
                  onClick={() => {signOut(); setMenuOpen(false);}} 
                  variant="outline"
                  className="w-full h-12 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full h-12 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                  onClick={() => {signIn('google', { callbackUrl: '/' }); setMenuOpen(false);}}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
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
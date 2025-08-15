"use client";

import Link from "next/link";
import { Bot, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background/50 border-t border-border/50 mt-20">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/90 pointer-events-none"></div>
      
      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full transition-all duration-300 group-hover:bg-primary/30"></div>
                <span className="relative text-primary p-2 bg-primary/10 rounded-lg"><Bot size={28} /></span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                InterVue<span className="text-primary">.ai</span>
              </span>
            </Link>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
              Revolutionizing the interview process with AI-powered solutions. 
              Create, conduct, and analyze interviews like never before.
            </p>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-all duration-300">
                <Github size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-all duration-300">
                <Twitter size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-all duration-300">
                <Linkedin size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-all duration-300">
                <Mail size={20} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/#interviews" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300"></span>
                  My Interviews
                </Link>
              </li>
              <li>
                <Link href="/generate-interview" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300"></span>
                  Create Interview
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300"></span>
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-6 text-lg">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300"></span>
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>© {currentYear} InterVue.ai. Made with</span>
            <Heart size={16} className="text-red-500 fill-current animate-pulse" />
            <span>for better interviews.</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors duration-300">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors duration-300">Cookie Policy</Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
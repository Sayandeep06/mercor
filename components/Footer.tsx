"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Inter<span className="text-blue-600">Vue</span>
              </div>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-md">
              AI-powered interview platform for smarter hiring decisions.
            </p>
            
            <div className="flex items-center gap-3">
              <a href="https://github.com/Sayandeep06/mercor" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Github size={18} />
                </Button>
              </a>
              <a href="https://x.com/gitpushsayan" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Twitter size={18} />
                </Button>
              </a>
              <a href="https://www.linkedin.com/in/sayandeep-dey-2a0aba227/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Linkedin size={18} />
                </Button>
              </a>
              <a href="mailto:deysayandeepdev@gmail.com">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Mail size={18} />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#interviews" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  My Interviews
                </Link>
              </li>
              <li>
                <Link href="/generate-interview" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Create Interview
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
            <span>© {currentYear} InterVue. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Terms</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Privacy</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Cookies</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
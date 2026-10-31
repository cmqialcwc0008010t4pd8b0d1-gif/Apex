"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Menu, X, BookOpen, User, Award, HelpCircle, ArrowRight } from "lucide-react";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                APEX<span className="text-teal-400">EDGE</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Trading Academy</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-teal-400 transition-colors">About Us</Link>
            <Link href="/courses" className="hover:text-teal-400 transition-colors">Curriculum</Link>
            <Link href="/membership" className="hover:text-teal-400 transition-colors">Membership</Link>
            <Link href="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works</Link>
            <Link href="/referral-program" className="hover:text-teal-400 transition-colors">Referral</Link>
            <Link href="/faq" className="hover:text-teal-400 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors border border-slate-700"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-teal-600 hover:bg-teal-500 text-white rounded-lg shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0F172A] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
          >
            About Us
          </Link>
          <Link
            href="/courses"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
          >
            Curriculum
          </Link>
          <Link
            href="/membership"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
          >
            Membership ($20)
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
          >
            How It Works
          </Link>
          <Link
            href="/referral-program"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
          >
            Referral Program
          </Link>
          <Link
            href="/faq"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
          >
            Contact
          </Link>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-medium bg-teal-600 text-white rounded-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

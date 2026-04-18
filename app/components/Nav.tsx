"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import GlobalSearch from "./GlobalSearch";
import { navLinks, footerLinks } from "../lib/content";

export default function Nav() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="sticky top-2 z-40 w-full px-4 md:px-6 mb-6">
      <div className="container glass-card mx-auto flex items-center justify-between h-16 py-0 px-4 sm:px-8">
        <Link 
          href="/" 
          className="hover:opacity-100 transition-opacity flex items-center py-2" 
          aria-label="The Thinking Architect"
        >
          <Logo variant="monogram" size={32} className="text-white md:w-[36px] md:h-[36px]" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 small-text">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent transition-colors">
              {link.label}
            </Link>
          ))}
          
          <GlobalSearch />

          <a
            className="button-primary px-6 py-2 text-sm"
            href={footerLinks.contact.whatsapp.href}
            aria-label="Join the WhatsApp community"
          >
            Join Community
          </a>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={handleToggle}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="p-1 -mr-1 text-foreground/80 hover:text-white transition-colors"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>
      {open ? (
        <div className="md:hidden mt-2 glass-card border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="container flex flex-col gap-4 py-6 px-6">
             {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium py-1"
                onClick={handleClose}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2" onClick={handleClose}>
               <GlobalSearch />
            </div>
            <hr className="border-white/5 my-2" />
            <a
              className="button-primary w-full"
              href={footerLinks.contact.whatsapp.href}
              aria-label="Join the community"
              onClick={handleClose}
            >
              Join Community
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

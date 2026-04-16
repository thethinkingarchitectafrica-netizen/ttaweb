import Link from "next/link";
import { navLinks, socialLinks, footerLinks, siteContent } from "../lib/content";
import NewsletterSignup from "./NewsletterSignup";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-white/5 bg-black/50 backdrop-blur-xl">

      {/* Newsletter Strip */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h3 className="font-display text-xl font-semibold">Stay in the Discourse</h3>
              <p className="body-text text-sm opacity-50">
                New sessions, events, and architectural provocations — direct to your inbox.
              </p>
            </div>
            <div className="w-full md:w-96 shrink-0">
              <NewsletterSignup source="footer" />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="font-display text-2xl font-semibold">
              TTA<span className="text-accent italic">.</span>
            </div>
            <p className="body-text text-sm max-w-[32ch]">
              {siteContent.footer.tagline}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} className="small-text hover:text-accent font-bold">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <div className="section-eyebrow !mb-0 text-[11px]">Navigate</div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="body-text text-sm hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="section-eyebrow !mb-0 text-[11px]">Community</div>
              <nav className="flex flex-col gap-2">
                {footerLinks.community.map((link) => (
                  <a key={link.label} href={link.href} className="body-text text-sm hover:text-white">
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <div className="section-eyebrow !mb-0 text-[11px]">Contact</div>
              <div className="flex flex-col gap-2">
                <a href={`mailto:${footerLinks.contact.email}`} className="body-text text-sm break-all hover:text-white">
                  {footerLinks.contact.email}
                </a>
                <a href={footerLinks.contact.whatsapp.href} className="body-text text-sm hover:text-white">
                  {footerLinks.contact.whatsapp.label}
                </a>
                <a href={footerLinks.contact.telegram.href} className="body-text text-sm hover:text-white">
                  {footerLinks.contact.telegram.label}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <div className="small-text opacity-40 lowercase">
            © {year} {siteContent.footer.copyright}
          </div>
          <div className="small-text opacity-40 lowercase">
            Designed for the future of the built environment.
          </div>
        </div>
      </div>
    </footer>
  );
}

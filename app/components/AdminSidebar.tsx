"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PlayCircle, 
  Calendar, 
  Users, 
  Globe, 
  Settings, 
  LogOut,
  ChevronRight,
  Inbox,
  Activity,
  Mail,
  Menu,
  X
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

const menuItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Sessions", href: "/admin/sessions", icon: PlayCircle },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Inquiries", href: "/admin/submissions", icon: Inbox },
  { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { label: "Activity", href: "/admin/activity", icon: Activity },
  { label: "Site Settings", href: "/admin/site", icon: Globe },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0A0A0A] sticky top-0 z-40">
        <div className="flex flex-col">
          <h2 className="heading-3 text-xl font-black text-accent tracking-tighter">TTA</h2>
          <p className="small-text opacity-40 uppercase tracking-[0.2em] text-[8px]">Portal Administration</p>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white/70 hover:text-white"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        fixed md:sticky top-[73px] md:top-0 left-0
        w-full md:w-80 h-[calc(100vh-73px)] md:h-screen 
        bg-[#0A0A0A] border-r border-white/5 
        flex flex-col p-6 md:p-8 z-30 transition-transform duration-300
      `}>
        {/* Brand - Desktop Only */}
        <div className="hidden md:flex flex-col gap-1 mb-12">
          <h2 className="heading-3 text-2xl font-black text-accent tracking-tighter">TTA</h2>
          <p className="small-text opacity-40 uppercase tracking-[0.2em] text-[10px]">Portal Administration</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center justify-between p-3 md:p-4 rounded-xl transition-all group ${
                  isActive 
                  ? "bg-accent/10 text-accent font-bold ring-1 ring-accent/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className={isActive ? "text-accent" : "opacity-60"} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-6 md:pt-8 mt-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 md:p-4 w-full text-white/40 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
    </>
  );
}

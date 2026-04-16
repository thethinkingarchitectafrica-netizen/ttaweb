"use client";

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
  Mail
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="w-80 h-screen sticky top-0 bg-[#0A0A0A] border-r border-white/5 flex flex-col p-8">
      {/* Brand */}
      <div className="flex flex-col gap-1 mb-12">
        <h2 className="heading-3 text-2xl font-black text-accent tracking-tighter">TTA</h2>
        <p className="small-text opacity-40 uppercase tracking-[0.2em] text-[10px]">Portal Administration</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between p-4 rounded-xl transition-all group ${
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
      <div className="pt-8 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 p-4 w-full text-white/40 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import Preloader from "../components/Preloader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);

      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If on login page, just show children
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not logged in and not on login page, don't show anything (it will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row bg-background min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

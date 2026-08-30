"use client";

import Link from "next/link";
import { UserCircle, SignOut } from "@phosphor-icons/react";
import { CocokInBrand } from "@/src/design-system/cocokin-brand";
import { logout } from "@/src/adapters/auth/server-adapter";

export function DashboardNavbar({ role }: { role: "TALENT" | "BUSINESS" | "ADMIN" }) {
  const profileLink = role === "TALENT" ? "/talent/profile" : "/business/profile";
  const dashboardLink = role === "TALENT" ? "/talent" : "/business";

  return (
    <header className="bg-white border-b border-[#D8E1EE] sticky top-0 z-40 w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo Placement similar to landing page */}
        <Link className="flex items-center" href={dashboardLink} aria-label="Beranda Dashboard">
          <CocokInBrand className="h-6 w-auto" decorative priority variant="wordmark" />
        </Link>

        {/* Right Nav */}
        <nav className="flex items-center gap-4">
          <Link 
            href={profileLink} 
            className="flex items-center gap-2 text-[#53647A] hover:text-[#001040] font-bold text-sm transition-colors"
          >
            <UserCircle size={24} weight="fill" />
            <span className="hidden sm:inline">Profil</span>
          </Link>

          <div className="h-6 w-px bg-[#D8E1EE] mx-2"></div>

          <form action={logout}>
            <button 
              type="submit" 
              className="flex items-center gap-2 text-[#E11D48] hover:text-[#BE123C] font-bold text-sm transition-colors"
            >
              <SignOut size={24} weight="bold" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

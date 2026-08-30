"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  House,
  ClipboardText,
  MagnifyingGlass,
  Briefcase,
  IdentificationBadge,
  FolderUser,
  User,
  ChartLineUp,
  Storefront,
  Users,
  ShieldCheck,
  Scales,
  Database,
  WarningCircle,
  SignOut,
  List,
  CaretLeft,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/src/adapters/auth/server-adapter";

import { getRoleConfig, type AppRole } from "./role-config";
import { CocokInBrand } from "./cocokin-brand";

type AppShellProps = {
  children: ReactNode;
  role: AppRole;
};

// Map icon string or name to Phosphor Icon component
function renderNavIcon(href: string, size = 20) {
  if (href === "/talent" || href === "/business" || href === "/admin") return <House size={size} weight="duotone" />;
  if (href.includes("/assessment")) return <ClipboardText size={size} weight="duotone" />;
  if (href.includes("/projects")) return <MagnifyingGlass size={size} weight="duotone" />;
  if (href.includes("/workspace")) return <Briefcase size={size} weight="duotone" />;
  if (href.includes("/passport")) return <IdentificationBadge size={size} weight="duotone" />;
  if (href.includes("/portfolio")) return <FolderUser size={size} weight="duotone" />;
  if (href.includes("/profile")) return <User size={size} weight="duotone" />;
  if (href.includes("/growth")) return <ChartLineUp size={size} weight="duotone" />;
  if (href.includes("/applicants")) return <Users size={size} weight="duotone" />;
  if (href.includes("/verification")) return <ShieldCheck size={size} weight="duotone" />;
  if (href.includes("/moderation")) return <WarningCircle size={size} weight="duotone" />;
  if (href.includes("/disputes")) return <Scales size={size} weight="duotone" />;
  if (href.includes("/taxonomy")) return <Database size={size} weight="duotone" />;
  return <Storefront size={size} weight="duotone" />;
}

export function AppShell({ children, role }: AppShellProps) {
  const config = getRoleConfig(role);
  const pathname = usePathname() ?? "/";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isNavActive = (href: string) => {
    if (href === `/${role}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div
      className={`app-shell ${isCollapsed ? "app-shell--rail" : ""}`}
      data-density={config.density}
      data-role={role}
    >
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>

      {/* Persistent / Collapsible Sidebar for Desktop & Tablet */}
      <aside
        className={`app-sidebar transition-all duration-300 ${
          isCollapsed ? "w-20 px-3" : "w-64 px-4"
        }`}
      >
        <div className="app-sidebar__brand-container flex items-center justify-between py-4 border-b border-[#D8E1EE]">
          <Link className="flex items-center gap-3" href="/">
            <CocokInBrand
              className="w-9 h-9 object-contain shrink-0"
              decorative
              priority
              variant="mark"
            />
            {!isCollapsed && (
              <span className="font-extrabold text-xl text-[#001040] tracking-tight">
                CocokIn
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-[#53647A] hover:bg-[#F1F5FB] hover:text-[#001040] transition-colors hidden md:flex items-center justify-center"
            title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
            aria-label={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          >
            {isCollapsed ? <List size={20} weight="bold" /> : <CaretLeft size={20} weight="bold" />}
          </button>
        </div>

        <nav
          aria-label="Navigasi utama"
          className="app-sidebar__nav flex flex-col justify-between h-[calc(100vh-80px)] py-4"
        >
          <div className="space-y-1">
            {config.navigation.map((item) => {
              const active = isNavActive(item.href);
              return (
                <Link
                  className={`nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "bg-[#EAF3FF] text-[#006FE6]"
                      : "text-[#53647A] hover:bg-[#F1F5FB] hover:text-[#001040]"
                  }`}
                  data-active={active}
                  href={item.href}
                  key={item.href}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="nav-link__icon shrink-0" aria-hidden="true">
                    {renderNavIcon(item.href, 22)}
                  </span>
                  {!isCollapsed && (
                    <span className="nav-link__label truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Logout Section */}
          <div className="mt-auto border-t border-[#D8E1EE] pt-4 pb-2">
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className={`nav-link text-[#E11D48] hover:bg-[#FFF1F2] hover:text-[#BE123C] w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                isCollapsed ? "justify-center" : ""
              }`}
              title={isCollapsed ? "Keluar" : undefined}
            >
              <span className="nav-link__icon shrink-0" aria-hidden="true">
                <SignOut size={22} weight="bold" />
              </span>
              {!isCollapsed && <span className="nav-link__label font-bold">Keluar</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Topbar for Mobile Header */}
      <header className="app-topbar flex items-center justify-between px-4 py-3 bg-white border-b border-[#D8E1EE] md:hidden">
        <Link className="flex items-center gap-2" href="/">
          <CocokInBrand
            className="w-8 h-8 object-contain"
            decorative
            priority
            variant="mark"
          />
          <strong className="text-lg font-bold text-[#001040]">CocokIn</strong>
        </Link>
        <div className="flex items-center gap-2">
          <span className="bg-[#EAF3FF] text-[#006FE6] text-xs font-bold px-2.5 py-1 rounded-full">
            {config.label}
          </span>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="p-1.5 text-[#E11D48] hover:bg-[#FFF1F2] rounded-lg"
            title="Keluar"
          >
            <SignOut size={20} weight="bold" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="app-content min-h-screen bg-[#F7F9FC]">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Navigasi mobile" className="mobile-navigation">
        {config.navigation.map((item) => {
          const active = isNavActive(item.href);
          return (
            <Link
              href={item.href}
              key={item.href}
              className="mobile-nav-item"
              data-active={active}
              aria-current={active ? "page" : undefined}
            >
              <span className="mobile-nav-item__icon" aria-hidden="true">
                {renderNavIcon(item.href, 22)}
              </span>
              <span className="mobile-nav-item__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Interactive Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center border border-[#D8E1EE]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", damping: 12, stiffness: 200 }}
                className="w-20 h-20 bg-[#FFF1F2] text-[#E11D48] rounded-full flex items-center justify-center mb-5 shadow-inner"
              >
                <SignOut size={44} weight="bold" />
              </motion.div>

              <h2 className="text-2xl font-bold text-[#001040] mb-2">
                Konfirmasi Keluar
              </h2>
              <p className="text-[#53647A] text-sm mb-6 leading-relaxed">
                Apakah Anda yakin ingin mengakhiri sesi aktif akun Anda di CocokIn?
              </p>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full bg-[#F1F5FB] text-[#001040] font-bold py-3 rounded-xl hover:bg-[#E2E8F0] transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogoutConfirm}
                  className="w-full bg-[#E11D48] text-white font-bold py-3 rounded-xl hover:bg-[#BE123C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? "Keluar..." : "Ya, Keluar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const publicLinks = [
  { href: "#proyek-unggulan", label: "Proyek Nyata" },
  { href: "#alur-kebutuhan", label: "Untuk Siapa" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#trust", label: "Keamanan" },
] as const;

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    menuTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeMenu, isMenuOpen]);

  return (
    <header className="public-header">
      <div className="public-header__inner">
        {/* Left: Brand Logo (Minimalist Wordmark) */}
        <Link className="public-brand" href="/" aria-label="CocokIn beranda">
          <span className="brand-dot" aria-hidden="true" />
          <strong>CocokIn</strong>
        </Link>

        {/* Center & Right Navigation (Desktop) */}
        <nav className="public-nav--desktop" aria-label="Navigasi publik">
          <div className="public-nav--center">
            {publicLinks.map((link) => (
              <Link className="public-nav__link" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="public-nav--auth">
            <Link className="public-nav__link public-nav__link--login" href="/login">
              Masuk
            </Link>
            <Link className="public-nav__btn-register" href="/register">
              Daftar Sekarang
            </Link>
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          aria-controls="public-mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          className="public-menu-trigger"
          onClick={() => (isMenuOpen ? closeMenu() : setIsMenuOpen(true))}
          ref={menuTriggerRef}
          type="button"
        >
          {isMenuOpen ? <X aria-hidden="true" size={24} /> : <List aria-hidden="true" size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu with Framer Motion */}
      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            className="public-mobile-menu"
            id="public-mobile-menu"
            aria-label="Menu publik"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {publicLinks.map((link) => (
              <Link className="public-mobile-menu__link" href={link.href} key={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
            <div className="public-mobile-menu__auth">
              <Link className="public-mobile-menu__link" href="/login" onClick={closeMenu}>
                Masuk
              </Link>
              <Link className="public-nav__btn-register" href="/register" onClick={closeMenu} style={{ textAlign: "center", justifyContent: "center" }}>
                Daftar Sekarang
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

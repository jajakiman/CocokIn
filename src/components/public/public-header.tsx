"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const publicLinks = [
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#untuk-talent", label: "Untuk Talent" },
  { href: "#untuk-umkm", label: "Untuk UMKM" },
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
        <Link className="public-brand" href="/" aria-label="CocokIn beranda">
          CocokIn
        </Link>

        <nav className="public-nav" aria-label="Navigasi publik">
          <div className="public-nav__product">
            {publicLinks.map((link) => (
              <Link href={link.href} key={link.href}>{link.label}</Link>
            ))}
          </div>
          <div className="public-nav__account">
            <Link className="public-link-button" href="/login">Masuk</Link>
            <Link className="public-primary-button" href="/register">Daftar</Link>
          </div>
        </nav>

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

      {isMenuOpen ? (
        <nav className="public-mobile-menu" id="public-mobile-menu" aria-label="Menu publik">
          {publicLinks.map((link) => (
            <Link href={link.href} key={link.href} onClick={closeMenu}>{link.label}</Link>
          ))}
          <Link href="/login" onClick={closeMenu}>Masuk</Link>
          <Link className="public-primary-button" href="/register" onClick={closeMenu}>Daftar</Link>
        </nav>
      ) : null}
    </header>
  );
}

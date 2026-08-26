"use client";

import { useState } from "react";
import type { AuthUser } from "@/src/auth-ui/types";
import { User, SignOut, CaretDown, WarningCircle } from "@phosphor-icons/react";

type AccountMenuProps = {
  user: AuthUser;
  onLogout: () => Promise<void>;
};

const ROLE_LABELS: Record<string, string> = {
  TALENT: "Talent",
  BUSINESS: "UMKM",
  ADMIN: "Admin",
};

export function AccountMenu({ user, onLogout }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    setErrorMessage(null);
    try {
      await onLogout();
    } catch {
      setErrorMessage("Gagal mengakhiri sesi. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="account-menu">
      <button
        type="button"
        className="account-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Menu Akun: ${user.displayName}`}
      >
        <span className="account-menu__avatar" aria-hidden="true">
          <User size={18} weight="bold" />
        </span>
        <span className="account-menu__name">{user.displayName}</span>
        <CaretDown size={14} weight="bold" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="account-menu__dropdown" role="menu">
          <div className="account-menu__user-info">
            <strong className="account-menu__display-name">{user.displayName}</strong>
            <span className="account-menu__email">{user.email}</span>
            <span className="account-menu__role-badge">
              {ROLE_LABELS[user.role] || user.role}
            </span>
          </div>

          {errorMessage && (
            <div className="account-menu__error" role="alert">
              <WarningCircle size={14} weight="fill" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="account-menu__divider" />

          <button
            type="button"
            className="account-menu__logout-btn"
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
          >
            <SignOut size={16} weight="bold" aria-hidden="true" />
            <span>{isLoggingOut ? "Mengakhiri sesi..." : "Keluar dari Akun"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

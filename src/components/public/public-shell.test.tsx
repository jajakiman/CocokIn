import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";

describe("PublicHeader", () => {
  it("provides the public product and account navigation", () => {
    const { container } = render(<PublicHeader />);

    const navigation = screen.getByRole("navigation", { name: "Navigasi publik" });
    const sectionLinks = {
      "Untuk Talent": "/#untuk-talent",
      "Untuk UMKM": "/#untuk-umkm",
      Pencocokan: "/#matching-engine",
      "Proyek Nyata": "/#proyek-unggulan",
      Keamanan: "/#trust",
    };

    for (const [name, href] of Object.entries(sectionLinks)) {
      expect(within(navigation).getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(within(navigation).getByRole("link", { name: "Masuk" })).toHaveAttribute("href", "/login");
    expect(within(navigation).getByRole("link", { name: "Daftar" })).toHaveAttribute("href", "/register");
    expect(within(navigation).getByRole("link", { name: "Mulai Sekarang" })).toHaveAttribute("href", "/register");
    expect(within(navigation).queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
    expect(container.querySelector(".public-brand img")).toHaveAttribute("src", "/brand/cocokin/logo-wordmark.webp");
    expect(container.querySelector(".brand-dot")).not.toBeInTheDocument();
  });

  it("opens the mobile menu from the keyboard", async () => {
    const user = userEvent.setup();
    render(<PublicHeader />);

    const trigger = screen.getByRole("button", { name: "Buka menu" });
    trigger.focus();
    await user.keyboard(" ");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Menu publik" })).toBeVisible();
  });

  it("closes the mobile menu after selecting a link", async () => {
    const user = userEvent.setup();
    render(<PublicHeader />);

    const trigger = screen.getByRole("button", { name: "Buka menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", "public-mobile-menu");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const mobileMenu = screen.getByRole("navigation", { name: "Menu publik" });
    const talentLink = within(mobileMenu).getByRole("link", { name: "Untuk Talent" });
    expect(talentLink).toHaveAttribute("href", "/#untuk-talent");
    expect(within(mobileMenu).getByRole("link", { name: "Mulai Sekarang" })).toHaveAttribute("href", "/register");
    await user.click(talentLink);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes the mobile menu with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<PublicHeader />);

    const trigger = screen.getByRole("button", { name: "Buka menu" });
    await user.click(trigger);
    await user.tab();
    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});

describe("PublicFooter", () => {
  it("offers valid product and account links without public Admin registration", () => {
    render(<PublicFooter />);

    const navigation = screen.getByRole("navigation", { name: "Navigasi footer" });
    expect(within(navigation).getByRole("link", { name: "Untuk Talent" })).toHaveAttribute("href", "/#untuk-talent");
    expect(within(navigation).getByRole("link", { name: "Untuk UMKM" })).toHaveAttribute("href", "/#untuk-umkm");
    expect(within(navigation).getByRole("link", { name: "Pencocokan" })).toHaveAttribute("href", "/#matching-engine");
    expect(within(navigation).getByRole("link", { name: "Proyek Nyata" })).toHaveAttribute("href", "/#proyek-unggulan");
    expect(within(navigation).getByRole("link", { name: "Keamanan & Garansi" })).toHaveAttribute("href", "/#trust");
    expect(screen.getByRole("link", { name: "Masuk ke Akun" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Pendaftaran Talent" })).toHaveAttribute("href", "/register/talent");
    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /design system/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Platform Resmi Penyelarasan SDG 8 & 9 Indonesia/i)).toBeVisible();
  });
});

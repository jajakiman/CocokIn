import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";

describe("PublicHeader", () => {
  it("provides the public product and account navigation", () => {
    render(<PublicHeader />);

    const navigation = screen.getByRole("navigation", { name: "Navigasi publik" });
    const links = within(navigation).getAllByRole("link");

    expect(links).toHaveLength(5);
    expect(within(navigation).getByRole("link", { name: "Cara Kerja" })).toHaveAttribute("href", "#cara-kerja");
    expect(within(navigation).getByRole("link", { name: "Untuk Talent" })).toHaveAttribute("href", "#untuk-talent");
    expect(within(navigation).getByRole("link", { name: "Untuk UMKM" })).toHaveAttribute("href", "#untuk-umkm");
    expect(within(navigation).getByRole("link", { name: "Masuk" })).toHaveAttribute("href", "/login");
    expect(within(navigation).getByRole("link", { name: "Daftar" })).toHaveAttribute("href", "/register");
    expect(within(navigation).queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
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
    await user.click(within(mobileMenu).getByRole("link", { name: "Cara Kerja" }));
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
    expect(navigation).toContainElement(screen.getByRole("link", { name: "Cara Kerja" }));
    expect(screen.getByRole("link", { name: "Masuk" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Daftar" })).toHaveAttribute("href", "/register");
    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /privasi|syarat|ketentuan/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Platform Matching & Vertical SaaS Indonesia/i)).toBeVisible();
  });
});

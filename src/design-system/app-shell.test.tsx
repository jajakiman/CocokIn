import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders role navigation through one shared accessible shell", () => {
    const { container } = render(
      <AppShell role="talent">
        <h1>Dashboard Talent</h1>
      </AppShell>,
    );

    expect(screen.getByRole("navigation", { name: "Navigasi utama" })).toBeVisible();
    expect(screen.getByRole("main")).toHaveTextContent("Dashboard Talent");
    expect(screen.getByRole("link", { name: "Lewati ke konten utama" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(container.querySelectorAll('img[src="/brand/cocokin/logo-mark.webp"]')).toHaveLength(3);
    expect(container.querySelector(".brand-dot")).not.toBeInTheDocument();
  });

  it("changes one shell-level sidebar track without competing width utilities", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AppShell role="talent">
        <h1>Dashboard Talent</h1>
      </AppShell>,
    );

    const shell = container.querySelector(".app-shell");
    const sidebar = container.querySelector(".app-sidebar");

    expect(shell).toHaveAttribute("data-sidebar", "expanded");
    expect(sidebar).not.toHaveClass("w-64", "w-20");
    const sidebarNavigation = screen.getByRole("navigation", { name: "Navigasi utama" });
    expect(within(sidebarNavigation).getByRole("link", { name: "Beranda" })).toHaveAttribute("aria-label", "Beranda");
    expect(within(sidebarNavigation).getByRole("button", { name: "Keluar" })).toHaveAttribute("aria-label", "Keluar");

    await user.click(screen.getByRole("button", { name: "Sembunyikan Sidebar" }));

    expect(shell).toHaveAttribute("data-sidebar", "collapsed");
    expect(screen.getByRole("main")).toHaveTextContent("Dashboard Talent");

    // Clicking unified morphing toggle in collapsed rail re-expands the sidebar
    const expandButton = screen.getByRole("button", { name: "Buka Sidebar" });
    expect(expandButton).toBeVisible();
    await user.click(expandButton);

    expect(shell).toHaveAttribute("data-sidebar", "expanded");
  });
});

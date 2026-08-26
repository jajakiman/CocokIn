import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders role navigation through one shared accessible shell", () => {
    render(
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
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DemoBanner } from "./demo-banner";
import { PermissionState } from "./permission-state";

describe("DemoBanner", () => {
  it("renders persistent synthetic data disclaimer and exit action", async () => {
    render(<DemoBanner />);

    expect(
      screen.getByText(/Mode Demo/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/SEEDED_DEMO/i),
    ).toBeInTheDocument();

    const exitLink = screen.getByRole("link", { name: /Keluar dari demo/i });
    expect(exitLink).toBeInTheDocument();
    expect(exitLink).toHaveAttribute("href", "/");
  });

  it("does not use 'Logout' terminology in demo mode", () => {
    render(<DemoBanner />);
    expect(screen.queryByText(/^Logout$/i)).not.toBeInTheDocument();
  });
});

describe("PermissionState", () => {
  it("renders honest permission denied message and return action", () => {
    render(
      <PermissionState
        title="Akses Dibatasi"
        message="Akun Anda tidak memiliki izin untuk mengakses area ini."
      />,
    );

    expect(screen.getByRole("heading", { name: "Akses Dibatasi" })).toBeInTheDocument();
    expect(
      screen.getByText("Akun Anda tidak memiliki izin untuk mengakses area ini."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Kembali ke Beranda/i })).toHaveAttribute("href", "/");
  });
});

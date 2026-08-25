import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders a textual semantic state instead of relying on color", () => {
    render(<StatusBadge tone="success">Terverifikasi</StatusBadge>);

    expect(screen.getByText("Terverifikasi")).toBeVisible();
    expect(screen.getByText("Terverifikasi").closest("span")).toHaveAttribute(
      "data-tone",
      "success",
    );
  });
});

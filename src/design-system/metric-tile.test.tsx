import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetricTile } from "./metric-tile";

describe("MetricTile", () => {
  it("exposes its label and value as one readable metric", () => {
    render(<MetricTile label="Kesiapan karier" value="72/100" />);

    expect(screen.getByText("Kesiapan karier")).toBeVisible();
    expect(screen.getByText("72/100")).toHaveClass("metric-tile__value");
  });
});

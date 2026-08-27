import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CocokInBrand } from "./cocokin-brand";

describe("CocokInBrand", () => {
  it("renders the official wordmark with intrinsic dimensions", () => {
    render(<CocokInBrand variant="wordmark" />);

    const image = screen.getByRole("img", { name: "CocokIn" });
    expect(image).toHaveAttribute("src", "/brand/cocokin/logo-wordmark.webp");
    expect(image).toHaveAttribute("width", "934");
    expect(image).toHaveAttribute("height", "241");
  });

  it("renders a decorative official mark without duplicate accessible text", () => {
    const { container } = render(<CocokInBrand decorative variant="mark" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", "/brand/cocokin/logo-mark.webp");
  });
});

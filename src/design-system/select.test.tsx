import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";

describe("Select Component", () => {
  it("renders trigger with placeholder and opens dropdown on click", () => {
    render(
      <Select defaultValue="react">
        <SelectTrigger>
          <SelectValue placeholder="Pilih Skill" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="nextjs">Next.js</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Click to open
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Next.js" })).toBeInTheDocument();
  });

  it("selects an item and triggers onValueChange callback", () => {
    const handleValueChange = vi.fn();
    render(
      <Select onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih Skill" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="nextjs">Next.js</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const nextOption = screen.getByRole("option", { name: "Next.js" });
    fireEvent.click(nextOption);

    expect(handleValueChange).toHaveBeenCalledWith("nextjs");
  });
});

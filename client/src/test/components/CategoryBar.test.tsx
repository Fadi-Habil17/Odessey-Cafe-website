import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CategoryBar from "../../components/CategoryBar";
import type { Category } from "../../types";

const categories: Category[] = [
  { id: "all", nameAr: "الكل", nameEn: "All" },
  { id: "greek", nameAr: "أطباق يونانية", nameEn: "Greek Specialties" },
  { id: "drinks", nameAr: "مشروبات", nameEn: "Drinks" },
];

describe("CategoryBar", () => {
  it("renders a button for every category", () => {
    render(
      <CategoryBar categories={categories} activeCategory="all" onSelect={() => {}} />
    );

    for (const cat of categories) {
      expect(screen.getByRole("button", { name: cat.nameAr })).toBeInTheDocument();
    }
  });

  it("calls onSelect with the clicked category's id", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CategoryBar categories={categories} activeCategory="all" onSelect={onSelect} />
    );

    await user.click(screen.getByRole("button", { name: "مشروبات" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("drinks");
  });

  it("renders with no categories without crashing", () => {
    render(<CategoryBar categories={[]} activeCategory="all" onSelect={() => {}} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

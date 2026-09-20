import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProductCard from "../../components/ProductCard";
import type { MenuItem } from "../../types";

const baseItem: MenuItem = {
  _id: "1",
  nameAr: "طبق أوليمبوس الخاص",
  descriptionAr: "مشاوير مشكلة، أرز يوناني، صلصة تزاتزيكي",
  price: 68000,
  currency: "ل.س",
  imageUrl: "https://example.com/olympus.jpg",
  categoryId: "greek",
  isAvailable: true,
  isFeatured: false,
};

describe("ProductCard", () => {
  it("renders the item's name, description and price", () => {
    render(<ProductCard item={baseItem} onAdd={() => {}} />);

    expect(screen.getByText("طبق أوليمبوس الخاص")).toBeInTheDocument();
    expect(
      screen.getByText("مشاوير مشكلة، أرز يوناني، صلصة تزاتزيكي")
    ).toBeInTheDocument();
    expect(screen.getByText(/68,000/)).toBeInTheDocument();
    expect(screen.getByText(/ل\.س/)).toBeInTheDocument();
  });

  it("shows a 'featured' badge only when isFeatured is true", () => {
    const { rerender } = render(<ProductCard item={baseItem} onAdd={() => {}} />);
    expect(screen.queryByText("مميز")).not.toBeInTheDocument();

    rerender(<ProductCard item={{ ...baseItem, isFeatured: true }} onAdd={() => {}} />);
    expect(screen.getByText("مميز")).toBeInTheDocument();
  });

  it("shows an 'unavailable' overlay and disables the add button when isAvailable is false", () => {
    render(<ProductCard item={{ ...baseItem, isAvailable: false }} onAdd={() => {}} />);

    expect(screen.getByText("غير متوفر")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /أضف/ })).toBeDisabled();
  });

  it("calls onAdd with the item when the add button is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<ProductCard item={baseItem} onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: /أضف/ }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(baseItem);
  });

  it("does not call onAdd when the item is unavailable", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<ProductCard item={{ ...baseItem, isAvailable: false }} onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: /أضف/ }));

    expect(onAdd).not.toHaveBeenCalled();
  });
});

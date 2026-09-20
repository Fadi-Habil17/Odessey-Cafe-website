import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductGrid from "../../components/ProductGrid";
import type { MenuItem } from "../../types";

const items: MenuItem[] = [
  {
    _id: "1",
    nameAr: "حمص بالطحينة",
    descriptionAr: "حمص مهروس، طحينة، زيت زيتون",
    price: 12000,
    currency: "ل.س",
    imageUrl: "https://example.com/hummus.jpg",
    categoryId: "appetizers",
    isAvailable: true,
  },
  {
    _id: "2",
    nameAr: "موساكا يونانية",
    descriptionAr: "طبقات باذنجان ولحم مفروم",
    price: 47000,
    currency: "ل.س",
    imageUrl: "https://example.com/moussaka.jpg",
    categoryId: "greek",
    isAvailable: true,
  },
];

describe("ProductGrid", () => {
  it("shows loading skeletons while loading is true", () => {
    const { container } = render(
      <ProductGrid items={[]} loading={true} onAdd={() => {}} />
    );
    // No product names should be rendered while loading
    expect(screen.queryByText("حمص بالطحينة")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows an empty-state message when there are no items and not loading", () => {
    render(<ProductGrid items={[]} loading={false} onAdd={() => {}} />);
    expect(
      screen.getByText("لا توجد أصناف في هذا القسم حالياً")
    ).toBeInTheDocument();
  });

  it("renders a ProductCard for every item", () => {
    render(<ProductGrid items={items} loading={false} onAdd={() => {}} />);
    expect(screen.getByText("حمص بالطحينة")).toBeInTheDocument();
    expect(screen.getByText("موساكا يونانية")).toBeInTheDocument();
  });

  it("passes onAdd through to each ProductCard", async () => {
    const onAdd = vi.fn();
    render(<ProductGrid items={items} loading={false} onAdd={onAdd} />);
    const addButtons = screen.getAllByRole("button", { name: /أضف/ });
    expect(addButtons).toHaveLength(items.length);
  });
});

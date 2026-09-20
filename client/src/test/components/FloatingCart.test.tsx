import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FloatingCart from "../../components/FloatingCart";
import type { CartItem } from "../../types";

const cartItems: CartItem[] = [
  {
    _id: "1",
    nameAr: "حمص بالطحينة",
    descriptionAr: "حمص مهروس",
    price: 12000,
    currency: "ل.س",
    imageUrl: "https://example.com/hummus.jpg",
    categoryId: "appetizers",
    isAvailable: true,
    quantity: 2,
  },
  {
    _id: "2",
    nameAr: "موساكا يونانية",
    descriptionAr: "طبقات باذنجان",
    price: 47000,
    currency: "ل.س",
    imageUrl: "https://example.com/moussaka.jpg",
    categoryId: "greek",
    isAvailable: true,
    quantity: 1,
  },
];

describe("FloatingCart", () => {
  it("renders nothing (no floating button, no drawer) when closed and cart is empty", () => {
    const { container } = render(
      <FloatingCart
        isOpen={false}
        cartItems={[]}
        onToggle={() => {}}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onRemove={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the floating button with the correct total count and price when closed with items", () => {
    render(
      <FloatingCart
        isOpen={false}
        cartItems={cartItems}
        onToggle={() => {}}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onRemove={() => {}}
      />
    );

    // total count = 2 + 1 = 3, total price = 2*12000 + 1*47000 = 71000
    expect(screen.getByText(/3 صنف/)).toBeInTheDocument();
    expect(screen.getByText(/71,000/)).toBeInTheDocument();
  });

  it("shows the empty-cart message inside the drawer when open with no items", () => {
    render(
      <FloatingCart
        isOpen={true}
        cartItems={[]}
        onToggle={() => {}}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onRemove={() => {}}
      />
    );
    expect(
      screen.getByText("سلتك فارغة، أضف أطباقك اليونانية المفضلة!")
    ).toBeInTheDocument();
  });

  it("lists every cart item with its quantity when the drawer is open", () => {
    render(
      <FloatingCart
        isOpen={true}
        cartItems={cartItems}
        onToggle={() => {}}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onRemove={() => {}}
      />
    );

    expect(screen.getByText("حمص بالطحينة")).toBeInTheDocument();
    expect(screen.getByText("موساكا يونانية")).toBeInTheDocument();
    expect(screen.getByText("الإجمالي")).toBeInTheDocument();
  });

  it("calls onIncrease/onDecrease/onRemove with the correct item id", async () => {
    const user = userEvent.setup();
    const onIncrease = vi.fn();
    const onDecrease = vi.fn();
    const onRemove = vi.fn();

    const { container } = render(
      <FloatingCart
        isOpen={true}
        cartItems={cartItems}
        onToggle={() => {}}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />
    );

    // Buttons have no accessible name (icon-only), so query by structure:
    // each cart row has [decrease, increase] buttons followed by a remove button.
    const rows = container.querySelectorAll(".space-y-3 > div");
    expect(rows).toHaveLength(2);

    const firstRowButtons = rows[0].querySelectorAll("button");
    await user.click(firstRowButtons[0]); // decrease on first item
    expect(onDecrease).toHaveBeenCalledWith("1");

    await user.click(firstRowButtons[1]); // increase on first item
    expect(onIncrease).toHaveBeenCalledWith("1");

    await user.click(firstRowButtons[2]); // remove on first item
    expect(onRemove).toHaveBeenCalledWith("1");
  });

  it("calls onToggle when clicking the floating button", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <FloatingCart
        isOpen={false}
        cartItems={cartItems}
        onToggle={onToggle}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onRemove={() => {}}
      />
    );

    await user.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

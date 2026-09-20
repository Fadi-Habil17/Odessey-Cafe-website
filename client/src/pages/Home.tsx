import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Coffee, MapPin, Sparkles } from "lucide-react";
import TopBanner from "../components/TopBanner";
import Header from "../components/Header";
import CategoryBar from "../components/CategoryBar";
import ProductGrid from "../components/ProductGrid";
import FloatingCart from "../components/FloatingCart";
import AboutModal from "../components/AboutModal";
import Footer from "../components/Footer";
import { fetchCategories, fetchMenuItems } from "../services/api";
import type { CartItem, Category, MenuItem } from "../types";

const featureCards = [
  {
    title: "موقع مميز",
    text: "شارع البريد-سنتر النحاس",
    icon: Coffee,
  },
  {
    title: "أجواء مريحة",
    text: "جلسات داخلية وخارجية، وموسيقى هادئة، وإضاءة دافئة.",
    icon: Sparkles,
  },
  {
    title: "بيئة ثقافية",
    text: "إضاءة معمارية، وقوام طبيعي، وأجواء هادئة مستوحاة من الكلاسيكيات العريقة.",
    icon: MapPin,
  },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((data) =>
        setCategories([{ id: "all", nameAr: "الكل", nameEn: "All" }, ...data]),
      )
      .catch(() =>
        setCategories([{ id: "all", nameAr: "الكل", nameEn: "All" }]),
      );
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMenuItems(activeCategory)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        (item.nameAr || "").toLowerCase().includes(q) ||
        (item.descriptionAr || "").toLowerCase().includes(q) ||
        (item.nameEn || "").toLowerCase().includes(q),
    );
  }, [items, search]);

  function handleAddToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function handleIncrease(id: string) {
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  }

  function handleDecrease(id: string) {
    setCart((prev) =>
      prev
        .map((i) =>
          i._id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  function handleRemove(id: string) {
    setCart((prev) => prev.filter((i) => i._id !== id));
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#3E2A1D]">
      <TopBanner onAboutClick={() => setIsAboutOpen(true)} />
      <Header
        cartCount={cartCount}
        onSearchChange={setSearch}
        onCartClick={() => setIsCartOpen((v) => !v)}
      />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#DAB383]/70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(218,179,131,0.22),_transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#DAB383]/70 bg-[#F5F0E8] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#754E2E]">
                  مقهى يناسب جميع الأذواق
                </span>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-[#754E2E]">
                    منذ 2025
                  </p>
                  <h1 className="font-display text-5xl leading-[0.82] tracking-[-0.04em] text-[#3E2A1D] sm:text-6xl lg:text-[7rem]">
                    ODYSSEY
                    <span className="block text-[#754E2E]">CAFE</span>
                  </h1>
                </div>

                <p className="max-w-xl text-lg leading-relaxed text-[#3E2A1D]/75 md:text-xl">
                  “رحلة عبر القهوة والطعام والثقافة.”
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("signature-menu")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className="inline-flex items-center gap-2 bg-[#754E2E] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F5F0E8] transition-transform hover:-translate-y-0.5 hover:bg-[#3E2A1D]"
                  >
                    استكشف القائمة
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div className="grid max-w-xl grid-cols-3 gap-4 pt-4">
                  {[
                    ["+15", "أراكيل مميزة"],
                    ["+20", "أصناف حلويات"],
                    ["+10", "كوكتيلات شهية"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="editorial-panel rounded-[1.2rem] p-4"
                    >
                      <p className="font-display text-3xl leading-none text-[#3E2A1D]">
                        {value}
                      </p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#754E2E]">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="architectural-frame">
                  <div className="overflow-hidden rounded-[1.1rem] border border-[#DAB383]/70 bg-[#E8DDCC]">
                    <img
                      src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                      alt="Odyssey Cafe interior"
                      className="float-soft h-[520px] w-full object-cover"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-5 left-5 rounded-full border border-[#DAB383] bg-[#F5F0E8]/90 px-4 py-3 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#754E2E] p-2 text-[#F5F0E8]">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#754E2E]">
                        موقعنا
                      </p>
                      <p className="text-sm font-semibold text-[#3E2A1D]">
                        شارع البريد-سنتر النحاس
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {featureCards.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="editorial-panel rounded-[1.5rem] p-6 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-full border border-[#DAB383]/70 bg-[#E8DDCC] p-3 text-[#754E2E]">
                  <Icon size={18} />
                </div>
                <h2 className="font-display text-4xl leading-none text-[#3E2A1D]">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#3E2A1D]/70">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <section
          id="signature-menu"
          className="mx-auto max-w-7xl px-4 py-12 md:py-16"
        >
          <ProductGrid
            items={filteredItems}
            loading={loading}
            onAdd={handleAddToCart}
          />
        </section>
      </main>

      <Footer />

      <FloatingCart
        isOpen={isCartOpen}
        cartItems={cart}
        onToggle={() => setIsCartOpen((v) => !v)}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

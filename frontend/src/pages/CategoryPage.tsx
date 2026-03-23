import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import categoryElectronics from "../assets/category-electronics.svg";
import categoryFashion from "../assets/category-fashion.svg";
import categoryHome from "../assets/category-home.svg";
import categoryBeauty from "../assets/category-beauty.svg";
import categorySports from "../assets/category-sports.svg";
import categoryGroceries from "../assets/category-groceries.svg";
import categoryToys from "../assets/category-toys.svg";

export const CategoryPage = () => {
  const { categoryName = "" } = useParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const category = decodeURIComponent(categoryName);
  const categoryKey = category.trim().toLowerCase();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        setLoading(true);
        // Robust: load all products and filter client-side by category.
        // This avoids mismatches with backend filtering/search behavior.
        const { data } = await api.get("/products", { params: { q: "", category: "" } });
        setAllProducts(data);
        setLoading(false);
      } catch {
        setError("Failed to load category products.");
        setLoading(false);
      }
    };
    void fetchProducts();
  }, []);

  const meta = useMemo(() => {
    const imgByKey: Record<string, string> = {
      electronics: categoryElectronics,
      fashion: categoryFashion,
      home: categoryHome,
      beauty: categoryBeauty,
      sports: categorySports,
      groceries: categoryGroceries,
      toys: categoryToys,
    };

    const subtitleByKey: Record<string, string> = {
      electronics: "Discover tech picks with premium performance.",
      fashion: "Style refresh with best-selling essentials.",
      home: "Everything for a smoother everyday home.",
      beauty: "Glow-forward favorites for daily routines.",
      sports: "Gear up for training, stretch, and play.",
      groceries: "Fresh pantry upgrades your kitchen will love.",
      toys: "Fun, learning, and imaginative play.",
    };

    const accentByKey: Record<string, string> = {
      electronics: "from-[#0f172a] to-[#1d4ed8]",
      fashion: "from-[#111827] to-[#db2777]",
      home: "from-[#0f766e] to-[#0ea5e9]",
      beauty: "from-[#1e293b] to-[#db2777]",
      sports: "from-[#064e3b] to-[#22c55e]",
      groceries: "from-[#111827] to-[#22c55e]",
      toys: "from-[#0f172a] to-[#f59e0b]",
    };

    return {
      image: imgByKey[categoryKey] || categoryElectronics,
      subtitle: subtitleByKey[categoryKey] || "Browse curated picks across this category.",
      accent: accentByKey[categoryKey] || "from-[#0f172a] to-[#1d4ed8]",
    };
  }, [categoryKey]);

  const categoryProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.category?.toLowerCase() === categoryKey)
      .filter((p) => {
        const query = q.trim().toLowerCase();
        if (!query) return true;
        return `${p.title} ${p.description}`.toLowerCase().includes(query);
      })
      .sort((a, b) => b.rating - a.rating);
  }, [allProducts, categoryKey, q]);

  const fallbackTop = useMemo(() => {
    return [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 12);
  }, [allProducts]);

  const heroImage = useMemo(() => {
    return categoryProducts[0]?.image || fallbackTop[0]?.image;
  }, [categoryProducts, fallbackTop]);

  const topPicks = useMemo(() => {
    return categoryProducts.slice(0, 10);
  }, [categoryProducts]);

  const inStockPicks = useMemo(() => {
    return categoryProducts.filter((p) => p.stock > 0).slice(0, 10);
  }, [categoryProducts]);

  const under50 = useMemo(() => {
    return categoryProducts.filter((p) => p.price <= 50).slice(0, 10);
  }, [categoryProducts]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      {loading ? (
        <div className="space-y-4">
          <div className="h-52 animate-pulse rounded-3xl bg-slate-100" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          </div>
          <div className="h-10 animate-pulse rounded-2xl bg-slate-100" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className={`relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r ${meta.accent} p-6 text-white shadow-xl md:p-10`}>
            <div className="relative z-10 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Category Spotlight</p>
              <h1 className="mt-2 text-2xl font-black md:text-4xl">{category}</h1>
              <p className="mt-3 text-sm text-white/80 md:text-base">{meta.subtitle}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Top rated</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Fast delivery</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Secure checkout</span>
              </div>
            </div>
            {heroImage ? (
              <img
                src={heroImage}
                alt={`${category} banner`}
                className="absolute right-0 top-0 hidden h-full w-auto opacity-90 md:block lg:max-w-[430px] xl:max-w-[520px] object-cover"
              />
            ) : (
              <div className="absolute right-0 top-0 hidden h-full w-auto opacity-70 md:block lg:max-w-[430px] xl:max-w-[520px] bg-gradient-to-r from-slate-200 to-slate-100" />
            )}
          </div>

          <div className="mb-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 md:text-base">Search in {category}</h2>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${category}...`}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-amber-400 transition focus:ring-2"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
                  <Truck size={16} className="text-emerald-600" /> Fast delivery
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
                  <ShieldCheck size={16} className="text-blue-600" /> Buyer protection
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
                  <Sparkles size={16} className="text-amber-500" /> Curated picks
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
                  <span className="text-slate-700">Top quality</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">Top picks in {category}</h2>
              <p className="text-xs font-semibold text-slate-500">{topPicks.length} items</p>
            </div>
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
              {topPicks.map((product) => (
                <div key={`rail-top-${product._id}`} className="min-w-[230px] w-[230px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">In stock now</h2>
              <p className="text-xs font-semibold text-slate-500">{inStockPicks.length} items</p>
            </div>
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
              {(inStockPicks.length ? inStockPicks : topPicks).map((product) => (
                <div key={`rail-stock-${product._id}`} className="min-w-[230px] w-[230px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">Under $50</h2>
              <p className="text-xs font-semibold text-slate-500">{under50.length} items</p>
            </div>
            {under50.length ? (
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
                {under50.map((product) => (
                  <div key={`rail-50-${product._id}`} className="min-w-[230px] w-[230px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                No items under $50 in {category}. Showing top-rated picks instead.
              </div>
            )}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Results</h2>
            <p className="text-xs font-semibold text-slate-500">{categoryProducts.length} items</p>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          {!error && categoryProducts.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">No products found for {category}.</p>
              <p className="mt-1 text-sm text-slate-600">Showing top rated products instead.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {(categoryProducts.length ? categoryProducts : fallbackTop).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

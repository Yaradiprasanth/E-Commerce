import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";

export const BestSellersPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        setLoading(true);
        const { data } = await api.get("/products", { params: { q: "", category: "" } });
        setAllProducts(data);
        setLoading(false);
      } catch {
        setError("Failed to load best sellers.");
        setLoading(false);
      }
    };
    void fetchProducts();
  }, []);

  const best = useMemo(() => {
    return [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 20);
  }, [allProducts]);

  const heroImage = best[0]?.image;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      {loading ? (
        <div className="space-y-4">
          <div className="h-56 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-10 animate-pulse rounded-2xl bg-slate-100" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`skd-${i}`} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-5 overflow-hidden rounded-3xl bg-white p-0 shadow-sm">
            {heroImage ? (
              <img src={heroImage} alt="Best sellers hero" className="h-auto w-full object-cover" />
            ) : (
              <div className="h-56 w-full bg-gradient-to-r from-slate-200 to-slate-100" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/0" />
          </div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Top Products</h2>
            <p className="text-xs font-semibold text-slate-500">{best.length} items</p>
          </div>
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}
          {!error && best.length === 0 && (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              No best sellers found right now. Try again later.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {best.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

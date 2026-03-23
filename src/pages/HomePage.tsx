import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import { api } from "../api";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import heroShopping from "../assets/hero-shopping.svg";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAllProducts, setLoadingAllProducts] = useState(true);

  useEffect(() => {
    let qFromUrl = searchParams.get("q") || "";
    const categoryFromUrl = categoryName || searchParams.get("category") || "";
    if (location.pathname === "/deals") qFromUrl = "deal";
    if (location.pathname === "/best-sellers") qFromUrl = "best";
    setQ(qFromUrl);
    setCategory(categoryFromUrl);
  }, [searchParams, categoryName, location.pathname]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const { data } = await api.get("/products", { params: { q, category } });
        setProducts(data);
      } finally {
        setLoadingProducts(false);
      }
    };
    void fetchProducts();
  }, [q, category]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingAllProducts(true);
        const { data } = await api.get("/products", { params: { q: "", category: "" } });
        setAllProducts(data);
      } finally {
        setLoadingAllProducts(false);
      }
    };
    void fetchAll();
  }, []);

  const banner = {
    Electronics: loadingAllProducts ? "" : allProducts.find((p) => p.category === "Electronics")?.image || "",
    Fashion: loadingAllProducts ? "" : allProducts.find((p) => p.category === "Fashion")?.image || "",
    Home: loadingAllProducts ? "" : allProducts.find((p) => p.category === "Home")?.image || "",
  };

  const pageHeading =
    location.pathname === "/deals"
      ? "Today's Deals"
      : location.pathname === "/best-sellers"
      ? "Best Sellers"
      : category
      ? `${category} Products`
      : "Best Sellers For You";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-5 md:py-7">
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#101820] via-[#17324a] to-[#1b4d69] p-6 text-white shadow-xl md:p-9">
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Top rated marketplace</p>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">Everything you need, delivered with premium speed.</h1>
          <p className="mt-3 text-sm text-slate-200 md:text-base">
            Inspired by the best e-commerce experiences: trust-first design, fast discovery, and smooth checkout.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Trending Deals</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">24/7 Support</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Secure Payments</span>
          </div>
        </div>
        <img
          src={heroShopping}
          alt="Premium shopping collection"
          className="absolute bottom-0 right-0 hidden h-full max-h-72 w-auto opacity-80 lg:block"
        />
        <div className="pointer-events-none absolute -right-14 -top-12 h-56 w-56 rounded-full bg-amber-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-cyan-300/25 blur-3xl" />
      </div>
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <article
          onClick={() => {
            navigate("/category/Electronics");
          }}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-bold text-slate-900">Up to 60% off</p>
          <p className="mt-1 text-xs text-slate-500">Electronics and accessories</p>
          {banner.Electronics ? (
            <img src={banner.Electronics} alt="Electronics section banner" className="mt-3 h-28 w-full rounded-xl object-cover" />
          ) : (
            <div className="mt-3 h-28 w-full animate-pulse rounded-xl bg-slate-100" />
          )}
        </article>
        <article
          onClick={() => {
            navigate("/category/Fashion");
          }}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-bold text-slate-900">Style refresh picks</p>
          <p className="mt-1 text-xs text-slate-500">Trending fashion this week</p>
          {banner.Fashion ? (
            <img src={banner.Fashion} alt="Fashion section banner" className="mt-3 h-28 w-full rounded-xl object-cover" />
          ) : (
            <div className="mt-3 h-28 w-full animate-pulse rounded-xl bg-slate-100" />
          )}
        </article>
        <article
          onClick={() => {
            navigate("/category/Home");
          }}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-bold text-slate-900">Home essentials</p>
          <p className="mt-1 text-xs text-slate-500">Everyday items for your space</p>
          {banner.Home ? (
            <img src={banner.Home} alt="Home section banner" className="mt-3 h-28 w-full rounded-xl object-cover" />
          ) : (
            <div className="mt-3 h-28 w-full animate-pulse rounded-xl bg-slate-100" />
          )}
        </article>
      </div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {banner.Electronics ? (
          <img src={banner.Electronics} alt="Electronics deals" className="h-28 w-full rounded-2xl border border-slate-200 object-cover shadow-sm sm:h-32" />
        ) : (
          <div className="h-28 w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:h-32" />
        )}
        {banner.Fashion ? (
          <img src={banner.Fashion} alt="Fashion deals" className="h-28 w-full rounded-2xl border border-slate-200 object-cover shadow-sm sm:h-32" />
        ) : (
          <div className="h-28 w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:h-32" />
        )}
        {banner.Home ? (
          <img src={banner.Home} alt="Home essentials deals" className="h-28 w-full rounded-2xl border border-slate-200 object-cover shadow-sm sm:h-32" />
        ) : (
          <div className="h-28 w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:h-32" />
        )}
      </div>
      <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
          <Zap size={16} className="text-amber-500" /> Lightning fast delivery network
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
          <ShieldCheck size={16} className="text-emerald-600" /> Buyer protection on every order
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
          <Sparkles size={16} className="text-blue-600" /> Curated, best-selling categories
        </div>
      </div>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <input
          value={q}
          onChange={(e) => {
            const value = e.target.value;
            setQ(value);
            const nextParams = new URLSearchParams(searchParams);
            if (value.trim()) nextParams.set("q", value);
            else nextParams.delete("q");
            setSearchParams(nextParams, { replace: true });
          }}
          placeholder="Search products..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-amber-400 transition focus:ring-2"
        />
        <select
          value={category}
          onChange={(e) => {
            const selected = e.target.value;
            setCategory(selected);
            if (selected) navigate(`/category/${encodeURIComponent(selected)}`);
            else navigate("/");
          }}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-amber-400 transition focus:ring-2 md:w-56"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Beauty">Beauty</option>
          <option value="Furniture">Furniture</option>
          <option value="Home">Home</option>
          <option value="Sports">Sports</option>
          <option value="Groceries">Groceries</option>
          <option value="Toys">Toys</option>
        </select>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 md:text-xl">{pageHeading}</h2>
        <p className="text-xs font-semibold text-slate-500">{loadingProducts ? "Loading..." : `${products.length} items`}</p>
      </div>
      {loadingProducts ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`sk-${i}`} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

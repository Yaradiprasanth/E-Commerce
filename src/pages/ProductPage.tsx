import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { ShieldCheck, Star, Truck } from "lucide-react";

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    };
    void fetchProduct();
  }, [id]);

  if (!product) return <p className="p-6">Loading...</p>;
  const stars = Math.round(product.rating);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="lg:col-span-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ← Back
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <img src={product.image} alt={product.title} className="h-80 w-full rounded-xl object-cover md:h-[520px]" />
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{product.title}</h1>
          <div className="mt-2 flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={`rating-${i}`} size={15} fill={i < stars ? "#f59e0b" : "none"} />
            ))}
            <span className="ml-1 text-sm font-medium text-slate-600">{product.rating.toFixed(1)} rating</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
          <p className="mt-4 text-4xl font-black text-slate-900">${product.price.toFixed(2)}</p>
          <p className="mt-1 text-sm text-emerald-700">In stock: {product.stock} units</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2 text-sm text-slate-700">
            <p className="flex items-center gap-2">
              <Truck size={16} className="text-emerald-600" /> Free delivery by tomorrow
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600" /> Secure transaction and easy returns
            </p>
          </div>
          <button
            onClick={async () => {
              await addToCart(product._id, product);
              navigate("/cart");
            }}
            className="mt-5 w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-amber-300"
          >
            Add to Cart
          </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-4 text-xs text-slate-200">
          Premium shopping tip: combine multiple items to unlock better shipping value.
        </div>
      </div>
    </section>
  );
};

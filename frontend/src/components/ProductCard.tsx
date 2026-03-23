import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { Star } from "lucide-react";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const stars = Math.round(product.rating);

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative overflow-hidden rounded-xl bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 md:h-56"
        />
        <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700">
          {product.category}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold text-slate-900">{product.title}</h3>
      <div className="mt-1 flex items-center gap-1 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star key={`${product._id}-star-${i}`} size={13} fill={i < stars ? "#f59e0b" : "none"} />
        ))}
        <span className="ml-1 text-xs font-medium text-slate-500">({product.rating.toFixed(1)})</span>
      </div>
      <p className="mt-2 text-xl font-extrabold text-slate-900">${product.price.toFixed(2)}</p>
      <p className="text-xs text-emerald-700">Eligible for FREE fast delivery</p>
      <div className="mt-3 flex gap-2">
        <Link
          to={`/product/${product._id}`}
          className="w-1/2 rounded-full border border-slate-300 px-3 py-2 text-center text-xs font-semibold hover:bg-slate-50"
        >
          Details
        </Link>
        <button
          onClick={async () => {
            await addToCart(product._id, product);
            navigate("/cart");
          }}
          className="w-1/2 rounded-full bg-amber-400 px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};

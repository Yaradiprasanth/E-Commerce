import { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const CartPage = () => {
  const { cart, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const onProceedToBuy = () => {
    if (!user) {
      navigate("/login", { state: { from: "/delivery-address" } });
      return;
    }
    navigate("/delivery-address");
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-black text-slate-900">Your Cart</h1>
      <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
        <ShieldCheck size={14} className="text-emerald-600" /> Secure checkout with buyer protection
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {cart.map((item) => {
            const lineTotal = item.product.price * item.quantity;
            return (
              <article
                key={item.product._id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="font-bold text-slate-900">{item.product.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-700">${item.product.price.toFixed(2)}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-700">
                      <Truck size={13} /> Fast delivery available
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => updateQty(item.product._id, Math.max(1, item.quantity - 1))}
                      className="h-8 w-8 rounded-lg bg-white text-lg font-black text-slate-800 shadow-sm transition hover:bg-slate-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <div className="min-w-[36px] text-center text-sm font-semibold text-slate-900">{item.quantity}</div>
                    <button
                      type="button"
                      onClick={() => updateQty(item.product._id, item.quantity + 1)}
                      className="h-8 w-8 rounded-lg bg-white text-lg font-black text-slate-800 shadow-sm transition hover:bg-slate-100"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">Line total</p>
                    <p className="text-sm font-black text-slate-900">${lineTotal.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-end md:justify-start">
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        {cart.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
            Your cart is empty. Add products from the homepage to continue.
          </div>
        )}
      </div>
      <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Order Summary</p>
        <p className="mt-3 text-2xl font-black text-slate-900">${total.toFixed(2)}</p>
          <p className="mt-1 text-xs text-slate-500">Taxes and shipping calculated at checkout</p>
          <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
            <p className="font-semibold">Your order is eligible for fast delivery.</p>
            <p>Free delivery above $49 (demo).</p>
          </div>
        <button
          onClick={onProceedToBuy}
          disabled={!cart.length}
          className="mt-4 w-full rounded-full bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
            Proceed to Pay
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">By placing order, you agree to terms and returns policy.</p>
      </div>
      </div>
    </section>
  );
};

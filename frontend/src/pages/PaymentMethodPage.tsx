import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { api, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type PaymentMethod =
  | "credit_debit"
  | "net_banking"
  | "upi"
  | "emi"
  | "cod";

const SHIPPING_ADDRESS_KEY = "checkout_shipping_address_v1";
const LAST_ORDER_KEY = "last_order_v1";
const LAST_PAYMENT_SELECTION_KEY = "last_payment_selection_v1";

export const PaymentMethodPage = () => {
  const { cart, refreshCart } = useCart();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const savedShippingAddress = localStorage.getItem(SHIPPING_ADDRESS_KEY) || "";

  const [method, setMethod] = useState<PaymentMethod>("credit_debit");
  const [upiApp, setUpiApp] = useState("PhonePe");
  const [netBank, setNetBank] = useState("SBI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );
  const delivery = subtotal >= 49 || subtotal === 0 ? 0 : 40;
  const total = subtotal + delivery;

  useEffect(() => {
    if (!cart.length) {
      navigate("/cart");
      return;
    }
    if (!user) {
      navigate("/login", { state: { from: "/payment-method" } });
      return;
    }
    if (!savedShippingAddress) {
      navigate("/delivery-address");
    }
  }, [cart.length, navigate, savedShippingAddress, user]);

  const placeOrder = async () => {
    setError(null);
    if (!user || !token) {
      navigate("/login", { state: { from: "/payment-method" } });
      return;
    }

    // Ensure axios has the latest JWT (prevents 401 due to token/boot race).
    setAuthToken(token);

    if (!user) {
      navigate("/login", { state: { from: "/payment-method" } });
      return;
    }
    if (!cart.length) {
      navigate("/cart");
      return;
    }
    if (!savedShippingAddress) {
      navigate("/delivery-address");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: savedShippingAddress,
        paymentMethod: method,
      });
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(data));
      localStorage.setItem(
        LAST_PAYMENT_SELECTION_KEY,
        JSON.stringify({
          method,
          upiApp,
          netBank,
        })
      );
      await refreshCart();
      navigate("/place-order", {
        state: {
          order: data,
          paymentSelection: { method, upiApp, netBank },
        },
      });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (err as any)?.response?.status;
      if (status === 401) {
        try {
          logout();
        } catch {
          // ignore
        }
        navigate("/login", { state: { from: "/payment-method" } });
        return;
      }
      setError("Payment failed (demo). Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Payment method</h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck size={14} className="text-emerald-600" /> Secure checkout
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/delivery-address")}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to address
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Your cart is empty. Add items first.
        </div>
      ) : (
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-slate-900">Payment method</div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Deliver to</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{savedShippingAddress}</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    checked={method === "credit_debit"}
                    onChange={() => setMethod("credit_debit")}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-semibold">Credit / Debit card</div>
                    <div className="text-xs text-slate-600">Visa, Mastercard, RuPay (demo)</div>
                    {method === "credit_debit" && (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold text-slate-700">Card details (demo)</p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <input
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
                            placeholder="Name on card"
                            disabled
                          />
                          <input
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
                            placeholder="Card number"
                            disabled
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    checked={method === "net_banking"}
                    onChange={() => setMethod("net_banking")}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-semibold">Net Banking</div>
                    <div className="text-xs text-slate-600">Choose a bank (demo)</div>
                    {method === "net_banking" && (
                      <div className="mt-3">
                        <select
                          value={netBank}
                          onChange={(e) => setNetBank(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                        >
                          {["SBI", "HDFC", "ICICI", "Axis", "Kotak"].map((b) => (
                            <option value={b} key={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-xs text-slate-500">Selected: {netBank} (demo)</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    checked={method === "upi"}
                    onChange={() => setMethod("upi")}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-semibold">UPI</div>
                    <div className="text-xs text-slate-600">Scan & pay on UPI app (demo)</div>
                    {method === "upi" && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {["PhonePe", "Google Pay", "Paytm", "BHIM UPI"].map((app) => (
                            <button
                              type="button"
                              key={app}
                              onClick={() => setUpiApp(app)}
                              className={[
                                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                                upiApp === app
                                  ? "border-amber-300 bg-amber-50 text-amber-800"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Selected: {upiApp} (demo)</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    checked={method === "emi"}
                    onChange={() => setMethod("emi")}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-semibold">EMI</div>
                    <div className="text-xs text-slate-600">EMI options at checkout (demo)</div>
                    {method === "emi" && (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold text-slate-700">EMI plan (demo)</p>
                        <p className="mt-1 text-xs text-slate-500">Choose your plan at payment gateway (demo).</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    checked={method === "cod"}
                    onChange={() => setMethod("cod")}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-semibold">Cash on Delivery</div>
                    <div className="text-xs text-slate-600">Pay at doorstep (demo)</div>
                    {method === "cod" && (
                      <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                        <p className="text-xs font-semibold text-emerald-800">COD selected</p>
                        <p className="mt-1 text-xs text-emerald-700">
                          You will pay when your order is delivered (demo).
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              <button
                onClick={placeOrder}
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
              >
                {loading ? "Placing order..." : "Proceed"}
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-900">Order total</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Items</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Delivery</span>
                  <span className="font-semibold">{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-700 font-semibold">Total</span>
                  <span className="font-black text-slate-900">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <Truck size={14} /> Your order is eligible for fast delivery.
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};


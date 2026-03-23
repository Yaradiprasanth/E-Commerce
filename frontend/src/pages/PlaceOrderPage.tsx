import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Truck, ShieldCheck } from "lucide-react";

type StoredOrder = {
  _id: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod?: string;
  createdAt?: string;
  items?: Array<{
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
};

type StoredPaymentSelection = {
  method: string;
  upiApp?: string;
  netBank?: string;
};

const LAST_ORDER_KEY = "last_order_v1";
const LAST_PAYMENT_SELECTION_KEY = "last_payment_selection_v1";

export const PlaceOrderPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const passedOrder = (location.state as { order?: StoredOrder; paymentSelection?: StoredPaymentSelection })?.order;
  const passedPaymentSelection = (location.state as {
    order?: StoredOrder;
    paymentSelection?: StoredPaymentSelection;
  })?.paymentSelection;

  const [storedOrder, setStoredOrder] = useState<StoredOrder | null>(null);
  const [paymentSelection, setPaymentSelection] = useState<StoredPaymentSelection | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { state: { from: "/place-order" } });
      return;
    }

    if (passedOrder) {
      setStoredOrder(passedOrder);
    }
    if (passedPaymentSelection) {
      setPaymentSelection(passedPaymentSelection);
    }
    if (passedOrder) return;

    const orderRaw = localStorage.getItem(LAST_ORDER_KEY);
    if (!orderRaw) {
      navigate("/orders");
      return;
    }

    try {
      setStoredOrder(JSON.parse(orderRaw) as StoredOrder);
    } catch {
      // If an old/non-JSON value is stored, recover gracefully.
      localStorage.removeItem(LAST_ORDER_KEY);
      navigate("/orders");
    }

    const payRaw = localStorage.getItem(LAST_PAYMENT_SELECTION_KEY);
    if (payRaw) {
      try {
        setPaymentSelection(JSON.parse(payRaw) as StoredPaymentSelection);
      } catch {
        localStorage.removeItem(LAST_PAYMENT_SELECTION_KEY);
      }
    }
  }, [loading, navigate, user]);

  const paymentLabel = useMemo(() => {
    const method = paymentSelection?.method;
    if (!method) return "";
    if (method === "upi") return `UPI (${paymentSelection?.upiApp || "demo"})`;
    if (method === "net_banking") return `Net Banking (${paymentSelection?.netBank || "demo"})`;
    if (method === "cod") return "Cash on Delivery";
    if (method === "emi") return "EMI (demo)";
    return "Credit / Debit card (demo)";
  }, [paymentSelection]);

  if (!storedOrder) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-slate-700">Placing your order...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Place your order</h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck size={14} className="text-emerald-600" /> Order protection enabled (demo)
          </div>
        </div>
        <Link
          to="/orders"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          View orders
        </Link>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Success</p>
            <p className="mt-2 text-lg font-black text-slate-900">
              Your order has been placed.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Order # {storedOrder._id ? storedOrder._id.slice(-6) : "—"}
            </p>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-start justify-between gap-4">
              <span className="text-slate-600">Payment method</span>
              <span className="font-semibold text-slate-900">{paymentLabel || storedOrder.paymentMethod || "demo"}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-slate-600">Ship to</span>
              <span className="text-right font-semibold text-slate-900">{storedOrder.shippingAddress}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-slate-600">Status</span>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{storedOrder.status}</span>
            </div>
          </div>

          {storedOrder.items?.length ? (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Order items
              </p>
              <div className="space-y-2">
                {storedOrder.items.map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-14 w-14 shrink-0 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-2">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-900">
                        Line total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex gap-2">
            <Link
              to="/"
              className="w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-amber-300"
            >
              Continue shopping
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Truck size={18} className="text-emerald-700" /> Delivery summary (demo)
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total</span>
              <span className="font-black text-slate-900">${storedOrder.totalAmount.toFixed(2)}</span>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
              <p className="font-semibold">Estimated delivery</p>
              <p className="mt-1">Arrives in 2-5 business days (demo).</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};


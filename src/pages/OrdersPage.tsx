import { useEffect, useState } from "react";
import { api } from "../api";
import type { Order } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
      } catch (err: unknown) {
        // If the token is missing/expired, prevent noisy errors and send user to login.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const status = (err as any)?.response?.status;
        if (status === 401) {
          try {
            logout();
          } catch {
            // ignore
          }
          navigate("/login", { state: { from: "/orders" } });
        } else {
          setOrders([]);
        }
      }
    };
    void fetchOrders();
  }, [logout, navigate, user]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
      <div className="mt-4 space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="text-sm font-semibold">Order #{order._id.slice(-6)}</p>
              <p className="rounded bg-slate-100 px-2 py-1 text-xs">{order.status}</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">Total: ${order.totalAmount.toFixed(2)}</p>
            <p className="text-sm text-slate-600">Ship to: {order.shippingAddress}</p>

            {order.items?.length ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Items
                </p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
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
          </article>
        ))}
      </div>
    </section>
  );
};

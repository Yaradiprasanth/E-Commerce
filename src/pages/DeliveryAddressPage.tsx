import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Truck, MapPin } from "lucide-react";

const SHIPPING_ADDRESS_KEY = "checkout_shipping_address_v1";

export const DeliveryAddressPage = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  const [shippingAddress, setShippingAddress] = useState(
    () => localStorage.getItem(SHIPPING_ADDRESS_KEY) || ""
  );
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    country: "India",
    fullName: "",
    mobileNumber: "",
    pincode: "",
    flatHouse: "",
    area: "",
    landmark: "",
    townCity: "",
    state: "",
  });

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
      navigate("/login", { state: { from: "/delivery-address" } });
    }
  }, [cart.length, navigate, user]);

  const onContinue = () => {
    setError(null);
    const value = shippingAddress.trim();
    if (!value) {
      setError("Enter a delivery address to continue.");
      return;
    }
    localStorage.setItem(SHIPPING_ADDRESS_KEY, value);
    navigate("/payment-method");
  };

  const composeAddress = (d: typeof draft) => {
    const parts: string[] = [];
    if (d.fullName.trim()) parts.push(d.fullName.trim());
    if (d.mobileNumber.trim()) parts.push(d.mobileNumber.trim());
    const line1 = [d.flatHouse.trim(), d.area.trim()].filter(Boolean).join(", ");
    const line2 = [
      d.landmark.trim() ? `Landmark: ${d.landmark.trim()}` : null,
      d.townCity.trim(),
      d.state.trim(),
    ]
      .filter(Boolean)
      .join(", ");
    const line3 = d.pincode.trim() ? `PIN: ${d.pincode.trim()}` : "";

    return `${parts.join(" | ")}${parts.length ? " | " : ""}${line1}${line2 ? `, ${line2}` : ""}${
      line3 ? `, ${line3}` : ""
    }${d.country.trim() ? `, ${d.country.trim()}` : ""}`.replace(/\s+/g, " ").trim();
  };

  const onSaveDraft = () => {
    setError(null);
    const d = draft;
    if (!d.fullName.trim()) return setError("Enter full name.");
    if (!d.mobileNumber.trim()) return setError("Enter mobile number.");
    if (!d.pincode.trim()) return setError("Enter pincode.");
    if (!d.flatHouse.trim()) return setError("Enter flat/house details.");
    if (!d.area.trim()) return setError("Enter area/street details.");
    if (!d.townCity.trim()) return setError("Enter town/city.");
    if (!d.state.trim()) return setError("Enter state.");

    const composed = composeAddress(d);
    if (!composed) return setError("Enter a valid delivery address.");

    setShippingAddress(composed);
    localStorage.setItem(SHIPPING_ADDRESS_KEY, composed);
    setIsAddAddressOpen(false);
  };

  // Manual save only: address is stored when user clicks "Save address".

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Delivery address</h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck size={14} className="text-emerald-600" /> Secure checkout
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to cart
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
              <div>
                <div className="text-sm font-semibold text-slate-900">Address</div>
                <div className="mt-1 text-xs text-slate-500">Delivery details for your order.</div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <MapPin size={18} className="mt-0.5 text-emerald-700" />
                <div className="w-full">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Deliver to</p>
                  <p className="mt-1 min-h-[48px] text-sm font-semibold text-slate-900">
                    {shippingAddress || "No address saved yet."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setIsAddAddressOpen(true);
                    }}
                    className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                  >
                    Add new address
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500">Quick picks:</span>
                {["221B Baker Street, London", "MG Road, Bengaluru", "32nd Avenue, New Delhi"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setError(null);
                      setShippingAddress(s);
                      localStorage.setItem(SHIPPING_ADDRESS_KEY, s);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              <button
                type="button"
                onClick={onContinue}
                className="w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
              >
                Continue to Payment
              </button>

              <p className="text-center text-xs text-slate-500">
                By placing this order, you agree to terms and returns policy.
              </p>
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

      {isAddAddressOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 pt-24 pb-10">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Enter a new delivery address</h2>
                <p className="mt-1 text-sm text-slate-600">Fill details below and save.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddAddressOpen(false);
                  setError(null);
                }}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              {shippingAddress ? (
                <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">Saved address</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{shippingAddress}</p>
                  <button
                    type="button"
                    onClick={() => {
                      // Reuse saved address without re-typing.
                      setIsAddAddressOpen(false);
                      setError(null);
                    }}
                    className="mt-3 w-full rounded-lg bg-amber-400 px-4 py-2 text-sm font-black text-slate-900 transition hover:bg-amber-300"
                  >
                    Use saved address
                  </button>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Country</label>
                  <select
                    value={draft.country}
                    onChange={(e) => setDraft((v) => ({ ...v, country: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    PIN code <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={draft.pincode}
                    onChange={(e) => setDraft((v) => ({ ...v, pincode: e.target.value }))}
                    placeholder="6 digits (0-9)"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={draft.fullName}
                    onChange={(e) => setDraft((v) => ({ ...v, fullName: e.target.value }))}
                    placeholder="First and last name"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Mobile number <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={draft.mobileNumber}
                    onChange={(e) => setDraft((v) => ({ ...v, mobileNumber: e.target.value }))}
                    placeholder="10 digits"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Flat / House / Building / Company / Apartment <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={draft.flatHouse}
                    onChange={(e) => setDraft((v) => ({ ...v, flatHouse: e.target.value }))}
                    placeholder="House no, building, street..."
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Area / Street / Sector / Village <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={draft.area}
                    onChange={(e) => setDraft((v) => ({ ...v, area: e.target.value }))}
                    placeholder="Area, street, sector..."
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Landmark (optional)</label>
                  <input
                    value={draft.landmark}
                    onChange={(e) => setDraft((v) => ({ ...v, landmark: e.target.value }))}
                    placeholder="e.g. near a hospital"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Town / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={draft.townCity}
                    onChange={(e) => setDraft((v) => ({ ...v, townCity: e.target.value }))}
                    placeholder="Town / City"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={draft.state}
                    onChange={(e) => setDraft((v) => ({ ...v, state: e.target.value }))}
                    placeholder="State"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2 text-xs text-slate-500">
                  Note: this is a demo checkout. We store the address in `localStorage` until you place the order.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 p-5 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAddAddressOpen(false);
                  setError(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSaveDraft}
                className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-black text-slate-900 transition hover:bg-amber-300"
              >
                Save address
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


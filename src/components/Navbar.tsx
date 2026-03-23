import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, Truck, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState } from "react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [searchText, setSearchText] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const submitSearch = () => {
    const query = searchText.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-30 shadow-sm">
      <div className="border-b border-slate-800 bg-[#131921] text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-3 py-3 md:px-4">
          <Button
            variant="outline"
            size="icon"
            className="border-slate-600 bg-transparent text-white hover:bg-slate-700 md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </Button>
          <Link to="/" className="shrink-0 text-xl font-black tracking-wide text-white">
            Prime<span className="text-amber-400">Kart</span>
          </Link>
          <div className="hidden items-center text-xs text-slate-300 lg:flex">
            <span className="mr-1">Deliver to</span>
            <span className="font-semibold text-white">India</span>
          </div>
          <div className="hidden flex-1 items-center gap-0 overflow-hidden rounded-lg border border-slate-300 bg-white md:flex">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
              }}
              placeholder="Search electronics, fashion, home essentials..."
              className="h-10 rounded-none border-0 bg-white px-4 text-sm text-slate-500 focus-visible:ring-0"
              aria-label="Search"
            />
            <Button variant="commerce" className="h-10 rounded-none px-4" onClick={submitSearch}>
              <Search size={17} />
            </Button>
          </div>
          <nav className="ml-auto hidden items-center gap-4 text-sm md:flex">
            <NavLink to="/" className="rounded px-2 py-1 hover:bg-slate-700">
              Home
            </NavLink>
            <NavLink to="/orders" className="rounded px-2 py-1 hover:bg-slate-700">
              Orders
            </NavLink>
            {user?.isAdmin && (
              <NavLink to="/admin" className="rounded px-2 py-1 hover:bg-slate-700">
                Admin
              </NavLink>
            )}
          </nav>
          <Link to="/cart" className="relative rounded-md p-2 hover:bg-slate-700">
            <ShoppingCart size={20} />
            <span className="ml-1 hidden text-xs font-semibold md:inline">Cart</span>
            {count > 0 && (
              <Badge variant="accent" className="absolute -right-2 -top-2 h-5 min-w-5 justify-center px-1 text-[10px] font-bold text-slate-900">
                {count}
              </Badge>
            )}
          </Link>
          {user ? (
            <Button onClick={logout} variant="outline" size="sm" className="border-slate-500 bg-transparent text-white hover:bg-slate-700">
              Logout
            </Button>
          ) : (
            <Link to="/login" className="rounded-md border border-slate-500 px-2 py-1.5 text-xs hover:bg-slate-700">
              <UserCircle2 size={16} className="inline-block align-middle" /> Sign In
            </Link>
          )}
        </div>
      </div>
      <div className="border-b border-slate-700 bg-[#232f3e]">
        <div className="mx-auto flex w-full max-w-7xl flex-nowrap items-center gap-4 overflow-x-auto px-4 py-2 text-xs font-medium text-slate-100">
          <Link to="/" className="whitespace-nowrap font-semibold tracking-wide hover:underline">All</Link>
          <Link to="/deals" className="whitespace-nowrap hover:underline">Today's Deals</Link>
          <Link to="/best-sellers" className="whitespace-nowrap hover:underline">Best Sellers</Link>
          <Link to="/category/Electronics" className="whitespace-nowrap hover:underline">Electronics</Link>
          <Link to="/category/Fashion" className="whitespace-nowrap hover:underline">Fashion</Link>
          <Link to="/category/Home" className="whitespace-nowrap hover:underline">Home</Link>
          <Link to="/category/Beauty" className="whitespace-nowrap hover:underline">Beauty</Link>
          <Link to="/category/Sports" className="whitespace-nowrap hover:underline">Sports</Link>
          <Link to="/category/Toys" className="whitespace-nowrap hover:underline">Toys</Link>
          <Badge variant="accent" className="ml-auto hidden md:inline-flex">Limited Time Offers</Badge>
        </div>
      </div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-4 py-2 text-xs font-medium text-slate-600">
          <p className="flex items-center gap-1">
            <Truck size={14} className="text-emerald-600" /> Free delivery above $49
          </p>
          <p>Top brands. Daily deals. Secure checkout.</p>
          <Badge variant="accent" className="ml-auto">Prime-quality shopping experience</Badge>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={closeMobile}
          aria-hidden={!mobileOpen}
        >
          <div
            className="absolute left-0 top-0 h-full w-[88%] max-w-xs bg-[#0f172a] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
              <div className="text-sm font-semibold text-white">
                Prime<span className="text-amber-400">Kart</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-700 bg-transparent text-white hover:bg-slate-800"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3 px-4 py-4">
              <div className="rounded-xl border border-slate-800 bg-white p-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search products..."
                    className="h-9 border-0 bg-white px-3 text-sm text-slate-700"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitSearch();
                        closeMobile();
                      }
                    }}
                  />
                  <Button
                    variant="commerce"
                    className="h-9 w-10 rounded-md px-0"
                    onClick={() => {
                      submitSearch();
                      closeMobile();
                    }}
                    aria-label="Search"
                  >
                    <Search size={17} />
                  </Button>
                </div>
              </div>

              <nav className="space-y-1 text-sm">
                <NavLink
                  to="/"
                  className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                  onClick={closeMobile}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/orders"
                  className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                  onClick={closeMobile}
                >
                  Orders
                </NavLink>
                {user?.isAdmin && (
                  <NavLink
                    to="/admin"
                    className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                    onClick={closeMobile}
                  >
                    Admin
                  </NavLink>
                )}
                <Link
                  to="/cart"
                  className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                  onClick={closeMobile}
                >
                  Cart {count > 0 ? `(${count})` : ""}
                </Link>
              </nav>

              <div className="pt-2">
                {user ? (
                  <Button
                    className="w-full bg-white text-slate-900 hover:bg-slate-200"
                    onClick={() => {
                      logout();
                      closeMobile();
                      navigate("/");
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
                  >
                    <UserCircle2 size={16} className="mr-2" /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

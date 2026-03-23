import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-[#131a22] text-slate-200">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h4 className="text-base font-bold text-white">Get to Know Us</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link to="/">About PrimeKart</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Press Releases</Link></li>
            <li><Link to="/">PrimeKart Science</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-bold text-white">Connect with Us</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link to="/">Facebook</Link></li>
            <li><Link to="/">Twitter</Link></li>
            <li><Link to="/">Instagram</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-bold text-white">Make Money with Us</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link to="/">Sell on PrimeKart</Link></li>
            <li><Link to="/">Sell under PrimeKart Accelerator</Link></li>
            <li><Link to="/">Protect and Build Your Brand</Link></li>
            <li><Link to="/">Become an Affiliate</Link></li>
            <li><Link to="/">Advertise Your Products</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-bold text-white">Let Us Help You</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link to="/login">Your Account</Link></li>
            <li><Link to="/orders">Returns Centre</Link></li>
            <li><Link to="/">Recalls and Product Safety Alerts</Link></li>
            <li><Link to="/">100% Purchase Protection</Link></li>
            <li><Link to="/">Help</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 py-5 text-center text-xs text-slate-400">
        <p className="text-sm font-black text-white">
          Prime<span className="text-amber-400">Kart</span>
        </p>
        <p className="mt-2">Copyright {new Date().getFullYear()} PrimeKart. All rights reserved.</p>
      </div>
    </footer>
  );
};

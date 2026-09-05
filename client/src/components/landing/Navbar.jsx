import { User, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-6 pt-6">
      <nav className="flex items-center justify-between rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white backdrop-blur-sm">
        <div className="cursor-pointer text-xl font-semibold tracking-tight">
          shrinkr.
        </div>

        <div className="hidden items-center gap-7 text-sm text-white/80 md:flex">
          <Link className="transition hover:text-white" to="#">
            Features
          </Link>
          <Link className="transition hover:text-white" to="#">
            Pricing
          </Link>
          <Link className="transition hover:text-white" to="#">
            Developers
          </Link>
          <Link className="transition hover:text-white" to="#">
            Blog
          </Link>
          <Link className="transition hover:text-white" to="#">
            Contact
          </Link>
        </div>

        <button className="cursor-pointer items-center rounded-full bg-white/15 px-4 py-2 text-sm transition hover:bg-white/20">
          {user ? (
            <Link to="/dashboard" className="flex gap-1">
              <LayoutDashboard size={17} strokeWidth={1.5} />
              Dashboard
            </Link>
          ) : (
            <Link to="/signin" className="flex gap-1">
              <User size={17} strokeWidth={1.5} />
              Sign in
            </Link>
          )}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;

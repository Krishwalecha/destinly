import { User } from "lucide-react";

const Navbar = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-6">
      <nav className="flex items-center justify-between rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white backdrop-blur-sm">
        
        <div className="cursor-pointer text-xl font-semibold tracking-tight">
          shrinkr.
        </div>

        <div className="hidden items-center gap-7 text-sm text-white/80 md:flex">
          <a className="transition hover:text-white" href="#">
            Features
          </a>
          <a className="transition hover:text-white" href="#">
            Pricing
          </a>
          <a className="transition hover:text-white" href="#">
            Developers
          </a>
          <a className="transition hover:text-white" href="#">
            Blog
          </a>
          <a className="transition hover:text-white" href="#">
            Contact
          </a>
        </div>

        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm transition hover:bg-white/20">
          <User size={17} strokeWidth={1.5} />
          Sign in
        </button>

      </nav>
    </div>
  );
};

export default Navbar;
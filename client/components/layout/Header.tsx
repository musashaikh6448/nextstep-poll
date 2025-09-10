import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/trending", label: "Trending" },
  { to: "/candidates", label: "Candidates" },
  { to: "/about", label: "About" },
  { to: "/profile", label: "Profile" },
  { to: "/create", label: "Create" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 md:bg-background/60 backdrop-blur-xl">
      <div className="tricolor-strip" />
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4">
        <BrandLogo />

        <nav className="hidden md:flex items-center gap-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "bg-primary/10 text-foreground" : "text-foreground/80 hover:bg-white/5"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/create"
            className="relative hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring btn-glow"
          >
            New Election Poll
          </Link>
          <ThemeToggle />

          {/* Right-side hamburger for mobile */}
          <button className="md:hidden p-2 rounded-md ml-2 bg-background/95 border border-white/8" onClick={() => setOpen(true)} aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {/* Mobile menu overlay on right */}
        {open && (
          <div className="fixed inset-0 z-[9999]">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="absolute right-0 top-0 h-50 w-80 bg-background/100 dark:bg-[#0b1220] p-4 border-l border-white/8 shadow-2xl overflow-y-auto transform transition-transform duration-300">
              <div className="flex items-center justify-between">
                <BrandLogo />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 rounded-md bg-white/5 text-foreground/80 hover:bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-2">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-white/5 focus:outline-none focus:bg-white/6">{n.label}</Link>
                ))}
              </nav>
              <div className="mt-6">
                <Link to="/create" onClick={() => setOpen(false)} className="block w-full text-center rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">Create Poll</Link>
              </div>
              <div className="mt-4">
                <ThemeToggle />
              </div>
            </aside>
          </div>
        )}
      </div>
    </header>
  );
}

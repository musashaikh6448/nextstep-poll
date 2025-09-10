import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((v) => !v)}
      className="group relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/60 btn-glow"
      aria-label="Toggle theme"
      aria-pressed={isDark}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/8 via-cyan-500/8 to-pink-500/8 blur-xl opacity-100 group-hover:opacity-100 transition-opacity"></span>
      <span className="relative z-10 inline-flex items-center gap-2">
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-cyan-300">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-purple-600">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        )}
        <span className="hidden sm:inline text-foreground/80">{isDark ? "Dark" : "Light"}</span>
      </span>
    </button>
  );
}

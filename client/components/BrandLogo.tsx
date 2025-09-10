import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="NextStep Home"
    >
      {/* Square Logo Container */}
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] opacity-70 blur-[6px]" />
        <div className="relative z-10 h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20" />
      </div>

      {/* Brand Name and Tagline */}
      <div className="flex flex-col">
        <span className="text-base md:text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))]">
          NextStep
        </span>
        <span className="text-xs text-foreground/70">Indian Elections</span>
      </div>

      {/* Indian Flag SVG */}
      <span className="ml-2 inline-flex items-center" aria-hidden="true">
        <svg
          width="36"
          height="16"
          viewBox="0 0 36 16"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-hidden"
          role="img"
          aria-label="Indian flag"
        >
          <rect width="36" height="16" fill="#FF9933" />
          <rect y="5.333" width="36" height="16" fill="#FFFFFF" />
          <rect y="10.666" width="36" height="16" fill="#138808" />
          <circle cx="18" cy="8" r="1.6" fill="#0B5FFF" />
        </svg>
      </span>
    </Link>
  );
}

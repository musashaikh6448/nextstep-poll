import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="NextStep Home">
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-aurora animate-[float_6s_ease-in-out_infinite]">
        <span className="absolute inset-0 rounded-xl opacity-70 blur-[6px] gradient-aurora"></span>
        <span className="relative z-10 h-8 w-8 rounded-lg glass" />
      </span>
      <div className="flex flex-col">
        <span className="text-base md:text-lg font-semibold tracking-tight">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            NextStep
          </span>
        </span>
        <span className="text-xs text-foreground/70">Indian Elections</span>
      </div>
      <span className="ml-3 inline-flex items-center" aria-hidden>
        {/* Inline SVG Indian flag small */}
        <svg width="36" height="16" viewBox="0 0 36 16" xmlns="http://www.w3.org/2000/svg" className="rounded-sm overflow-hidden" role="img" aria-label="Indian flag">
          <rect width="36" height="16" fill="#FF9933" />
          <rect y="5.333" width="36" height="5.333" fill="#FFFFFF" />
          <rect y="10.666" width="36" height="5.333" fill="#138808" />
          <circle cx="18" cy="8" r="1.6" fill="#0B5FFF" />
        </svg>
      </span>
    </Link>
  );
}

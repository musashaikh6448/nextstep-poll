import darkLogo from "./darkLogo-removebg-preview.png";
import lightLogo from "./lightLogo-removebg-preview.png";

interface FooterProps {
  theme: "dark" | "light";
}

export default function Footer({ theme }: FooterProps) {
  // Debug: Log the current theme
  console.log("Current theme:", theme);

  return (
    <footer className="mt-16 w-full border-t border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <img
          src={theme === "dark" ? darkLogo : lightLogo}
          alt="NextStep"
          className="h-16 w-auto object-contain"
        />
        <p className="text-sm text-foreground/70">
          © {new Date().getFullYear()} NextStep. All rights reserved.
        </p>
        <div className="flex items-center gap-3 text-sm text-foreground/70">
          <span className="hover:text-foreground">Developed by NextStep Team</span>
          <span className="opacity-30">•</span>
          <a href="/trending" className="hover:text-foreground">Trending</a>
          <span className="opacity-30">•</span>
          <a href="/create" className="hover:text-foreground">Create Poll</a>
        </div>
      </div>
    </footer>
  );
}
